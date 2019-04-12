import { Index, Field, Token } from '../lib/index/withPosition.js';
import { MatchAllQuery, BoolQuery, TermsQuery, MatchQuery } from '../lib/dsl.js';
import assert from 'assert';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

import util from 'util';
describe('DSL', () => {
    var field = null;
    var index = null;
    beforeEach( () => {
        field = new Field({
            pipeline: {
                run: function (str) { return str.split(" ").map((o) => { return new Token(o.toLowerCase()); }) }
            }
        });
        index = new Index({
            fields: {
                content: field
            }
        });
        index.add([
            {
                id: 1,
                content: "The quick fox jumped over the lazy dog"
            },
            {
                id: 2,
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas viverra enim non purus rutrum porta ut non urna. Nullam eu ante eget nisi laoreet pretium. Curabitur varius velit vel viverra facilisis. Pellentesque et condimentum mauris. Quisque faucibus varius interdum. Fusce cursus pretium tempus. Ut gravida tortor et mi dignissim sagittis. Aliquam ullamcorper dignissim arcu sollicitudin fermentum. Nunc elementum tortor ex, sit amet posuere lectus accumsan quis. Vivamus sit amet eros blandit, sagittis quam at, vulputate felis. Ut faucibus pretium feugiat. Fusce diam felis, euismod ac tellus id, blandit venenatis dolor. Nullam porttitor suscipit diam, a feugiat dui pharetra at."
            },
            {
                id: 3,
                content: "Lorem dog"
            }
        ]);
        return true;
    });

    describe('primitives', () => {
        describe('match_all', () => {
            it('Correctly operates a match_all query', () => {
                var query = new MatchAllQuery({});
                var result = query.score(index, {});
                    assert.equal(result.length, 3);
                    for (var o of result) {
                        assert.equal(o.score, 1);
                    }
            });
        });
        describe('terms', () => {
            it('performs base functionality', () => {
                var query = new TermsQuery({
                    field: 'content',
                    terms: ['fox']
                });
                var result = query.score(index, {});
                    assert.equal(result.length, 1);
                    assert.equal(result[0].ref, 1);
            });
            it('boosts', () => {
                var non_Boost = new TermsQuery({
                    field: 'content',
                    terms: ['fox']
                });
                var query = new TermsQuery({
                    field: 'content',
                    terms: ['fox'],
                    boost: 2
                });
                var results = [non_Boost.score(index, {}), query.score(index, {})];
                    assert.equal(results[0].length, results[1].length);
                    assert.equal(2*results[0][0].score, results[1][0].score);
            });
        });
        describe('bool', () => {
            it('filters via must functionality', () => {
                var query = new BoolQuery({
                    must: new TermsQuery({
                        field: 'content',
                        terms: ['lorem']
                    }),
                    should: [
                        new TermsQuery({
                            field: 'content',
                            terms: ['dog']
                        })
                    ]
                });
                var result = query.score(index, {});
                    assert.equal(result.length, 1);
            })
            it('filters via must_not functionality', () => {
                var query = new BoolQuery({
                    must: new TermsQuery({
                        field: 'content',
                        terms: ['lorem']
                    }),
                    must_not: new TermsQuery({
                        field: 'content',
                        terms: ['ipsum']
                    }),
                    should: [
                        new TermsQuery({
                            field: 'content',
                            terms: ['dog']
                        })
                    ]
                });
                var result = query.score(index, {});
                    assert.equal(result.length, 0);
            })
        })
        describe('match', () => {
            it('performs base functionality', () => {
                var query = new MatchQuery({
                    field: 'content',
                    query: 'brown fox'
                });
                var result = query.score(index, {});
                    assert.equal(result.length, 1);
                    assert.equal(result[0].ref, 1);
            })
            it('honours minimum_should_match', () => {
                var query = new MatchQuery({
                    field: 'content',
                    query: 'brown fox quick',
                    minimum_should_match: 2
                });
                var result = query.score(index, {});
                    assert.equal(result.length, 1);
                    assert.equal(result[0].ref, 1);
            })
            it('honours and operator', () => {
                var query = new MatchQuery({
                    field: 'content',
                    query: 'fox quick',
                    operator: "and"
                });
                var result = query.score(index, {});
                    assert.equal(result.length, 1);
                    assert.equal(result[0].ref, 1);
            })
        })
    });
});