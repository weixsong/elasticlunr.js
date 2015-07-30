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
 * user could choose whether original JSON format document should be store, if no configuration then document will be stored defaultly.
 * If user care more about the index size, user could select not store JSON documents, then this will has some defects, such as user
 * could not use JSON document to generate snippets of search results.
 * 
 * @param {Boolean} save If the original JSON document should be stored.
 * @constructor
 * @module
 */
elasticlunr.DocumentStore = function (save) {
  if (save === null || save === undefined) {
    this._save = true;
  } else {
    this._save = save;
  }

  this.docs = {};
  this.length = 0;
};

/**
 * Loads a previously serialised document store
 *
 * @param {Object} serialisedData The serialised document store to load.
 * @return {elasticlunr.DocumentStore}
 */
elasticlunr.DocumentStore.load = function (serialisedData) {
  var store = new this;

  store.length = serialisedData.length;
  store.docs = serialisedData.docs;
  store._save = serialisedData.save;

  return store;
};

/**
 * check if current instance store the original doc
 *
 * @return {Boolean}
 */
elasticlunr.DocumentStore.prototype.isDocStored = function () {
  return this._save;
};

/**
 * Stores the given doc in the document store against the given id.
 * If docRef already exist, then update doc.
 * 
 * Document is store by original JSON format, then you could use original document to generate search snippets.
 *
 * @param {Integer|String} docRef The key used to store the JSON format doc.
 * @param {Object} doc The JSON format doc.
 */
elasticlunr.DocumentStore.prototype.addDoc = function (docRef, doc) {
  if (!this.hasDoc(docRef)) this.length++;

  if (this._save === true) {
    this.docs[docRef] = doc;
  } else {
    this.docs[docRef] = null;
  }
};

/**
 * Retrieves the JSON doc from the document store for a given key.
 * 
 * If docRef not found, return null.
 * If user set not storing the documents, return null.
 *
 * @param {Integer|String} docRef The key to lookup and retrieve from the document store.
 * @return {Object}
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.getDoc = function (docRef) {
  if (this.hasDoc(docRef) === false) return null;
  return this.docs[docRef];
};

/**
 * Checks whether the document store contains a key (docRef).
 *
 * @param {Integer|String} docRef The id to look up in the document store.
 * @return {Boolean}
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.hasDoc = function (docRef) {
  return docRef in this.docs;
};

/**
 * Removes the value for a key in the document store.
 *
 * @param {Integer|String} docRef The id to remove from the document store.
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.removeDoc = function (docRef) {
  if (!this.hasDoc(docRef)) return;

  delete this.docs[docRef];
  this.length--;
};

/**
 * Returns a JSON representation of the document store used for serialisation.
 *
 * @return {Object} JSON format
 * @memberOf DocumentStore
 */
elasticlunr.DocumentStore.prototype.toJSON = function () {
  return {
    docs: this.docs,
    length: this.length,
    save: this._save
  };
};
