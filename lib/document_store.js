/*!
 * lunr.DocumentStore
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

/**
 * lunr.DocumentStore is a simple key-value document store used for storing sets of tokens for
 * documents stored in index.
 *
 * @constructor
 * @module
 */
lunr.DocumentStore = function () {
  this.document_store = {};
  this.length = 0;
};

/**
 * Loads a previously serialised document store
 *
 * @param {Object} serialisedData The serialised document store to load.
 * @returns {lunr.Store}
 * @memberOf Store
 */
lunr.DocumentStore.load = function (serialisedData) {
  var doc_store = new this;

  doc_store.length = serialisedData.length;
  doc_store.document_store = Object.keys(serialisedData.document_store).reduce(function (memo, key) {
    memo[key] = lunr.SortedSet.load(serialisedData.document_store[key]);
    return memo;
  }, {});

  return doc_store;
};

/**
 * Stores the given tokens in the document store against the given id.
 *
 * @param {Object} doc_id The, key used to store the sorted tokens.
 * @param {Object} sorted_tokens, The sorted tokens to store against the key.
 * @memberOf Store
 */
lunr.DocumentStore.prototype.set = function (doc_id, sorted_tokens) {
  if (!this.has(doc_id)) this.length++;
  this.document_store[doc_id] = sorted_tokens;
};

/**
 * Retrieves the tokens from the document store for a given key.
 *
 * @param {Object} doc_id, The key to lookup and retrieve from the document store.
 * @returns {Object}
 * @memberOf Store
 */
lunr.DocumentStore.prototype.get = function (doc_id) {
  return this.document_store[doc_id];
};

/**
 * Checks whether the document store contains a key (doc_id).
 *
 * @param {Object} doc_id The id to look up in the document store.
 * @returns {Boolean}
 * @memberOf Store
 */
lunr.DocumentStore.prototype.has = function (doc_id) {
  return doc_id in this.document_store;
};

/**
 * Removes the value for a key in the document store.
 *
 * @param {Object} doc_id The id to remove from the document store.
 * @memberOf Store
 */
lunr.DocumentStore.prototype.remove = function (doc_id) {
  if (!this.has(doc_id)) return;

  delete this.document_store[doc_id];
  this.length--;
};

/**
 * Returns a representation of the document store ready for serialisation.
 *
 * @returns {Object}
 * @memberOf Store
 */
lunr.DocumentStore.prototype.toJSON = function () {
  return {
    document_store: this.document_store,
    length: this.length
  };
};
