/*!
 * elasticlunr.InvertedIndex
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * elasticlunr.InvertedIndex is used for efficient storing and lookup of the inverted index
 * of token to document ref.
 *
 * @constructor
 */
elasticlunr.InvertedIndex = function () {
  this.root = { docs: {}, df: 0 };
  this.length = 0;
};

/**
 * Loads a previously serialised inverted index.
 *
 * @param {Object} serialisedData The serialised inverted index to load.
 * @returns {elasticlunr.InvertedIndex}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.load = function (serialisedData) {
  var idx = new this;

  idx.root = serialisedData.root;
  idx.length = serialisedData.length;

  return idx;
};

/**
 * Adds a new token tokenInfo pair to the inverted index.
 *
 * By default this function starts at the root of the current inverted index, however
 * it can start at any node of the inverted index if required.
 *
 * @param {String} token The token to store the tokenInfo under
 * @param {Object} tokenInfo The tokenInfo to store against the token
 * @param {Object} root An optional node at which to start looking for the
 * correct place to enter the doc, by default the root of this elasticlunr.InvertedIndex
 * is used.
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.addToken = function (token, tokenInfo, root) {
  var root = root || this.root,
      idx = 0;

  while (idx <= token.length - 1) {
    var key = token[idx];

    if (!(key in root)) root[key] = {docs: {}, df: 0};
    idx += 1;
    root = root[key];
  }

  if (!root.docs[tokenInfo.ref]) {
    // if this doc not exist, then add this doc
    root.docs[tokenInfo.ref] = tokenInfo;
    root.df += 1;
    this.length += 1;
  } else {
    // if this doc already exist, then update tokenInfo
    root.docs[tokenInfo.ref] = tokenInfo;
  }
};

/**
 * Checks whether this key is contained within this elasticlunr.InvertedIndex.
 *
 * By default this function starts at the root of the current inverted index, however
 * it can start at any node of inverted index if required.
 *
 * @param {String} token The token to check for
 * @param {Object} root An optional node at which to start
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.hasToken = function (token) {
  if (!token) return false;

  var node = this.root;

  for (var i = 0; i < token.length; i++) {
    if (!node[token[i]]) return false;
    node = node[token[i]];
  }

  return true;
};

/**
 * Retrieve a node from the inverted index for a given token.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of inverted index if required.
 *
 * @param {String} token The token to get the node for.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @see InvertedIndex.prototype.get
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getNode = function (token) {
  if (!token) return {};

  var node = this.root;

  for (var i = 0; i < token.length; i++) {
    if (!node[token[i]]) return {};
    node = node[token[i]];
  }

  return node;
};

/**
 * Retrieve the documents for a node for the given token.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of inverted index if required.
 *
 * @param {String} token The token to get the documents for.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getDocs = function (token, root) {
  return this.getNode(token, root).docs || {};
};

/**
 * Retrieve the document frequency of given token.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of inverted index if required.
 *
 * @param {String} token The token to get the documents for.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.getDocFreq = function (token, root) {
  var node = this.getNode(token, root);
  if (node.df) {
    return node.df;
  }
  return 0;
};

/**
 * Remove the document identified by ref from the token in the inverted index.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of inverted index if required.
 *
 * @param {String} token The token to get the documents for.
 * @param {String} ref The ref of the document to remove from this token.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.removeToken = function (token, ref) {
  if (!token) return;
  var node = this.root;

  for (var i = 0; i < token.length; i++) {
    if (!(token[i] in node)) return;
    node = node[token[i]];
  }

  if (ref in node.docs) {
    delete node.docs[ref];
    node.df -= 1;
  }
};

/**
 * Find all the possible suffixes of the passed token using tokens
 * currently in the inverted index.
 *
 * @param {String} token The token to expand.
 * @returns {Array}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.expandToken = function (token, memo, root) {
  if (root == void 0) {
    root = this.getNode(token);
  }

  var docs = root.docs || {},
      memo = memo || [];

  if (root.df > 0) memo.push(token);

  for (var key in root) {
    if (key === 'docs') continue;
    memo.concat(this.expandToken(token + key, memo, root[key]));
  }

  return memo;
}

/**
 * Returns a representation of the inverted index ready for serialisation.
 *
 * @returns {Object}
 * @memberOf InvertedIndex
 */
elasticlunr.InvertedIndex.prototype.toJSON = function () {
  return {
    root: this.root,
    length: this.length
  };
};

