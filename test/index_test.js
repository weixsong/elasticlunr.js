module('elasticlunr.Index');

test("defining what fields to index", function () {
  var idx = new elasticlunr.Index;
  idx.addField('foo');

  equal(idx._fields[0], 'foo');
});

test('default reference should be id', function () {
  var idx = new elasticlunr.Index;
  equal(idx._ref, 'id');
});

test("defining the reference field for the index", function () {
  var idx = new elasticlunr.Index;
  idx.setRef('foo');

  deepEqual(idx._ref, 'foo');
});

test('adding a document to the index', function () {
  var idx = new elasticlunr.Index,
      doc = {id: 1, body: 'this is a test'};

  idx.addField('body');
  idx.addDoc(doc);

  equal(idx.documentStore.length, 1);
  ok(!!idx.documentStore.getDoc(1));
});

test('adding a document with an empty field', function () {
  var idx = new elasticlunr.Index,
      doc = {id: 1, body: 'test', title: ''};

  idx.addField('title');
  idx.addField('body');

  idx.addDoc(doc);
  equal(idx.index['body'].getDocFreq('test'), 1);
  equal(idx.index['body'].getDocs('test')[1].tf, 1);
});

test('triggering add events', function () {
  var idx = new elasticlunr.Index,
      doc = {id: 1, body: 'this is a test'},
      callbackCalled = false,
      callbackArgs = []

  idx.on('add', function (doc, index) {
    callbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.addField('body')
  idx.addDoc(doc)

  ok(callbackCalled)
  equal(callbackArgs.length, 2)
  deepEqual(callbackArgs[0], doc)
  deepEqual(callbackArgs[1], idx)
})

test('silencing add events', function () {
  var idx = new elasticlunr.Index,
      doc = {id: 1, body: 'this is a test'},
      callbackCalled = false,
      callbackArgs = []

  idx.on('add', function (doc, index) {
    callbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.addField('body')
  idx.addDoc(doc, false)

  ok(!callbackCalled)
})

test('removing a document from the index', function () {
  var idx = new elasticlunr.Index,
      doc = {id: 1, body: 'this is a test'};

  idx.addField('body');
  equal(idx.documentStore.length, 0);

  idx.addDoc(doc);
  equal(idx.documentStore.length, 1);

  idx.removeDoc(doc);
  equal(idx.documentStore.length, 0);
})

test('triggering remove events', function () {
  var idx = new elasticlunr.Index,
      doc = {id: 1, body: 'this is a test'},
      callbackCalled = false,
      callbackArgs = [];

  idx.on('remove', function (doc, index) {
    callbackCalled = true;
    callbackArgs = Array.prototype.slice.call(arguments);
  });

  idx.addField('body');
  idx.addDoc(doc);
  idx.removeDoc(doc);

  ok(callbackCalled);
  equal(callbackArgs.length, 2);
  deepEqual(callbackArgs[0], doc);

});

test('silencing remove events', function () {
  var idx = new elasticlunr.Index,
      doc = {id: 1, body: 'this is a test'},
      callbackCalled = false,
      callbackArgs = []

  idx.on('remove', function (doc, index) {
    callbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.addField('body')
  idx.addDoc(doc)
  idx.removeDoc(doc, false)

  ok(!callbackCalled)
})

test('removing a non-existent document from the index', function () {
  var idx = new elasticlunr.Index,
      doc = {id: 1, body: 'this is a test'},
      doc2 = {id: 2, body: 'i dont exist'},
      callbackCalled = false

  idx.on('remove', function (doc, index) {
    callbackCalled = true
  })

  idx.addField('body')
  equal(idx.documentStore.length, 0)

  idx.addDoc(doc)
  equal(idx.documentStore.length, 1)

  idx.removeDoc(doc2)
  equal(idx.documentStore.length, 1)

  ok(!callbackCalled)
})

test('updating a document', function () {
  var idx = new elasticlunr.Index,
      doc = {id: 1, body: 'foo'}

  idx.addField('body')
  idx.addDoc(doc)
  equal(idx.documentStore.length, 1)
  ok(idx.index['body'].hasToken('foo'))

  doc.body = 'bar'
  idx.update(doc)

  equal(idx.documentStore.length, 1)
  ok(idx.index['body'].hasToken('bar'))
})

test('emitting update events', function () {
  var idx = new elasticlunr.Index,
      doc = {id: 1, body: 'foo'},
      addCallbackCalled = false,
      removeCallbackCalled = false,
      updateCallbackCalled = false,
      callbackArgs = []

  idx.addField('body')
  idx.addDoc(doc)
  equal(idx.documentStore.length, 1)
  ok(idx.index['body'].hasToken('foo'))

  idx.on('update', function (doc, index) {
    updateCallbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.on('add', function () {
    addCallbackCalled = true
  })

  idx.on('remove', function () {
    removeCallbackCalled = true
  })


  doc.body = 'bar'
  idx.update(doc)

  ok(updateCallbackCalled)
  equal(callbackArgs.length, 2)
  deepEqual(callbackArgs[0], doc)
  deepEqual(callbackArgs[1], idx)

  ok(!addCallbackCalled)
  ok(!removeCallbackCalled)
})

test('silencing update events', function () {
  var idx = new elasticlunr.Index,
      doc = {id: 1, body: 'foo'},
      callbackCalled = false;

  idx.addField('body');
  idx.addDoc(doc);
  equal(idx.documentStore.length, 1);
  ok(idx.index['body'].hasToken('foo'));

  idx.on('update', function (doc, index) {
    callbackCalled = true
  });

  doc.body = 'bar';
  idx.update(doc, false);

  ok(!callbackCalled);
});

test('serialising', function () {
  var idx = new elasticlunr.Index,
      mockDocumentStore = { toJSON: function () { return 'documentStore' }},
      mockIndex = {title: { toJSON: function () { return 'index' }},
                   body: { toJSON: function () { return 'index' }}},
        
      mockPipeline = { toJSON: function () { return 'pipeline' }};

  idx.setRef('id');

  idx.addField('title');
  idx.addField('body');

  idx.documentStore = mockDocumentStore;
  idx.index = mockIndex;
  idx.pipeline = mockPipeline;

  deepEqual(idx.toJSON(), {
    version: '@VERSION', // this is what the lunr version is set to before being built
    fields: [ 'title', 'body' ],
    ref: 'id',
    documentStore: 'documentStore',
    index: {title: 'index', body: 'index'},
    pipeline: 'pipeline'
  });
});

test('loading a serialised index', function () {
  var serialisedData = {
    version: '@VERSION', // this is what the lunr version is set to before being built
    fields: [
      { name: 'title', boost: 10 },
      { name: 'body', boost: 1 }
    ],
    ref: 'id',
    documentStore: { document_store: {}, length: 0 },
    invertedIndex: { root: {}, length: 0 },
    corpusTokens: [],
    pipeline: ['stopWordFilter', 'stemmer']
  }

  var idx = elasticlunr.Index.load(serialisedData)

  deepEqual(idx._fields, serialisedData.fields)
  equal(idx._ref, 'id')
})

test('idf cache with reserved words', function () {
  var idx = new elasticlunr.Index;
  idx.addField('body');

  var troublesomeTokens = [
    'constructor',
    '__proto__',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ]

  troublesomeTokens.forEach(function (token) {
    equal(typeof(idx.idf(token, 'body')), 'number', 'Using token: ' + token)
  })
})

test('using a plugin', function () {
  var idx = new elasticlunr.Index,
      ctx, args,
      plugin = function () {
        ctx = this
        args = Array.prototype.slice.call(arguments)
        this.pluginLoaded = true
      }

  idx.use(plugin, 'foo', 'bar')

  equal(ctx, idx)
  deepEqual(args, [idx, 'foo', 'bar'])
  ok(idx.pluginLoaded)
})
