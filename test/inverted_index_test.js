module('elasticlunr.InvertedIndex')

test('adding a token to the store', function () {
  var store = new elasticlunr.InvertedIndex,
      doc = { ref: 123, tf: 1 },
      token = 'foo'

  store.addToken(token, doc)

  ok(store.root['f']['o']['o']['docs'][123] === doc)
  equal(store.length, 1)
})

test('adding another document to the token', function () {
  var store = new elasticlunr.InvertedIndex,
      doc1 = { ref: 123, tf: 1 },
      doc2 = { ref: 456, tf: 1 },
      token = 'foo'

  store.addToken(token, doc1)
  store.addToken(token, doc2)

  ok(store.root['f']['o']['o']['docs'][123] === doc1)
  ok(store.root['f']['o']['o']['docs'][456] === doc2)
})

test('checking if a token exists in the store', function () {
  var store = new elasticlunr.InvertedIndex,
      doc = { ref: 123, tf: 1 },
      token = 'foo'

  store.addToken(token, doc)

  ok(store.hasToken(token))
})

test('checking if a token does not exist in the store', function () {
  var store = new elasticlunr.InvertedIndex,
      doc = { ref: 123, tf: 1 },
      token = 'foo'

  ok(!store.hasToken('bar'))
  store.addToken(token, doc)
  ok(!store.hasToken('bar'))
})

test('retrieving items from the store', function () {
  var store = new elasticlunr.InvertedIndex,
      doc = { ref: 123, tf: 1 },
      token = 'foo'

  store.addToken(token, doc)
  deepEqual(store.getDocs(token), {
    '123': doc
  })

  deepEqual(store.getDocs(''), {})
})

test('retrieving items that do not exist in the store', function () {
  var store = new elasticlunr.InvertedIndex

  deepEqual(store.getDocs('foo'), {})
})

test('counting items in the store', function () {
  var store = new elasticlunr.InvertedIndex,
      doc1 = { ref: 123, tf: 1 },
      doc2 = { ref: 456, tf: 1 },
      doc3 = { ref: 789, tf: 1 }

  store.addToken('foo', doc1)
  store.addToken('foo', doc2)
  store.addToken('bar', doc3)

  equal(store.getDocFreq('foo'), 2)
  equal(store.getDocFreq('bar'), 1)
  equal(store.getDocFreq('baz'), 0)
})

test('removing a document from the token store', function () {
  var store = new elasticlunr.InvertedIndex,
      doc = { ref: 123, tf: 1 }

  deepEqual(store.getDocs('foo'), {})

  store.addToken('foo', doc)
  deepEqual(store.getDocs('foo'), {
    '123': doc
  })

  store.removeToken('foo', 123)
  deepEqual(store.getDocs('foo'), {})
})

test('removing a document that is not in the store', function () {
  var store = new elasticlunr.InvertedIndex,
      doc1 = { ref: 123, tf: 1 },
      doc2 = { ref: 567, tf: 1 }

  store.addToken('foo', doc1)
  store.addToken('bar', doc2)
  store.removeToken('foo', 456);

  deepEqual(store.getDocs('foo'), { 123: doc1 })
})

test('removing a document from a key that does not exist', function () {
  var store = new elasticlunr.InvertedIndex

  store.removeToken('foo', 123)
  ok(!store.hasToken('foo'))
})

test('expand a token into all descendent tokens', function () {
  var store = new elasticlunr.InvertedIndex,
      doc = { ref: 123, tf: 1 }

  store.addToken('hell', doc)
  store.addToken('hello', doc)
  store.addToken('help', doc)
  store.addToken('held', doc)
  store.addToken('foo', doc)
  store.addToken('bar', doc)

  var tokens = store.expandToken('hel')
  deepEqual(tokens, ['hell', 'hello', 'help', 'held'])
})

test('serialisation', function () {
  var store = new elasticlunr.InvertedIndex;

  deepEqual(store.toJSON(), { root: { docs: {}, df: 0 }, length: 0 });

  store.addToken('foo', { ref: 123, tf: 1 });

  deepEqual(store.toJSON(),
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
              docs: { 123: { ref: 123, tf: 1 } }
            }
          }
        }
      },
      length: 1
    }
  );
});

test('loading a serialised story', function () {
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
              docs: { 123: { ref: 123, tf: 1 } }
            }
          }
        }
      },
      length: 1
  };

  var store = elasticlunr.InvertedIndex.load(serialisedData),
      documents = store.getDocs('foo');

  equal(store.length, 1)
  deepEqual(documents, { 123: { ref: 123, tf: 1 }});
})
