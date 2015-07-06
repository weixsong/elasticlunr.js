/*!
 * elasticlunr.DocumentStore
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

/**
 * elasticlunr.DocumentStore is a simple key-value document store used for storing sets of tokens for
 * documents stored in index.
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
 * If doc_id already exist, then update doc.
 *
 * @param {Object} doc_id The key used to store the JSON format doc.
 * @param {Object} doc The JSON format doc.
 */
elasticlunr.DocumentStore.prototype.addDoc = function (doc_id, doc) {
  if (!this.has(doc_id)) this.length++;
  this.docs[doc_id] = doc;
};

/**
 * Retrieves the JSON doc from the document store for a given key.
 *
 * @param {Object} doc_id, The key to lookup and retrieve from the document store.
 * @return {Object}
 * @memberOf Store
 */
elasticlunr.DocumentStore.prototype.getDoc = function (doc_id) {
  return this.docs[doc_id];
};

/**
 * Checks whether the document store contains a key (doc_id).
 *
 * @param {Object} doc_id The id to look up in the document store.
 * @return {Boolean}
 * @memberOf Store
 */
elasticlunr.DocumentStore.prototype.hasDoc = function (doc_id) {
  return doc_id in this.docs;
};

/**
 * Removes the value for a key in the document store.
 *
 * @param {Object} doc_id The id to remove from the document store.
 * @memberOf Store
 */
elasticlunr.DocumentStore.prototype.removeDoc = function (doc_id) {
  if (!this.has(doc_id)) return;

  delete this.docs[doc_id];
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
