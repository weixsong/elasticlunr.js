class Repository {
  constructor(queries) {
    this.queries = queries || {};
  }

  parse(element, options, queryOptions) {
    if (!this.queries[element]) throw Error(`Unknown query type ${element}`);
    return this.queries[element](this, options, queryOptions);
  }

  register(element, parser) {
    this.queries[element] = parser;
  }
}

let QueryRepository = new Repository();

class Query {
  filter(index, options) {
    var results = this.score(index, options);

    return results.filter(({ id, score }) => score > 0);
  }
  score(index, options) {
    throw Error('Please extend the score() method');
  }
  // Basic query
  rewrite(index) {
    return this;
  }
}

class NotQuery extends Query {

  constructor(innerQuery) {
    super(innerQuery);
    this.inner = innerQuery;
  }

  score(index, options) {
    var queryAll = index.all(options), queryScore = this.inner.score(index, options);
    var matchedIDS = queryScore.map((doc) => doc.ref);

    return queryAll.filter((id) => matchedIDS.indexOf(id) < 0).map((id) => {
      return {
        ref: id,
        score: 1
      };
    });
  }
}

QueryRepository.register('not', (repo, options, queryOptions) => {
  var keys = Object.keys(options);

  if (!keys || !keys[0]) throw Error('A not query must have a query type as root element');
  return new NotQuery(QueryRepository.parse(keys[0], options[keys[0]], options));
});

class BoolQuery extends Query {

  constructor(options) {
    super(options);
    this.should = options.should || [];
    this.must = options.must || false;
    this.must_not = options.must_not || false;
    this.filter = options.filter;
    this.minimum_should_match = options.minimum_should_match || 1;
  }

  rewrite(idx) {
    var filters = this.filter || [];

    var q = new BoolQuery({
      should: (this.should || []).map((q) => q.rewrite(idx)),
      must: this.must ? this.must.rewrite(idx) : false,
      minimum_should_match: this.minimum_should_match
    });

    if (this.must_not) {
      filters.push(new NotQuery(this.must_not.rewrite(idx)));
    }
    if (filters && filters.length) {
      q.filter = filters.map((r) => r.rewrite(idx));
    }
    return q;
  }
  score(index, options, isRewritten) {

    if (!isRewritten) {
      return this.rewrite(index).score(index, options, true);
    }

    // Run filter context and must/must not if any
    let filter_results = false;

    if (this.filter && this.filter.length) {
      filter_results = this.filter.reduce((currentDocSet, query) => {
        let q = currentDocSet !== false ? {
          filtered: currentDocSet.map((doc) => doc.ref)
        } : {};

        return query.filter(index, q);
      }, filter_results);
    }

    let docs = {};

    if (this.must) {
      // This score counts
      let q = filter_results !== false ? {
        filtered: filter_results.map((doc) => doc.ref)
      } : {};

      filter_results = this.must.score(index, q);
    }
    let filterQuery = {};

    if (filter_results !== false) {
      filterQuery.filtered = [];
      filter_results.forEach((doc) => {
        filterQuery.filtered.push(doc.ref);
        docs[doc.ref] = {
          ref: doc.ref,
          positions: [],
          score: doc.score || 0,
          matched: 0
        };
      });
    }
    this.should.reduce(
      (fq, query) => {
        let results = query.score(index, fq);

        results.forEach((doc) => {
          if (!docs[doc.ref]) {
            docs[doc.ref] = {
              ref: doc.ref,
              positions: {},
              score: 0,
              matched: 0
            };
          }
          Object.entries(doc.positions).forEach(([field, tokens]) => {
            if (!docs[doc.ref].positions[field]) docs[doc.ref].positions[field] = [];
            tokens.forEach((t) => docs[doc.ref].positions[field].push(t));
          });
          docs[doc.ref].score += doc.score;
          docs[doc.ref].matched++;
        });
        return fq;
      }, filterQuery);
    return Object.entries(docs).map((o) => o[1]).filter((doc) => {
      return doc.matched >= this.minimum_should_match && doc.score > 0;
    });
  }
}
QueryRepository.register('bool', (repo, options, queryOptions) => {
  var opts = {};

  if (options.should) {
    opts.should = options.should.map((query) => {
      var k = Object.keys(query);

      if (!k || !k[0]) return repo.parse('match_all', {});
      return repo.parse(k[0], query[k[0]], query);
    });
  }
  if (options.filter) {
    opts.filter = options.filter.map((query) => {
      var k = Object.keys(query);

      if (!k || !k[0]) return repo.parse('match_all', {});
      return repo.parse(k[0], query[k[0]], query);
    });
  }
  if (options.must) {
    let must_k = Object.keys(options.must);

    if (must_k && must_k[0]) opts.must = repo.parse(must_k[0], options.must[must_k[0]], options.must);
  }
  if (options.must_not) {
    let must_not_k = Object.keys(options.must_not);

    if (must_not_k && must_not_k[0]) {
      opts.must_not = repo.parse(
        must_not_k[0],
        options.must_not[must_not_k[0]],
        options.must_not
      );
    }
  }
  if (options.minimum_should_match && options.minimum_should_match <= opts.should.length) {
    opts.minimum_should_match = options.minimum_should_match;
  }
  return new BoolQuery(opts);
});
// let QueryCache = {};

