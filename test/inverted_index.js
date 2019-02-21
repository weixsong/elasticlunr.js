var elasticlunr = require("../lib/elasticlunr.js"),
    assert = require("assert");

describe('elasticlunr.InvertedIndex', function() {

  it('should behave as expected when creating the index and adding tokens', function() {
    var invertedIndex = new elasticlunr.InvertedIndex;

    assert.deepEqual(invertedIndex.root, { docs: {}, df: 0 });
    assert.equal(invertedIndex.root.df, 0);

    doc = { ref: 123, tf: 1},
    token = 'foo';

    invertedIndex.addToken(token, doc);

    assert.deepEqual(invertedIndex.root['f']['o']['o']['docs'][123], {tf: 1});
    assert.equal(invertedIndex.getDocFreq('foo'), 1);
    assert.equal(invertedIndex.getTermFrequency('foo', 123), 1);

    assert.ok(invertedIndex.hasToken('foo'));
    assert.ok(invertedIndex.hasToken('fo'));
    assert.ok(invertedIndex.hasToken('f'));
    assert.ok(!invertedIndex.hasToken('bar'));
    assert.ok(!invertedIndex.hasToken('foo '));
  });
  it('should allow adding another document to the token', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc1 = { ref: 123, tf: 1},
        doc2 = { ref: 456, tf: 1},
        token = 'foo';
  
    invertedIndex.addToken(token, doc1);
    invertedIndex.addToken(token, doc2);
  
    assert.deepEqual(invertedIndex.root['f']['o']['o']['docs'][123], {tf: 1});
    assert.deepEqual(invertedIndex.root['f']['o']['o']['docs'][456], {tf: 1});
    assert.equal(invertedIndex.getTermFrequency('foo', 123), 1);
    assert.equal(invertedIndex.getTermFrequency('foo', 456), 1);
    assert.equal(invertedIndex.getDocFreq('foo'), 2);
  });
  it('test df of none-existing token', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc1 = { ref: 123, tf: 1},
        doc2 = { ref: 456, tf: 1},
        token = 'foo';
  
    invertedIndex.addToken(token, doc1);
    invertedIndex.addToken(token, doc2);
  
    assert.equal(invertedIndex.getDocFreq('foo'), 2);
    assert.equal(invertedIndex.getDocFreq('fox'), 0);
  });
  
  it('adding existing doc', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc1 = { ref: 123, tf: 1},
        doc2 = { ref: 456, tf: 1},
        token = 'foo';
  
    invertedIndex.addToken(token, doc1);
    invertedIndex.addToken(token, doc2);
    invertedIndex.addToken(token, { ref: 456, tf: 100});
  
    assert.deepEqual(invertedIndex.root['f']['o']['o']['docs'][456], {tf: 100});
    assert.equal(invertedIndex.getTermFrequency('foo', 456), 100);
    assert.equal(invertedIndex.getDocFreq('foo'), 2);
  });
  
  it('checking if a token exists in the invertedIndex', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc = { ref: 123, tf: 1},
        token = 'foo';
  
    invertedIndex.addToken(token, doc);
  
    assert.ok(invertedIndex.hasToken(token));
  });
  
  it('checking if a token does not exist in the invertedIndex', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc = { ref: 123, tf: 1},
        token = 'foo';
  
    invertedIndex.addToken(token, doc);
    assert.ok(!invertedIndex.hasToken('fooo'));
    assert.ok(!invertedIndex.hasToken('bar'));
    assert.ok(!invertedIndex.hasToken('fof'));
  });
  
  it('retrieving items from the invertedIndex', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc = { ref: 123, tf: 1},
        token = 'foo';
  
    invertedIndex.addToken(token, doc);
    assert.deepEqual(invertedIndex.getDocs(token), {
      '123': {tf: 1}
    });
  
    assert.deepEqual(invertedIndex.getDocs(''), {});
  
    invertedIndex.addToken('boo', { ref: 234, tf: 100 });
    invertedIndex.addToken('too', { ref: 345, tf: 101 });
  
    assert.deepEqual(invertedIndex.getDocs(token), {
      '123': {tf: 1}
    });
  
    invertedIndex.addToken(token, {ref: 234, tf: 100});
    invertedIndex.addToken(token, {ref: 345, tf: 101});
  
    assert.deepEqual(invertedIndex.getDocs(token), {
      '123': {tf: 1},
      '234': {tf: 100},
      '345': {tf: 101}
    });
  });
  
  it('retrieving items that do not exist in the invertedIndex', function () {
    var invertedIndex = new elasticlunr.InvertedIndex;
  
    assert.deepEqual(invertedIndex.getDocs('foo'), {});
    assert.deepEqual(invertedIndex.getDocs('fox'), {});
  });
  
  it('test df of items in the invertedIndex', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc1 = { ref: 123, tf: 1},
        doc2 = { ref: 456, tf: 1},
        doc3 = { ref: 789, tf: 1};
  
    invertedIndex.addToken('foo', doc1);
    invertedIndex.addToken('foo', doc2);
    invertedIndex.addToken('bar', doc3);
  
    assert.equal(invertedIndex.getDocFreq('foo'), 2);
    assert.equal(invertedIndex.getDocFreq('bar'), 1);
    assert.equal(invertedIndex.getDocFreq('baz'), 0);
    assert.equal(invertedIndex.getDocFreq('ba'), 0);
    assert.equal(invertedIndex.getDocFreq('b'), 0);
    assert.equal(invertedIndex.getDocFreq('fo'), 0);
    assert.equal(invertedIndex.getDocFreq('f'), 0);
  });
  
  it('removing a document from the token invertedIndex', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc = { ref: 123, tf: 1};
  
    assert.deepEqual(invertedIndex.getDocs('foo'), {});
  
    invertedIndex.addToken('foo', doc);
    assert.deepEqual(invertedIndex.getDocs('foo'), {
      '123': {tf: 1}
    });
  
    invertedIndex.removeToken('foo', 123);
    assert.deepEqual(invertedIndex.getDocs('foo'), {});
    assert.equal(invertedIndex.getDocFreq('foo'), 0);
    assert.equal(invertedIndex.hasToken('foo'), true);
  });
  
  it('removing a document that is not in the invertedIndex', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc1 = { ref: 123, tf: 1},
        doc2 = { ref: 567, tf: 1};
  
    invertedIndex.addToken('foo', doc1);
    invertedIndex.addToken('bar', doc2);
    invertedIndex.removeToken('foo', 456);
  
    assert.deepEqual(invertedIndex.getDocs('foo'), { 123: {tf: 1} });
    assert.equal(invertedIndex.getDocFreq('foo'), 1);
  });
  
  it('removing a document from a key that does not exist', function () {
    var invertedIndex = new elasticlunr.InvertedIndex;
  
    invertedIndex.removeToken('foo', 123);
    assert.ok(!invertedIndex.hasToken('foo'));
    assert.equal(invertedIndex.getDocFreq('foo'), 0);
  });
  
  it('expand a token into all descendent tokens', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc = { ref: 123, tf: 1};
  
    invertedIndex.addToken('hell', doc);
    invertedIndex.addToken('hello', doc);
    invertedIndex.addToken('help', doc);
    invertedIndex.addToken('held', doc);
    invertedIndex.addToken('foo', doc);
    invertedIndex.addToken('bar', doc);
  
    var tokens = invertedIndex.expandToken('hel');
    assert.deepEqual(tokens, ['hell', 'hello', 'help', 'held']);
  
    tokens = invertedIndex.expandToken('hell');
    assert.deepEqual(tokens, ['hell', 'hello']);
  
    tokens = invertedIndex.expandToken('he');
    assert.deepEqual(tokens, ['hell', 'hello', 'help', 'held']);
  
    tokens = invertedIndex.expandToken('h');
    assert.deepEqual(tokens, ['hell', 'hello', 'help', 'held']);
  });
  
  it('expand a non existing token', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc = { ref: 123, tf: 1};
  
    invertedIndex.addToken('hell', doc);
    invertedIndex.addToken('hello', doc);
    invertedIndex.addToken('help', doc);
    invertedIndex.addToken('held', doc);
    invertedIndex.addToken('foo', doc);
    invertedIndex.addToken('bar', doc);
  
    var tokens = invertedIndex.expandToken('wax');
    assert.deepEqual(tokens, []);
  });
  
  it('expand a existing token without descendent tokens', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc = { ref: 123, tf: 1};
  
    invertedIndex.addToken('hello', doc);
    invertedIndex.addToken('hellp', doc);
    invertedIndex.addToken('helld', doc);
    invertedIndex.addToken('helldd', doc);
    invertedIndex.addToken('hellddda', doc);
    invertedIndex.addToken('hell', doc);
    invertedIndex.addToken('help', doc);
    invertedIndex.addToken('held', doc);
    invertedIndex.addToken('foo', doc);
    invertedIndex.addToken('bar', doc);
  
    var tokens = invertedIndex.expandToken('hello');
    assert.deepEqual(tokens, ['hello']);
  });
  
  it('test get term frequency from inverted index', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc1 = { ref: 123, tf: 2},
        doc2 = { ref: 456, tf: 3},
        token = 'foo';
  
    invertedIndex.addToken(token, doc1);
    invertedIndex.addToken(token, doc2);
  
    assert.equal(invertedIndex.getTermFrequency(token, 123), 2);
    assert.equal(invertedIndex.getTermFrequency(token, 456), 3);
    assert.equal(invertedIndex.getTermFrequency(token, 789), 0);
  });
  
  it('test get term frequency from inverted index by non-exist token', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc1 = { ref: 123, tf: 2},
        doc2 = { ref: 456, tf: 3},
        token = 'foo';
  
    invertedIndex.addToken(token, doc1);
    invertedIndex.addToken(token, doc2);
  
    assert.equal(invertedIndex.getTermFrequency('token', 123), 0);
    assert.equal(invertedIndex.getTermFrequency('token', 456), 0);
  });
  
  it('test get term frequency from inverted index by non-exist docRef', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc1 = { ref: 123, tf: 2},
        doc2 = { ref: 456, tf: 3},
        token = 'foo';
  
    invertedIndex.addToken(token, doc1);
    invertedIndex.addToken(token, doc2);
  
    assert.equal(invertedIndex.getTermFrequency(token, 12), 0);
    assert.equal(invertedIndex.getTermFrequency(token, 23), 0);
    assert.equal(invertedIndex.getTermFrequency(token, 45), 0);
  });
  
  it('test get term frequency from inverted index by non-exist token and non-exist docRef', function () {
    var invertedIndex = new elasticlunr.InvertedIndex,
        doc1 = { ref: 123, tf: 2},
        doc2 = { ref: 456, tf: 3},
        token = 'foo';
  
    invertedIndex.addToken(token, doc1);
    invertedIndex.addToken(token, doc2);
  
    assert.equal(invertedIndex.getTermFrequency('token', 1), 0);
    assert.equal(invertedIndex.getTermFrequency('abc', 2), 0);
    assert.equal(invertedIndex.getTermFrequency('fo', 123), 0);
  });
  
  it('serialisation', function () {
    var invertedIndex = new elasticlunr.InvertedIndex;
  
    assert.deepEqual(invertedIndex.toJSON(), { root: { docs: {}, df: 0 }});
  
    invertedIndex.addToken('foo', { ref: 123, tf: 1});
  
    assert.deepEqual(invertedIndex.toJSON(),
      {
        root: {
          docs: {},
          df: 0,
          f: {
            df: 0,
            docs: {},
            o: {
              df: 0,
              docs: {},
              o: {
                df: 1,
                docs: { 123: { tf: 1} }
              }
            }
          }
        }
      }
    );
  });
  
  it('loading a serialised story', function () {
    var serialisedData = {
        root: {
          docs: {},
          df: 0,
          f: {
            df: 0,
            docs: {},
            o: {
              df: 0,
              docs: {},
              o: {
                df: 1,
                docs: { 123: { tf: 1} }
              }
            }
          }
        }
    };
  
    var invertedIndex = elasticlunr.InvertedIndex.load(serialisedData),
        documents = invertedIndex.getDocs('foo');
  
    assert.deepEqual(documents, { 123: {tf: 1}});
  });
  
});