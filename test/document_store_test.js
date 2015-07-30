module('elasticlunr.DocumentStore');

test('adding document tokens to the document store', function () {
  var docStore = new elasticlunr.DocumentStore,
      doc = {title: 'eggs bread'};

  docStore.addDoc(1, doc);
  deepEqual(docStore.getDoc(1), doc);
});

test('create a document store not storing the doc', function () {
  var docStore = new elasticlunr.DocumentStore(false),
      doc = {title: 'eggs bread'};

  docStore.addDoc(1, doc);
  equal(docStore.length, 1);
  equal(docStore.isDocStored(), false);
  equal(docStore.hasDoc(1), true);
});

test('add doc test without storing the doc', function () {
  var docStore = new elasticlunr.DocumentStore(false),
      doc1 = {title: 'eggs bread'},
      doc2 = {title: 'hello world'};

  docStore.addDoc(1, doc1);
  docStore.addDoc(2, doc2);
  equal(docStore.length, 2);
  equal(docStore.isDocStored(), false);
  equal(docStore.hasDoc(1), true);
  equal(docStore.hasDoc(2), true);
});

test('test isDocStored() function when created DocumentStore without arguments', function () {
  var docStore = new elasticlunr.DocumentStore();
  equal(docStore.isDocStored(), true);
});

test('test isDocStored() function when created DocumentStore with true input', function () {
  var docStore = new elasticlunr.DocumentStore(true);
  equal(docStore.isDocStored(), true);
});

test('test isDocStored() function when created DocumentStore with false input', function () {
  var docStore = new elasticlunr.DocumentStore(false);
  equal(docStore.isDocStored(), false);
});

test('get doc test without storing the doc', function () {
  var docStore = new elasticlunr.DocumentStore(false),
      doc1 = {title: 'eggs bread'},
      doc2 = {title: 'hello world'};

  docStore.addDoc(1, doc1);
  docStore.addDoc(2, doc2);
  equal(docStore.length, 2);
  equal(docStore.isDocStored(), false);
  equal(docStore.getDoc(1), null);
  equal(docStore.getDoc(2), null);
});

test('get non-exist doc test without storing the doc', function () {
  var docStore = new elasticlunr.DocumentStore(false),
      doc1 = {title: 'eggs bread'},
      doc2 = {title: 'hello world'};

  docStore.addDoc(1, doc1);
  docStore.addDoc(2, doc2);
  equal(docStore.length, 2);
  equal(docStore.isDocStored(), false);
  equal(docStore.getDoc(6), null);
  equal(docStore.getDoc(2), null);
});

test('remove doc test without storing the doc', function () {
  var docStore = new elasticlunr.DocumentStore(false),
      doc1 = {title: 'eggs bread'},
      doc2 = {title: 'hello world'};

  docStore.addDoc(1, doc1);
  docStore.addDoc(2, doc2);
  docStore.removeDoc(1);
  equal(docStore.length, 1);
  equal(docStore.isDocStored(), false);
  equal(docStore.getDoc(2), null);
  equal(docStore.getDoc(1), null);
});

test('remove non-exist doc test without storing the doc', function () {
  var docStore = new elasticlunr.DocumentStore(false),
      doc1 = {title: 'eggs bread'},
      doc2 = {title: 'hello world'};

  docStore.addDoc(1, doc1);
  docStore.addDoc(2, doc2);
  docStore.removeDoc(8);
  equal(docStore.length, 2);
  equal(docStore.isDocStored(), false);
  equal(docStore.getDoc(2), null);
  equal(docStore.getDoc(1), null);
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

  deepEqual(store.toJSON(), { docs: {}, length: 0, save: true });

  store.addDoc('foo', {title: 'eggs bread'});
  deepEqual(store.toJSON(), { docs: { foo: {title: 'eggs bread'} }, length: 1, save: true });
});

test('serialising without storing', function () {
  var store = new elasticlunr.DocumentStore(false);

  deepEqual(store.toJSON(), { docs: {}, length: 0, save: false });

  store.addDoc('foo', {title: 'eggs bread'});
  deepEqual(store.toJSON(), { docs: { foo: null }, length: 1, save: false });
  
  store.addDoc('bar', {title: 'bar bread'});
  deepEqual(store.toJSON(), { docs: { foo: null, bar: null }, length: 2, save: false });
});

test('loading serialised data', function () {
  var serialisedData = {
    length: 1,
    docs: {
      1: {title: 'eggs bread'}
    },
    save: true
  };

  var store = elasticlunr.DocumentStore.load(serialisedData);

  equal(store.length, 1);
  equal(store.isDocStored(), true);
  deepEqual(store.getDoc(1), {title: 'eggs bread'});
});

test('loading serialised data without storing documents', function () {
  var serialisedData = {
    length: 2,
    docs: {
      1: null,
      2: null
    },
    save: false
  };

  var store = elasticlunr.DocumentStore.load(serialisedData);

  equal(store.length, 2);
  equal(store.isDocStored(), false);
  equal(store.hasDoc(1), true);
  equal(store.hasDoc(2), true);
  deepEqual(store.getDoc(1), null);
  deepEqual(store.getDoc(2), null);
});
