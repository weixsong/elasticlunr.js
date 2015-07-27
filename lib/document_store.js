/*!
 * elasticlunr.DocumentStore
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

/**
 * elasticlunr.DocumentStore is a simple key-value document store used for storing sets of tokens for
 * documents stored in index.
 *
 * elasticlunr.DocumentStore store original JSON format documents that you could build search snippet by this original JSON document.
 *
 * @constructor
 * @module
 */
elasticlunr.DocumentStore = function () {
  this.docs = {};
  this.length = 0;
};

/**
 * Loads a previously serialised document store
 *
 * @param {Object} serialisedData The serialised document store to load.
 * @return {elasticlunr.Store}
 */
elasticlunr.DocumentStore.load = function (serialisedData) {
  var store = new this;

  store.length = serialisedData.length;
  store.docs = serialisedData.docs;

  return store;
};

/**
 * Stores the given doc in the document store against the given id.
 * If docRef already exist, then update doc.
 * 
 * Document is store by original JSON format, then you could use original document to generate search snippets.
 *
 * @param {Object} docRef The key used to store the JSON format doc.
 * @param {Object} doc The JSON format doc.
 */
elasticlunr.DocumentStore.prototype.addDoc = function (docRef, doc) {
  if (!this.hasDoc(docRef)) this.length++;
  this.docs[docRef] = doc;
};

/**
 * Retrieves the JSON doc from the document store for a given key.
 * 
 * If docRef not found, return null.
 *
 * @param {Object} docRef, The key to lookup and retrieve from the document store.
 * @return {Object}
 * @memberOf Store
 */
elasticlunr.DocumentStore.prototype.getDoc = function (docRef) {
  if (this.hasDoc(docRef) == false) return null;
  return this.docs[docRef];
};

/**
 * Checks whether the document store contains a key (docRef).
 *
 * @param {Object} docRef The id to look up in the document store.
 * @return {Boolean}
 * @memberOf Store
 */
elasticlunr.DocumentStore.prototype.hasDoc = function (docRef) {
  return docRef in this.docs;
};

/**
 * Removes the value for a key in the document store.
 *
 * @param {Object} docRef The id to remove from the document store.
 * @memberOf Store
 */
elasticlunr.DocumentStore.prototype.removeDoc = function (docRef) {
  if (!this.hasDoc(docRef)) return;

  delete this.docs[docRef];
  this.length--;
};

/**
 * Returns a representation of the document store ready for serialisation.
 *
 * @return {Object}
 * @memberOf Store
 */
elasticlunr.DocumentStore.prototype.toJSON = function () {
  return {
    docs: this.docs,
    length: this.length
  };
};
