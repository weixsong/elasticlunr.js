module('elasticlunr.DocumentStore');

test('adding document tokens to the document store', function () {
  var docStore = new elasticlunr.DocumentStore,
      doc = {title: 'eggs bread'};

  docStore.addDoc(1, doc);
  deepEqual(docStore.getDoc(1), doc);
});

test('getting the number of docs in the document store', function () {
  var docStore = new elasticlunr.DocumentStore;

  equal(docStore.length, 0);
  docStore.addDoc(1, {title: 'eggs bread'});
  equal(docStore.length, 1);
});

test('get a doc in the document store', function () {
  var docStore = new elasticlunr.DocumentStore;

  equal(docStore.length, 0);
  docStore.addDoc(1, {title: 'eggs bread'});
  deepEqual(docStore.getDoc(1), {title: 'eggs bread'});
});

test('get a doc with multiple fields in the document store', function () {
  var docStore = new elasticlunr.DocumentStore;

  equal(docStore.length, 0);
  docStore.addDoc(1, {title: 'eggs bread'});
  docStore.addDoc(2, {title: 'boo bar'});
  docStore.addDoc(3, {title: 'oracle', body: 'oracle is a great company'});
  deepEqual(docStore.getDoc(3), {title: 'oracle', body: 'oracle is a great company'});
  equal(docStore.length, 3);
});

test('get a non-exist doc in the document store', function () {
  var docStore = new elasticlunr.DocumentStore;

  equal(docStore.length, 0);
  docStore.addDoc(1, {title: 'eggs bread'});
  docStore.addDoc(2, {title: 'boo bar'});
  docStore.addDoc(3, {title: 'oracle', body: 'oracle is a great company'});
  equal(docStore.getDoc(4), null);
  equal(docStore.getDoc(0), null);
  equal(docStore.length, 3);
});

test('checking whether the store contains a key', function () {
  var store = new elasticlunr.DocumentStore;

  ok(!store.hasDoc('foo'));
  store.addDoc('foo', {title: 'eggs bread'});
  ok(store.hasDoc('foo'));
});

test('removing an doc from the store', function () {
  var store = new elasticlunr.DocumentStore;

  store.addDoc('foo', {title: 'eggs bread'});
  ok(store.hasDoc('foo'));
  equal(store.length, 1);
  store.removeDoc('foo');
  ok(!store.hasDoc('foo'));
  equal(store.length, 0);
});

test('removing a non-exist doc from the store', function () {
  var store = new elasticlunr.DocumentStore;

  store.addDoc('foo', {title: 'eggs bread'});
  ok(store.hasDoc('foo'));
  equal(store.length, 1);
  store.removeDoc('bar');
  ok(store.hasDoc('foo'));
  equal(store.length, 1);
});

test('serialising', function () {
  var store = new elasticlunr.DocumentStore;

  deepEqual(store.toJSON(), { docs: {}, length: 0 });

  store.addDoc('foo', {title: 'eggs bread'});

  deepEqual(store.toJSON(), { docs: { 1: {title: 'eggs bread'} }, length: 1 });
});

test('loading serialised data', function () {
  var serialisedData = {
    length: 1,
    docs: {
      1: {title: 'eggs bread'}
    }
  };

  var store = elasticlunr.DocumentStore.load(serialisedData);

  equal(store.length, 1);
  deepEqual(store.getDoc(1), {title: 'eggs bread'});
});
