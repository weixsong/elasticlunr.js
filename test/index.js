const elasticlunr = require("../lib/elasticlunr.js");
const assert = require("assert");
const sinon = require("sinon");
const iface = require("../lib/index/interface.js");
const util = require("util");

function getAllFuncs(obj) {
  var props = [];

  props = props.concat(Object.getOwnPropertyNames(Object.getPrototypeOf(obj)));

  return props.sort().filter(function(e, i, arr) { 
     if (e!=arr[i+1] && obj && obj[e] && typeof obj[e] == 'function') return true;
  });
}

describe('interface', () => {
  it('should throw on every member', () => {
    var i = new iface();
    var fn = getAllFuncs(i);
    fn.filter((prop) => ['constructor', 'all'].indexOf(prop) < 0).forEach((name) => {
      if (i[name]) assert.throws(() => {
        i[name]()
      }, name)
    });
  })
})
describe('elasticlunr.Index', function() {
  let addSpy = null;
  let idx = null;
  it('should remember settings', function() {
    var idx = new elasticlunr.Index;
    assert.deepEqual(idx.getFields(), ['id']);
    assert.equal(idx.getRef(), 'id');

    idx.addField('foo');
    assert.deepEqual(idx.getFields(), ['id', 'foo']);

    idx.setRef('foo');
    assert.deepEqual(idx.getRef(), 'foo');
  });
  it('should allow the addition of documents', () => {
    var idx = new elasticlunr.Index();
    var addSpy = sinon.spy();
    idx.on('add', addSpy);
    
    var doc = {id: 1, body: 'this is a test'},    
    doc2 = {id: 2, body: 'this is a test'};
    idx.addField('body');
    return Promise.all([idx.addDoc(doc), idx.addDoc(doc2, false)]).then(() => {
      assert.equal(addSpy.calledOnce, true);
    });
  });
  it('should allow the addition of documents with an empty field', function () {
    var idx = new elasticlunr.Index,
        doc = {id: 1, body: 'test', title: ''};

    idx.addField('title');
    idx.addField('body');
  
    idx.addDoc(doc);
    assert.equal(Object.keys(idx.getField('body').termFrequency('test')).length, 1);
    assert.equal(idx.getField('body').termFrequency('test')['1'], 1);
  });

  it('allows the removal of a document from the index', function () {
    var idx = new elasticlunr.Index,
        doc = {id: 1, body: 'this is a test'},
        doc2 = {id:2, body: 'this is another test'};
  
    idx.addField('body');
    // assert.equal(idx.documentStore.length, 0);
    idx.addDoc(doc2);
    idx.addDoc(doc);
    // assert.equal(idx.documentStore.length, 1);
  
    idx.removeDoc(doc);
    // assert.equal(idx.documentStore.length, 0);
  
    assert.equal(idx.getField('body').hasToken('a'), false);
    assert.equal(idx.getField('body').hasToken('another'), true);
    assert.equal(idx.getField('body').getToken('a'), null);
    assert.ok(idx.getField('body').getToken('another').idf> 0);
    assert.deepEqual(idx.getField('body').getToken('another').documents, ['2']);
  })
  
  it('should not allow the removal of a document from a non-stored index', function() {
    var idx = new elasticlunr.Index;
    idx.saveDocument(false);
    assert.equal(idx.removeDocByRef("test"), null);
  });
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
  
    assert.deepEqual(idx.getField('body').getToken('this').documents, ['1', '2']);
  
    assert.equal(idx.removeDocByRef(), null);
    assert.equal(idx.removeDocByRef("test"), null);
    assert.equal(idx.removeDoc(), null);
    idx.removeDoc(doc1);
    assert.equal(idx.documentStore.length, 1);
    assert.equal(idx.getField('body').hasToken('this'), true);
    assert.equal(idx.getField('body').hasToken('test'), false);
    assert.equal(idx.getField('body').hasToken('apple'), true);
    assert.equal(idx.getField('body').getToken('this').idf> 0, true);
    assert.deepEqual(idx.getField('body').getToken('apple').documents, ['2']);
    assert.deepEqual(idx.getField('body').getToken('this').documents, ['2']);
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
    assert.equal(removalSpy.calledOnce, true);
  });
  
  it('should no-op when removing a document not in the index', function () {
    var idx = new elasticlunr.Index,
        doc = {id: 1, body: 'this is a test'},
        doc2 = {id: 2, body: 'i dont exist'},
        callbackCalled = false
  
    var removalSpy = sinon.spy();
    idx.on('remove', removalSpy);
  
    idx.addField('body')
    assert.equal(idx.documentStore.size(), 0)
  
    idx.addDoc(doc)
    assert.equal(idx.documentStore.size(), 1)
  
    idx.removeDoc(doc2)
    assert.equal(idx.documentStore.size(), 1)
  
    assert.equal(removalSpy.notCalled, true);
  })
  
  it('allows the update of a document', function () {
    var idx = new elasticlunr.Index,
        doc = {id: 1, body: 'foo'}
  
    idx.addField('body')
    idx.addDoc(doc)
    assert.equal(idx.documentStore.length, 1)
    assert.ok(idx.getField('body').hasToken('foo'))
  
    doc.body = 'bar'
    idx.updateDoc(doc)
  
    assert.equal(idx.documentStore.length, 1)
    assert.ok(idx.getField('body').hasToken('bar'))
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
    assert.ok(idx.getField('body').hasToken('foo'))
  
    var addSpy = sinon.spy(),
        updateSpy = sinon.spy(),
        deleteSpy = sinon.spy();
    idx.on('update', updateSpy);
    idx.on('add', addSpy);
    idx.on('remove', deleteSpy);
  
    doc.body = 'bar'
    idx.updateDoc(doc)
  
    assert.ok(updateSpy.calledOnce);
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
    assert.ok(idx.getField('body').hasToken('foo'));
  
    var updateSpy = sinon.spy();
    idx.on('update', updateSpy);
  
    doc.body = 'bar';
    idx.updateDoc(doc, false);
  
    assert.ok(updateSpy.notCalled);
  });
  
  it('loads a serialised index', function () {
    var serialisedData = {
      version: '0.9.6', // this is what the lunr version is set to before being built
      fields: [
        { name: 'title', boost: 10 },
        { name: 'body', boost: 1 }
      ],
      ref: 'id',
      documentStore: { document_store: {}, length: 0 },
      index: {
        title: {
          root: {
          a: {
            n: {
              docs: {
                'a': {
                  tf: 1
                }
              }
            }
          }
        }
      }, length: 1 },
      corpusTokens: [],
      pipeline: ['stopWordFilter', 'stemmer']
    }
  
    var idx = elasticlunr.Index.load(serialisedData);
    assert.ok(idx.getField('title') !== null);
    assert.ok(idx.getField('body') !== null);
    assert.equal(idx.getRef(), 'id')
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
  });
  it('prevents the use of unknown index versions', function() {
    assert.throws(function() {
      var serialisedData = {
        version: '0.3.2',
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
    });
  });
});