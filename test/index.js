const elasticlunr = require("../lib/elasticlunr.js");
const assert = require("assert");
const sinon = require("sinon");

describe('elasticlunr.Index', function() {
  it('should remember settings', function() {
    var idx = new elasticlunr.Index;
    assert.deepEqual(idx._fields, []);
    assert.equal(idx._ref, 'id');

    idx.addField('foo');
    assert.deepEqual(idx._fields, ['foo']);

    idx.setRef('foo');
    assert.deepEqual(idx._ref, 'foo');
  });
  it('should allow the addition of documents', function() {
    
    var idx = new elasticlunr.Index,
    doc = {id: 1, body: 'this is a test'},    
    doc2 = {id: 2, body: 'this is a test'};

    let addSpy = sinon.spy();
    idx.on('add', addSpy);
    idx.addField('body');
    idx.addDoc(doc);
    idx.addDoc(doc2, false);

    assert.equal(idx.documentStore.length, 2);
    assert.equal(addSpy.calledWith(doc, idx), true);
    assert.equal(addSpy.calledOnce, true);
  });
  it('should allow the addition of documents with an empty field', function () {
    var idx = new elasticlunr.Index,
        doc = {id: 1, body: 'test', title: ''};
  
    idx.addField('title');
    idx.addField('body');
  
    idx.addDoc(doc);
    assert.equal(idx.index['body'].getDocFreq('test'), 1);
    assert.equal(idx.index['body'].getDocs('test')[1].tf, 1);
  });

  it('allows the removal of a document from the index', function () {
    var idx = new elasticlunr.Index,
        doc = {id: 1, body: 'this is a test'};
  
    idx.addField('body');
    assert.equal(idx.documentStore.length, 0);
  
    idx.addDoc(doc);
    assert.equal(idx.documentStore.length, 1);
  
    idx.removeDoc(doc);
    assert.equal(idx.documentStore.length, 0);
  
    assert.equal(idx.index['body'].hasToken('this'), true);
    assert.equal(idx.index['body'].hasToken('test'), true);
    assert.equal(idx.index['body'].getNode('this').df, 0);
    assert.deepEqual(idx.index['body'].getNode('test').docs, {});
  })
  
  it('allows the removal of a document from the index with more than one documents', function () {
    var idx = new elasticlunr.Index,
        doc1 = {id: 1, body: 'this is a test'},
        doc2 = {id: 2, body: 'this is an apple'};
  
    var docs = {1: {tf: 1},
                2: {tf: 1}};
  
    idx.addField('body');
    assert.equal(idx.documentStore.length, 0);
  
    idx.addDoc(doc1);
    assert.equal(idx.documentStore.length, 1);
  
    idx.addDoc(doc2);
    assert.equal(idx.documentStore.length, 2);
  
    assert.deepEqual(idx.index['body'].getNode('this').docs, docs);
  
    idx.removeDoc(doc1);
    assert.equal(idx.documentStore.length, 1);
  
    assert.equal(idx.index['body'].hasToken('this'), true);
    assert.equal(idx.index['body'].hasToken('test'), true);
    assert.equal(idx.index['body'].hasToken('apple'), true);
    assert.equal(idx.index['body'].getNode('this').df, 1);
    assert.deepEqual(idx.index['body'].getNode('apple').docs, {2: {tf: 1}});
    assert.deepEqual(idx.index['body'].getNode('this').docs, {2: {tf: 1}});
  });
  
  it('should trigger remove events', function () {
    var idx = new elasticlunr.Index,
        doc = {id: 1, body: 'this is a test'},
        callbackCalled = false,
        callbackArgs = [];
  
    var removalSpy = sinon.spy();
    idx.on('remove', removalSpy);
  
    idx.addField('body');
    idx.addDoc(doc);
    idx.removeDoc(doc);
    
    idx.addDoc(doc);
    idx.removeDoc(doc, false);
  
    assert.equal(removalSpy.calledOnceWith(doc, idx), true);
  });
  
  it('should no-op when removing a document not in the index', function () {
    var idx = new elasticlunr.Index,
        doc = {id: 1, body: 'this is a test'},
        doc2 = {id: 2, body: 'i dont exist'},
        callbackCalled = false
  
    var removalSpy = sinon.spy();
    idx.on('remove', removalSpy);
  
    idx.addField('body')
    assert.equal(idx.documentStore.length, 0)
  
    idx.addDoc(doc)
    assert.equal(idx.documentStore.length, 1)
  
    idx.removeDoc(doc2)
    assert.equal(idx.documentStore.length, 1)
  
    assert.equal(removalSpy.notCalled, true);
  })
  
  it('allows the update of a document', function () {
    var idx = new elasticlunr.Index,
        doc = {id: 1, body: 'foo'}
  
    idx.addField('body')
    idx.addDoc(doc)
    assert.equal(idx.documentStore.length, 1)
    assert.ok(idx.index['body'].hasToken('foo'))
  
    doc.body = 'bar'
    idx.updateDoc(doc)
  
    assert.equal(idx.documentStore.length, 1)
    assert.ok(idx.index['body'].hasToken('bar'))
  })
  
  it('searches for a document', function () {
    var idx = new elasticlunr.Index,
        doc = {id: 1, body: 'foo'};
  
    idx.addField('body');
    idx.addDoc(doc);
  
    var firstFooResult = idx.search('foo');
    assert.equal(firstFooResult.length, 1)
  
    doc.body = 'bar';
    idx.updateDoc(doc);
  
    var barResult = idx.search('bar');
    assert.equal(barResult.length, 1);
  
    var secondFooResult = idx.search('foo');
    assert.equal(secondFooResult.length, 0);
  });
  
  it('emits update events', function () {
    var idx = new elasticlunr.Index,
        doc = {id: 1, body: 'foo'},
        addCallbackCalled = false,
        removeCallbackCalled = false,
        updateCallbackCalled = false,
        callbackArgs = []
  
    idx.addField('body')
    idx.addDoc(doc)
    assert.equal(idx.documentStore.length, 1)
    assert.ok(idx.index['body'].hasToken('foo'))
  
    var addSpy = sinon.spy(),
        updateSpy = sinon.spy(),
        deleteSpy = sinon.spy();
    idx.on('update', updateSpy);
    idx.on('add', addSpy);
    idx.on('remove', deleteSpy);
  
    doc.body = 'bar'
    idx.updateDoc(doc)
  
    assert.ok(updateSpy.calledOnceWith(doc, idx));
    assert.ok(addSpy.notCalled);
    assert.ok(deleteSpy.notCalled);
  })
  
  it('allows the silencing of update events', function () {
    var idx = new elasticlunr.Index,
        doc = {id: 1, body: 'foo'},
        callbackCalled = false;
  
    idx.addField('body');
    idx.addDoc(doc);
    assert.equal(idx.documentStore.length, 1);
    assert.ok(idx.index['body'].hasToken('foo'));
  
    var updateSpy = sinon.spy();
    idx.on('update', updateSpy);
  
    doc.body = 'bar';
    idx.updateDoc(doc, false);
  
    assert.ok(updateSpy.notCalled);
  });
  
  it('serializes', function () {
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
  
    assert.deepEqual(idx.toJSON(), {
      version: elasticlunr.version, // this is what the lunr version is set to before being built
      fields: [ 'title', 'body' ],
      ref: 'id',
      documentStore: 'documentStore',
      index: {title: 'index', body: 'index'},
      pipeline: 'pipeline'
    });
  });
  
  it('loads a serialised index', function () {
    var serialisedData = {
      version: elasticlunr.version, // this is what the lunr version is set to before being built
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
  
    assert.deepEqual(idx._fields, serialisedData.fields)
    assert.equal(idx._ref, 'id')
  })
  
  it('sets idf cache with reserved words', function () {
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
      assert.equal(typeof(idx.idf(token, 'body')), 'number', 'Using token: ' + token)
    })
  })
  
  it('allows the use of plugins', function () {
    var idx = new elasticlunr.Index,
        ctx, args,
        plugin = function () {
          ctx = this
          args = Array.prototype.slice.call(arguments)
          this.pluginLoaded = true
        }
  
    idx.use(plugin, 'foo', 'bar')
  
    assert.equal(ctx, idx)
    assert.deepEqual(args, [idx, 'foo', 'bar'])
    assert.ok(idx.pluginLoaded)
  })
});