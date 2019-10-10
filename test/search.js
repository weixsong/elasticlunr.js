
import elasticlunr from '../lib/elasticlunr.js';
import assert from 'assert';

describe('elasticlunr search', function() {
  var idx = null;
  beforeEach(function() {
    idx = new elasticlunr.Index;
    idx.addField('body');
    idx.addField('title');

    ;([{
      id: 'a',
      title: 'Mr. Green kills Colonel Mustard',
      body: 'Mr. Green killed Colonel Mustard in the study with the candlestick. Mr. Green is not a very nice fellow.',
      wordCount: 19
    },{
      id: 'b',
      title: 'Plumb waters green plant ',
      body: 'Professor Plumb has a green plant in his study',
      wordCount: 9
    },{
      id: 'c',
      title: 'Scarlett helps Professor',
      body: 'Miss Scarlett watered Professor Plumbs green plant while he was away from his office last week.',
      wordCount: 16
    },{
      id: 'd',
      title: 'title',
      body: 'handsome',
    },{
      id: 'e',
      title: 'title abc',
      body: 'hand',
    }]).forEach(function (doc) { idx.addDoc(doc); });

    this.idx = idx;
  });

  it('returns the correct results', function() {

    var results = idx.search();
    assert.deepEqual(results, []);

    var results = idx.search('green plant');
    assert.equal(results.length, 3);
    assert.equal(results[0].ref, 'b');

    var results = idx.search('foo');
    assert.equal(results.length, 0);

    var results = idx.search('foo green')
    assert.equal(results.length, 3);

    var results = idx.search('green foo');
    assert.equal(results.length, 3);

    var results = idx.search('professor');
    assert.equal(results.length, 2);
    assert.equal(results[0].ref, 'c');

    var results = idx.search('title');
    assert.equal(results.length, 2);
    assert.equal(results[0].ref, 'd');

    var results = idx.search('plant', {fields: {title: {boost: 1}, body: {boost: 0}}});
  
    assert.equal(results.length, 1);
    assert.equal(results[0].ref, 'b');

    var results = idx.search({title: 'green plant'}, {expand: true, bool: 'AND'});
    assert.equal(results.length, 1);

    var results = idx.search({title: 'gre plant'}, {expand: true, bool: 'AND'});
    assert.equal(results.length, 1);

    var results = idx.search({title: 'plant', body: 'Plumb'}, {bool: 'AND'});
    assert.equal(results.length, 1);
    
    var results = idx.search({title: 'blue plant'}, {bool: 'AND'});
    assert.equal(results.length, 0);

    var results = idx.search({title: 'plant red'}, {bool: 'AND'});
    assert.equal(results.length, 0);

    var results = idx.search({title: 'helps', body: 'nice'});
  
    assert.equal(results.length, 2);
    assert.equal(results[0].ref, 'c');
    assert.equal(results[1].ref, 'a');
  });
});

describe('elastic-like DSL', function() {
  var idx = null;
  beforeEach(() => {
    idx = new elasticlunr.Index();
    idx.addField('body');
    idx.addField('title');

    ([{
      id: 'a',
      title: 'Mr. Green kills Colonel Mustard',
      body: 'Mr. Green killed Colonel Mustard in the study with the candlestick. Mr. Green is not a very nice fellow.',
      wordCount: 19
    },{
      id: 'b',
      title: 'Plumb waters green plant ',
      body: 'Professor Plumb has a green plant in his study',
      wordCount: 9
    },{
      id: 'c',
      title: 'Scarlett helps Professor',
      body: 'Miss Scarlett watered Professor Plumbs green plant while he was away from his office last week.',
      wordCount: 16
    },{
      id: 'd',
      title: 'title',
      body: 'handsome',
    },{
      id: 'e',
      title: 'title abc',
      body: 'hand',
    }]).forEach(function (doc) { idx.addDoc(doc); });

    this.idx = idx;
  });
  describe('terms', () => {
    it('turns a no-field terms into match_all', () => {
      var results = idx.search({
        query: {
          terms: {}
        }
      });
      assert.equal(results.length, 5);
    })
    it('allows multi-field terms query', () => {
      var results = idx.search({
        query: {
          terms: {
            title: 'green',
            body: 'study'
          }
        }
      });
      assert.equal(results.length, 2);
    })
  })
  describe('highlighting', () => {
    it('properly highlights single-field queries', () => {
      var results = idx.search({
        query: {
          bool: {
            filter: [{
              match: {
                title: 'green'
              }
            }],
            should: [{
              match: {
                body: 'study'
              }
            }]
          }
        }
      });
      assert.equal(results.length, 2);
      assert.equal(results[0].ref, 'a');
      assert.equal(results[1].ref, 'b');
      assert.equal(idx.highlight(results[0].ref, results[0].positions)('<i>', '</i>').body, "Mr. Green killed Colonel Mustard in the <i>study</i> with the candlestick. Mr. Green is not a very nice fellow.");
      assert.equal(idx.highlight(results[1].ref, results[1].positions)('<i>', '</i>').body, "Professor Plumb has a green plant in his <i>study</i>");
    })
  })
  describe('bool query', () => {
    it('allows pre-filtering', () => {
      var results = idx.search({
        query: {
          bool: {
            filter: [{
              match: {
                title: 'green'
              }
            }],
            should: [{
              match: {
                body: 'study'
              }
            }]
          }
        }
      });
      assert.equal(results.length, 2);
    })
    it('properly handles must_not', () => {
      var r1 = idx.search({
        query:{
          bool:{
            must_not: {
              match: {
                title: 'waters'
              }
            },
            should: [{
              match: {
                title: 'green'
              }
            }]
          }
        }
      });
      var r2 = idx.search({
        query: {
          bool: {
            must: {
              not: {
                match: {
                  title: 'waters'
                }
              }
            },
            should: [{
              match: {
                title: 'green'
              }
            }]
          }
        }
      });
      assert.deepEqual(r1, r2);
    })
    it('manages to parse a bool query', () => {
      var results = idx.search({
        query: {
          bool: {
            must: {
              match: {
                title: 'green'
              }
            },
            should: [{
              match: {
                body: 'study'
              }
            }]
          }
        }
      });
      assert.equal(results.length, 2);
    })
  });
  describe('match', () => {
    it('turns a no-field match into match_all', () => {
      var results = idx.search({
        query: {
          match: {}
        }
      });
      assert.equal(results.length, 5);
    })
    it('Allows multi-field matching', () => {
      var results = idx.search({
        query: {
          match: {
            title: 'mustard',
            body: 'scarlett',
            operator: 'and'
          }
        }
      });
      assert.equal(results.length, 0);

      var results2 = idx.search({
        query: {
          match: {
            title: 'professor',
            body: 'scarlett',
            operator: 'and'
          }
        }
      });
      assert.equal(results2.length, 1);
    })
    it('Allows fuzzing', () => {
      var results = idx.search({
        query: {
          match: {
            title: 'grene',
            fuzziness: 2
          }
        }
      });
      assert.equal(results.length, 2);
    })
  });
});