class TermsQuery extends Query {

  constructor(options) {
    super(options);
    this.minimum_should_match = options.minimum_should_match || 1;
    this.expand = !!options.expand;
    this.field = options.field || '';
    this.terms = options.terms || [];
    this.boost = options.boost || 1;
    this.fuzziness = options.fuzziness || 0;

    if (!Array.isArray(this.terms)) this.terms = [this.terms];
  }

  score(index, options) {
    if (!options) options = {};
    let query = {
      field: this.field,
      terms: this.expand ? this.terms.map((term) => new RegExp('^' + term + '.*')) : this.terms,
      fuzziness: this.fuzziness,
      minimum_should_match: this.minimum_should_match
    };

    if (options.filtered) {
      query.docs = (options || {}).filtered;
    }
    let docs = index.terms(query);
    let ids = Object.keys(docs);
    let matched = [];

    for (let i of ids) {
      let pickedScore = docs[i].map((t) => {
        return [t.tf * Math.pow(t.idf, 2) * t.norm, t];
      }).reduce((i, t) => t[0] > i[0] ? t : i, [0, undefined]);

      matched.push({
        ref: i,
        field: this.field,
        positions: {
          [this.field]: pickedScore[1].positions
        },
        score: pickedScore[0] * this.boost
      });
    }
    return matched;
  }
}
class MatchAllQuery extends Query {

  constructor(options) {
    super(options);
    this.boost = options.boost || 1;
  }

  score(index, options) {
    var docIds = index.all();

    return docIds.map((docId) => {
      return {
        ref: docId,
        score: this.boost
      };
    });
  }
}
class MatchQuery extends Query {

  constructor(options) {
    super(options);
    this.expand = !!options.expand;
    this.field = options.field || '';
    this.query = options.query || '';
    this.boost = options.boost || 1;
    this.fuzziness = options.fuzziness || 0;
    this.minMatch = options.minimum_must_match !== undefined ? options.minimum_must_match : 1;
    this.operator = options.operator === 'and' ? 'and' : 'or';
  }

  score(index, options) {
    // Rewrite
    return this.rewrite(index).score(index, options);
  }

  rewrite(index) {
    let tokens = index.analyze(this.field, this.query, {
      isQuery: true
    });

    if (!Array.isArray(tokens)) tokens = [tokens];
    let q;

    if (tokens.length > 1) {
      q = new TermsQuery({
        field: this.field,
        expand: this.expand,
        terms: tokens,
        fuzziness: this.fuzziness,
        boost: this.boost,
        minimum_should_match: (this.operator === 'and' && this.minMatch === 0) ? tokens.length : this.minMatch
      });
      /*
            q = new BoolQuery({
            should: tokens
                .map((token) => new TermsQuery({
                    field: this.field,
                    expand: this.expand,
                    terms: [token.toString()],
                    fuzziness: this.fuzziness,
                    boost: this.boost
                }))
            ,
            minimum_should_match: (this.operator === "and" && this.minMatch === 0) ? tokens.length : this.minMatch
            }); */
    } else if (tokens.length === 1) {
      q = new TermsQuery({
        field: this.field,
        expand: this.expand,
        terms: [tokens[0].toString()],
        fuzziness: this.fuzziness,
        boost: this.boost
      });
    } else {
      q = new MatchAllQuery({

      });
    }
    return q;
  }
}
QueryRepository.register('match', (repository, options, queryOptions) => {
  var fields = Object.entries(options).filter((r) => ['fuzziness', 'operator'].indexOf(r[0]) < 0);

  if (fields.length === 0) return repository.parse('match_all', {}, {});
  if (fields.length > 1) {
    return repository.parse('bool', {
      'should': fields.map(([fieldName, terms]) => {
        return {
          'match': {
            [fieldName]: terms,
            fuzziness: options.fuzziness,
            operator: options.operator
          },
          'expand': !!queryOptions.expand
        };
      }),
      'minimum_should_match': options && options.operator &&
        typeof options.operator === 'string' &&
        options.operator.toLowerCase() === 'and' ? fields.length : 1
    });
  }
  return new MatchQuery({
    field: fields[0][0],
    query: fields[0][1],
    fuzziness: options.fuzziness,
    expand: !!queryOptions.expand,
    operator: options &&
      options.operator &&
      typeof options.operator === 'string' &&
      options.operator.toLowerCase() === 'and' ? 'and' : 'or',
    minimum_must_match: options &&
      options.operator &&
      typeof options.operator === 'string' &&
      options.operator.toLowerCase() === 'and' ? 0 : 1
  });

});

QueryRepository.register('terms', (repository, options) => {
  var fields = Object.entries(options);

  if (fields.length === 0) return repository.parse('match_all', {}, {});
  if (fields.length > 1) {
    return repository.parse('bool', {
      'should': fields.map(([fieldName, terms]) => {
        return {
          'terms': {
            [fieldName]: terms
          }
        };
      })
    });
  }
  return new TermsQuery({
    field: fields[0][0],
    terms: fields[0][1]
  });

});

QueryRepository.register('match_all', (repository, options) => {
  return new MatchAllQuery({
    boost: options.boost || 1
  });
});
export { Repository, QueryRepository, Query, BoolQuery, MatchAllQuery, MatchQuery, TermsQuery };
