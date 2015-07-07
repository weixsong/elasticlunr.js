/*!
 * elasticlunr.Index
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

/**
 * elasticlunr.Index is object that manages a search index.  It contains the indexes
 * and stores all the tokens and document lookups.  It also provides the main
 * user facing API for the library.
 *
 * @constructor
 */
elasticlunr.Index = function () {
  this._fields = [];
  this._ref = 'id';
  this.pipeline = new elasticlunr.Pipeline;
  this.documentStore = new elasticlunr.DocumentStore;
  this.index = {};
  this.eventEmitter =  new elasticlunr.EventEmitter;

  this._idfCache = {};

  this.on('add', 'remove', 'update', (function () {
    this._idfCache = {};
  }).bind(this));
};

/**
 * Bind a handler to events being emitted by the index.
 *
 * The handler can be bound to many events at the same time.
 *
 * @param {String} [eventName] The name(s) of events to bind the function to.
 * @param {Function} fn The serialised set to load.
 * @memberOf Index
 */
elasticlunr.Index.prototype.on = function () {
  var args = Array.prototype.slice.call(arguments);
  return this.eventEmitter.addListener.apply(this.eventEmitter, args);
};

/**
 * Removes a handler from an event being emitted by the index.
 *
 * @param {String} eventName The name of events to remove the function from.
 * @param {Function} fn The serialised set to load.
 * @memberOf Index
 */
elasticlunr.Index.prototype.off = function (name, fn) {
  return this.eventEmitter.removeListener(name, fn);
};

/**
 * Loads a previously serialised index.
 *
 * Issues a warning if the index being imported was serialised
 * by a different version of elasticlunr.
 *
 * @param {Object} serialisedData The serialised set to load.
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.load = function (serialisedData) {
  if (serialisedData.version !== elasticlunr.version) {
    elasticlunr.utils.warn('version mismatch: current ' 
                    + elasticlunr.version + ' importing ' + serialisedData.version);
  }

  var idx = new this;

  idx._fields = serialisedData.fields;
  idx._ref = serialisedData.ref;
  idx.documentStore = elasticlunr.DocumentStore.load(serialisedData.documentStore);
  idx.pipeline = elasticlunr.Pipeline.load(serialisedData.pipeline);
  idx.index = {};
  for (var field in serialisedData.index) {
    idx.index[field] = elasticlunr.InvertedIndex.load(serialisedData.index[field]);
  }

  return idx;
};

/**
 * Adds a field to the list of fields that will be searchable within documents in the index.
 * 
 * Remember that inner index is build based on field, which means each field has one inverted index.
 *
 * Fields should be added before any documents are added to the index, fields
 * that are added after documents are added to the index will only apply to new
 * documents added to the index.
 *
 * @param {String} fieldName The name of the field within the document that should be indexed
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.prototype.addField = function (fieldName) {
  this._fields.push(fieldName);
  this.index[fieldName] = new elasticlunr.InvertedIndex;
  return this;
};

/**
 * Sets the property used to uniquely identify documents added to the index,
 * by default this property is 'id'.
 *
 * This should only be changed before adding documents to the index, changing
 * the ref property without resetting the index can lead to unexpected results.
 *
 * @param {String} refName The property to use to uniquely identify the
 * documents in the index.
 * @param {Boolean} emitEvent Whether to emit add events, defaults to true
 * @return {elasticlunr.Index}
 * @memberOf Index
 */
elasticlunr.Index.prototype.setRef = function (refName) {
  this._ref = refName;
  return this;
};

/**
 * Add a JSON format document to the index.
 *
 * This is the way new documents enter the index, this function will run the
 * fields from the document through the index's pipeline and then add it to
 * the index, it will then show up in search results.
 *
 * An 'add' event is emitted with the document that has been added and the index
 * the document has been added to. This event can be silenced by passing false
 * as the second argument to add.
 *
 * @param {Object} doc The JSON format document to add to the index.
 * @param {Boolean} emitEvent Whether or not to emit events, default true.
 * @memberOf Index
 */
