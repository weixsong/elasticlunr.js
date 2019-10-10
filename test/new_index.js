import { Index, Field, Token } from '../lib/index/withPosition.js';
import assert from 'assert';

describe('New index type', () => {
  it('allows the addition, removal and update of documents', () => {
    let o = new Field({
      pipeline: {
        run: function (str) { return str.split(" ").map((o) => { return new Token(o.toLowerCase()); }) }
      }
    });

    o.add([
      {
        id: 1,
        content: "The quick fox jumped over the lazy dog"
      },
      {
        id: 2,
        content: "Fox fox dog"
      }
    ]);
    o.add([{
      id: 3,
      content: "This is foo"
    }]);
    assert.deepEqual(o.all(), [1, 2, 3]);
    o.remove([2]);
    assert.deepEqual(o.all(), [1, 3]);
    var results = o.terms({
      field: 'content',
      terms: ['is']
    });
    assert.deepEqual(Object.keys(results), ['3']);
    o.update([{
      id: 1,
      content: 'Red foo'
    }]);
    var results = o.terms({
      field: 'content',
      terms: ['foo']
    });
    assert.deepEqual(Object.keys(results), ['1', '3']);
  })
  it('Correctly matches a terms query queries', () => {
    let o = new Field({
      pipeline: {
        run: function (str) { return str.split(" ").map((o) => { return new Token(o.toLowerCase()); }) }
      }
    });

    o.add([
      {
        id: 1,
        content: "The quick fox jumped over the lazy dog"
      },
      {
        id: 2,
        content: "Fox fox dog"
      }
    ]);

    var results = o.terms({
      field: "foo",
      terms: ["fox"]
    });
    assert.deepEqual(Object.keys(results), [1, 2]);
    var score1 = results[1][0].tf, score2 = results[2][0].tf;
    assert.equal(score1 < score2, true);
  });
  it('Correctly matches a filtered terms query queries', () => {
    let o = new Field({
      pipeline: {
        run: function (str) { return str.split(" ").map((o) => { return new Token(o.toLowerCase()); }) }
      }
    });

    o.add([
      {
        id: 1,
        content: "The quick fox jumped over the lazy dog"
      },
      {
        id: 2,
        content: "Fox fox dog"
      }
    ]);

    var results = o.terms({
      field: "foo",
      terms: ["fox"],
      docs: ['2']
    });
    assert.deepEqual(Object.keys(results), [2]);
  });
});