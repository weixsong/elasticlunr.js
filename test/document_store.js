import elasticlunr from '../lib/elasticlunr.js';
import assert from 'assert';

describe('elasticlunr.DocumentStore', function() {
  describe('store=false', function() {
    var documentStore = new elasticlunr.DocumentStore(false);
    it('should report that it is not storing documents', function() {
      assert.equal(documentStore.isDocStored(), false);
    });
    it('should keep track of documents stored', function() {
      documentStore.addDoc(1, {title: 'eggs bread'});
      assert.equal(documentStore.length, 1);
      assert.equal(documentStore.hasDoc(1), true);
      assert.equal(documentStore.hasDoc(2), false);
      assert.equal(documentStore.getDoc(1), null);

      documentStore.removeDoc(1);
      assert.equal(documentStore.hasDoc(1), false);
    });
  });
  describe('store=true', function() {
    var documentStore = new elasticlunr.DocumentStore;
    it('should report that it is storing documents', function() {
      assert.equal(documentStore.isDocStored(), true);
    });

    it('should keep track of documents stored', function() {
      documentStore.addDoc(1, {title: 'eggs bread'});
      assert.equal(documentStore.length, 1);
      assert.equal(documentStore.hasDoc(1), true);
      
      assert.deepEqual(documentStore.getDoc(1), {title: 'eggs bread'});
    })
  });

  describe('serialization', function() {
    it('should serialize', function () {
      var store = new elasticlunr.DocumentStore;
    
      assert.deepEqual(store.toJSON(), { docs: {}, docInfo: {}, length: 0, save: true });
    
      store.addDoc('foo', {title: 'eggs bread'});
      assert.deepEqual(store.toJSON(), { docs: { foo: {title: 'eggs bread'}}, docInfo: {}, length: 1, save: true });
    });
    
    it('should serialize with docInfo', function () {
      var store = new elasticlunr.DocumentStore;
    
      assert.deepEqual(store.toJSON(), { docs: {}, docInfo: {}, length: 0, save: true });
    
      store.addDoc('foo', {title: 'eggs bread'});
      store.addFieldLength('foo', 'title', 2);
      assert.deepEqual(store.toJSON(), { docs: { foo: {title: 'eggs bread'}}, docInfo: {foo: {title: 2}}, length: 1, save: true });

      
      store.updateFieldLength('foo', 'title', 3);
      assert.deepEqual(store.toJSON(), { docs: { foo: {title: 'eggs bread'}}, docInfo: {foo: {title: 3}}, length: 1, save: true });
    
      store.addFieldLength('foo', 'body', 20);
      assert.deepEqual(store.toJSON(), { docs: { foo: {title: 'eggs bread'}}, docInfo: {foo: {title: 3, body: 20}}, length: 1, save: true });
    });
    
    it('should serialize in reduced form if storage is not enabled', function () {
      var store = new elasticlunr.DocumentStore(false);
    
      assert.deepEqual(store.toJSON(), { docs: {}, docInfo: {}, length: 0, save: false });
    
      store.addDoc('foo', {title: 'eggs bread'});
      assert.deepEqual(store.toJSON(), { docs: { foo: null }, docInfo: {}, length: 1, save: false });
      
      store.addDoc('bar', {title: 'bar bread'});
      assert.deepEqual(store.toJSON(), { docs: { foo: null, bar: null }, docInfo: {}, length: 2, save: false });
    });
    
    it('should load serialised data', function () {
      var serialisedData = {
        length: 1,
        docs: {
          1: {title: 'eggs bread'}
        },
        docInfo: {
          1: {title: 2, body: 20}
        },
        save: true
      };
    
      var store = elasticlunr.DocumentStore.load(serialisedData);
    
      assert.equal(store.length, 1);
      assert.equal(store.isDocStored(), true);
      assert.equal(store.getFieldLength(1, 'title'), 2);
      assert.equal(store.getFieldLength(1, 'body'), 20);
      assert.deepEqual(store.getDoc(1), {title: 'eggs bread'});
    });
    
    it('should load serialised data with docInfo', function () {
      var serialisedData = {
        length: 1,
        docs: {
          1: {title: 'eggs bread'}
        },
        docInfo: {},
        save: true
      };
    
      var store = elasticlunr.DocumentStore.load(serialisedData);
    
      assert.equal(store.length, 1);
      assert.equal(store.isDocStored(), true);
      assert.deepEqual(store.getDoc(1), {title: 'eggs bread'});
    });
    
    it('should load serialised data without storing documents', function () {
      var serialisedData = {
        length: 2,
        docs: {
          1: null,
          2: null
        },
        docInfo: {},
        save: false
      };
    
      var store = elasticlunr.DocumentStore.load(serialisedData);
    
      assert.equal(store.length, 2);
      assert.equal(store.isDocStored(), false);
      assert.equal(store.hasDoc(1), true);
      assert.equal(store.hasDoc(2), true);
      assert.deepEqual(store.getDoc(1), null);
      assert.deepEqual(store.getDoc(2), null);
    });
  });
});