elasticlunr.Index.prototype.addDoc = function (doc, emitEvent) {
  if (!doc) return;
  var emitEvent = emitEvent === undefined ? true : emitEvent;

  var docRef = doc[this._ref];
  this.documentStore.addDoc(docRef, doc);
  this._fields.forEach(function (field) {
    var fieldTokens = this.pipeline.run(elasticlunr.tokenizer(doc[field]));
    var fieldLength = fieldTokens.length;
    var tokenCount = {};
    fieldTokens.forEach(function (token) {
      if (token in tokenCount) tokenCount[token] += 1;
      else tokenCount[token] = 1;
    }, this);

    for (var token in tokenCount) {
      var tf = tokenCount[token];
      tf = Math.sqrt(tf);
      this.index[field].addToken(token, { ref: docRef, tf: tf });
    }
  }, this);

  if (emitEvent) this.eventEmitter.emit('add', doc, this);
};

/**
 * Removes a document from the index.
 *
 * To make sure documents no longer show up in search results they can be
 * removed from the index using this method.
 *
 * A 'remove' event is emitted with the document that has been removed and the index
 * the document has been removed from. This event can be silenced by passing false
 * as the second argument to remove.
 *
 * @param {Object} docRef The document to remove from the index.
 * @param {Boolean} emitEvent Whether to emit remove events, defaults to true
 * @memberOf Index
 */
elasticlunr.Index.prototype.removeDoc = function (docRef, emitEvent) {
  if (!docRef) return;
  var emitEvent = emitEvent === undefined ? true : emitEvent;

  if (!this.documentStore.hasDoc(docRef)) return;

  var doc = this.documentStore.getDoc(docRef);
  this.documentStore.removeDoc(docRef);

  this._fields.forEach(function (field) {
    var fieldTokens = this.pipeline.run(elasticlunr.tokenizer(doc[field]));
    for (var token in fieldTokens) {
      this.index[field].removeToken(token);
    }
  }, this);

  if (emitEvent) this.eventEmitter.emit('remove', docRef, this);
};

/**
 * Updates a document in the index.
 *
 * When a document contained within the index gets updated, fields changed,
 * added or removed, to make sure it correctly matched against search queries,
 * it should be updated in the index.
 *
 * This method is just a wrapper around `remove` and `add`
 *
 * An 'update' event is emitted with the document that has been updated and the index.
 * This event can be silenced by passing false as the second argument to update. Only
 * an update event will be fired, the 'add' and 'remove' events of the underlying calls
 * are silenced.
 *
 * @param {Object} doc The document to update in the index.
 * @param {Boolean} emitEvent Whether to emit update events, defaults to true
 * @see Index.prototype.remove
 * @see Index.prototype.add
 * @memberOf Index
 */
elasticlunr.Index.prototype.update = function (doc, emitEvent) {
  var emitEvent = emitEvent === undefined ? true : emitEvent;

  this.removeDoc(doc[this._ref], false);
  this.addDoc(doc, false);

  if (emitEvent) this.eventEmitter.emit('update', doc, this);
};

/**
 * Calculates the inverse document frequency for a token within the index of a field.
 *
 * @param {String} token The token to calculate the idf of.
 * @param {String} field The field to compute idf.
 * @see Index.prototype.idf
 * @private
 * @memberOf Index
 */
elasticlunr.Index.prototype.idf = function (term, field) {
  var cacheKey = "@" + field + '/' + term;
  if (Object.prototype.hasOwnProperty.call(this._idfCache, cacheKey)) return this._idfCache[cacheKey];

  var df = this.index[field].getDocFreq(term);
  var idf = 1 + Math.log(this.index[field].length / (df + 1));
  this._idfCache[cacheKey] = idf;

  return idf;
};

/**
 * Searches the index using the passed query.
 * Queries should be a string, multiple words are allowed.
 * 
 * If config is null, will search all fields defaultly, and lead to AND based query.
 * If config is specified, will search specified with query time boosting.
 *
 * All query tokens are passed through the same pipeline that document tokens
 * are passed through, so any language processing involved will be run on every
 * query term.
 *
 * Each query term is expanded, so that the term 'he' might be expanded to
 * 'hello' and 'help' if those terms were already included in the index.
 *
 * Matching documents are returned as an array of objects, each object contains
 * the matching document ref, as set for this index, and the similarity score
 * for this document against the query.
 *
 * @param {String} query The query to search the index with.
 * @param {Object} config The query config, JSON format.
 * @return {Object}
 * @see Index.prototype.idf
 * @see Index.prototype.documentVector
 * @memberOf Index
 */
elasticlunr.Index.prototype.search = function (query, config) {
  if (!query) return [];
  var queryTokens = this.pipeline.run(elasticlunr.tokenizer(query));

  var searchFields = {};
  if (config == null || config['fileds'] == null) {
    this._fields.forEach(function (field) {
      searchFields[field] = {boost: 1};
    }, this);
  } else {
    searchFields = config['fields'];
  }

  var queryResults = {};

  for (var field in searchFields) {
    var fieldSearchResults = this.fieldSearch(queryTokens, field, config);
    for (var docRef in fieldSearchResults) {
      if (docRef in queryResults) {
        queryResults[docRef] += fieldSearchResults[docRef];
      } else {
        queryResults[docRef] = fieldSearchResults[docRef];
      }
    }
  }

  var results = [];
  for (var docRef in queryResults) {
    results.push({ref: docRef, score: queryResults[docRef]});
  }

  results.sort(function (a, b) { return b.score - a.score });
  return results;
};

/**
 * search queryTokens in specified field.
 *
 * @param {Array} queryTokens The query tokens to query in this field.
 * @param {String} field Field to query in.
 * @param {Object} config search config.
 * @return {Object}
 */
elasticlunr.Index.prototype.fieldSearch = function (queryTokens, fieldName, config) {
  var boost = (config == null || 
               config['fields'] == null || 
               config['fields'].fieldName.boost == null) ? 1 : config['fields'].fieldName.boost;

  var fieldQueryResults = {};
  queryTokens.forEach(function (token) {
    var docs = this.index[fieldName].getDocs(token);

    for (var docRef in docs) {
      var tf = docs[docRef].tf;
      var idf = this.idf(token, fieldName);
      var score = tf * idf * idf;
      if (docRef in fieldQueryResults) {
        fieldQueryResults[docRef] += score;
      } else {
        fieldQueryResults[docRef] = score;
      }
    }
  }, this);

  for (var docRef in fieldQueryResults) {
    fieldQueryResults[docRef] *= boost;
  }

  return fieldQueryResults;
};

/**
 * Returns a representation of the index ready for serialisation.
 *
 * @return {Object}
 * @memberOf Index
 */
elasticlunr.Index.prototype.toJSON = function () {
  var indexJson = {};
  for (var idx in this._fields) {
    var fieldName = this._fields[idx];
    indexJson[fieldName] = this.index[fieldName].toJSON();
  }

  return {
    version: elasticlunr.version,
    fields: this._fields,
    ref: this._ref,
    documentStore: this.documentStore.toJSON(),
    index: indexJson,
    pipeline: this.pipeline.toJSON()
  };
};

/**
 * Applies a plugin to the current index.
 *
 * A plugin is a function that is called with the index as its context.
 * Plugins can be used to customise or extend the behaviour the index
 * in some way. A plugin is just a function, that encapsulated the custom
 * behaviour that should be applied to the index.
 *
 * The plugin function will be called with the index as its argument, additional
 * arguments can also be passed when calling use. The function will be called
 * with the index as its context.
 *
 * Example:
 *
 *     var myPlugin = function (idx, arg1, arg2) {
 *       // `this` is the index to be extended
 *       // apply any extensions etc here.
 *     }
 *
 *     var idx = lunr(function () {
 *       this.use(myPlugin, 'arg1', 'arg2')
 *     })
 *
 * @param {Function} plugin The plugin to apply.
 * @memberOf Index
 */
elasticlunr.Index.prototype.use = function (plugin) {
  var args = Array.prototype.slice.call(arguments, 1)
  args.unshift(this)
  plugin.apply(this, args)
}
