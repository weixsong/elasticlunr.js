(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/elasticlunr.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/configuration.js":
/*!******************************!*\
  !*** ./lib/configuration.js ***!
  \******************************/
/*! exports provided: configuration */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "configuration", function() { return configuration; });
/* !
 * elasticlunr.Configuration
 * Copyright (C) @YEAR Wei Song
 */

/**
  * elasticlunr.Configuration is used to analyze the user search configuration.
  *
  * By elasticlunr.Configuration user could set query-time boosting, boolean model in each field.
  *
  * Currently configuration supports:
  * 1. query-time boosting, user could set how to boost each field.
  * 2. boolean model chosing, user could choose which boolean model to use for each field.
  * 3. token expandation, user could set token expand to True to improve Recall. Default is False.
  *
  * Query time boosting must be configured by field category, "boolean" model could be configured
  * by both field category or globally as the following example. Field configuration for "boolean"
  * will overwrite global configuration.
  * Token expand could be configured both by field category or golbally. Local field configuration will
  * overwrite global configuration.
  *
  * configuration example:
  * {
  *   fields:{
  *     title: {boost: 2},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  *
  * "bool" field configuation overwrite global configuation example:
  * {
  *   fields:{
  *     title: {boost: 2, bool: "AND"},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  *
  * "expand" example:
  * {
  *   fields:{
  *     title: {boost: 2, bool: "AND"},
  *     body: {boost: 1}
  *   },
  *   bool: "OR",
  *   expand: true
  * }
  *
  * "expand" example for field category:
  * {
  *   fields:{
  *     title: {boost: 2, bool: "AND", expand: true},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  *
  * setting the boost to 0 ignores the field (this will only search the title):
  * {
  *   fields:{
  *     title: {boost: 1},
  *     body: {boost: 0}
  *   }
  * }
  *
  * then, user could search with configuration to do query-time boosting.
  * idx.search('oracle database', {fields: {title: {boost: 2}, body: {boost: 1}}});
  *
  *
  * @constructor
  *
  * @param {String} config user configuration
  * @param {Array} fields fields of index instance
  * @module
  */
function configuration(elasticlunr) {
  elasticlunr.Configuration = function (config, fields) {
    var userConfig;
    config = config || '';

    if (fields === undefined || fields === null) {
      throw new Error('fields should not be null');
    }

    this.config = {};

    if (config.length === 0) {
      this.buildDefaultConfig(fields);
    } else {
      try {
        userConfig = JSON.parse(config);
        this.buildUserConfig(userConfig, fields);
      } catch (error) {
        elasticlunr.utils.warn('user configuration parse failed, will use default configuration');
        this.buildDefaultConfig(fields);
      }
    }
  };
  /**
   * Build default search configuration.
   *
   * @param {Array} fields fields of index instance
   */


  elasticlunr.Configuration.prototype.buildDefaultConfig = function (fields) {
    this.reset();
    fields.forEach(function (field) {
      this.config[field] = {
        boost: 1,
        bool: 'OR',
        expand: false
      };
    }, this);
  };
  /**
   * Build user configuration.
   *
   * @param {JSON} config User JSON configuratoin
   * @param {Array} fields fields of index instance
   */


  elasticlunr.Configuration.prototype.buildUserConfig = function (config, fields) {
    var globalBool = 'OR';
    var globalExpand = false;
    var field, fieldConfig, fieldExpand;
    this.reset();

    if ('bool' in config) {
      globalBool = config['bool'] || globalBool;
    }

    if ('expand' in config) {
      globalExpand = config['expand'] || globalExpand;
    }

    if ('fields' in config) {
      for (field in config['fields']) {
        if (fields.indexOf(field) > -1) {
          fieldConfig = config['fields'][field];
          fieldExpand = globalExpand;

          if (fieldConfig.expand !== undefined) {
            fieldExpand = fieldConfig.expand;
          }

          this.config[field] = {
            boost: fieldConfig.boost || fieldConfig.boost === 0 ? fieldConfig.boost : 1,
            bool: fieldConfig.bool || globalBool,
            expand: fieldExpand
          };
        } else {
          elasticlunr.utils.warn('field name in user configuration not found in index instance fields');
        }
      }
    } else {
      this.addAllFields2UserConfig(globalBool, globalExpand, fields);
    }
  };
  /**
   * Add all fields to user search configuration.
   *
   * @param {String} bool Boolean model
   * @param {String} expand Expand model
   * @param {Array} fields fields of index instance
   */


  elasticlunr.Configuration.prototype.addAllFields2UserConfig = function (bool, expand, fields) {
    fields.forEach(function (field) {
      this.config[field] = {
        boost: 1,
        bool: bool,
        expand: expand
      };
    }, this);
  };
  /**
   * get current user configuration
   */


  elasticlunr.Configuration.prototype.get = function () {
    return this.config;
  };
  /**
   * reset user search configuration.
   */


  elasticlunr.Configuration.prototype.reset = function () {
    this.config = {};
  };
}
;

/***/ }),

/***/ "./lib/document_store.js":
/*!*******************************!*\
  !*** ./lib/document_store.js ***!
  \*******************************/
/*! exports provided: documentStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "documentStore", function() { return documentStore; });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/* !
 * elasticlunr.DocumentStore
 * Copyright (C) @YEAR Wei Song
 */

/**
 * Cloning object
 *
 * @param {Object} object in JSON format
 * @return {Object} copied object
 */
function clone(obj) {
  var copy, attr;
  if (obj === null || _typeof(obj) !== 'object') return obj;
  copy = obj.constructor();

  for (attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }

  return copy;
}
/**
 * elasticlunr.DocumentStore is a simple key-value document store used for storing
 * sets of tokens for documents stored in index.
 *
 * elasticlunr.DocumentStore store original JSON format documents that you
 * could build search snippet by this original JSON document.
 *
 * user could choose whether original JSON format document should be store,
 * if no configuration then document will be stored defaultly.
 * If user care more about the index size, user could select not store JSON documents,
 * then this will has some defects, such as user could not use JSON document
 * to generate snippets of search results.
 *
 * @param {Boolean} save If the original JSON document should be stored.
 * @constructor
 * @module
 */


function documentStore(elasticlunr) {
  elasticlunr.DocumentStore = function (save) {
    this.setDocStored(save);
    this.docs = {};
    this.docInfo = {};
    this.length = 0;
  };
  /**
   * Loads a previously serialised document store
   *
   * @param {Object} serialisedData The serialised document store to load.
   * @return {elasticlunr.DocumentStore}
   */


  elasticlunr.DocumentStore.load = function (serialisedData) {
    var store = new this();
    store.length = serialisedData.length;
    store.docs = serialisedData.docs;
    store.docInfo = serialisedData.docInfo;
    store._save = serialisedData.save;
    return store;
  };
  /**
   * Resets the contents of the document store
   *
   * @param {Boolean} canSave whether to allow saving documents.
   * @return {Boolean}
   */


  elasticlunr.DocumentStore.prototype.resetStore = function (canSave) {
    this.docs = {};
    this.docInfo = {};
    this.length = 0;
    return this.setDocStored(canSave);
  };
  /**
   * Sets whether the documents are stored or not.
   *
   * @param {Boolean} canSave whether the documents are stored
   * @return {Boolean}
   */


  elasticlunr.DocumentStore.prototype.setDocStored = function (canSave) {
    if (canSave === null || canSave === undefined) {
      this._save = true;
    } else {
      this._save = canSave;
    }

    return this._save;
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
      this.docs[docRef] = clone(doc);
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
    delete this.docInfo[docRef];
    this.length--;
  };
  /**
   * Add field length of a document's field tokens from pipeline results.
   * The field length of a document is used to do field length normalization
   * even without the original JSON document stored.
   *
   * @param {Integer|String} docRef document's id or reference
   * @param {String} fieldName field name
   * @param {Integer} length field length
   */


  elasticlunr.DocumentStore.prototype.addFieldLength = function (docRef, fieldName, length) {
    if (docRef === null || docRef === undefined) return;
    if (this.hasDoc(docRef) === false) return;
    if (!this.docInfo[docRef]) this.docInfo[docRef] = {};
    this.docInfo[docRef][fieldName] = length;
  };
  /**
   * Update field length of a document's field tokens from pipeline results.
   * The field length of a document is used to do field length normalization even
   * without the original JSON document stored.
   *
   * @param {Integer|String} docRef document's id or reference
   * @param {String} fieldName field name
   * @param {Integer} length field length
   */


  elasticlunr.DocumentStore.prototype.updateFieldLength = function (docRef, fieldName, length) {
    if (docRef === null || docRef === undefined) return;
    if (this.hasDoc(docRef) === false) return;
    this.addFieldLength(docRef, fieldName, length);
  };
  /**
   * get field length of a document by docRef
   *
   * @param {Integer|String} docRef document id or reference
   * @param {String} fieldName field name
   * @return {Integer} field length
   */


  elasticlunr.DocumentStore.prototype.getFieldLength = function (docRef, fieldName) {
    if (docRef === null || docRef === undefined) return 0;
    if (!(docRef in this.docs)) return 0;
    if (!(fieldName in this.docInfo[docRef])) return 0;
    return this.docInfo[docRef][fieldName];
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
      docInfo: this.docInfo,
      length: this.length,
      save: this._save
    };
  };
}
;

/***/ }),

/***/ "./lib/dsl.js":
/*!********************!*\
  !*** ./lib/dsl.js ***!
  \********************/
/*! exports provided: Repository, QueryRepository, Query, BoolQuery, MatchAllQuery, MatchQuery, TermsQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Repository", function() { return Repository; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueryRepository", function() { return QueryRepository; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Query", function() { return Query; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoolQuery", function() { return BoolQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatchAllQuery", function() { return MatchAllQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatchQuery", function() { return MatchQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TermsQuery", function() { return TermsQuery; });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Repository = /*#__PURE__*/function () {
  function Repository(queries) {
    _classCallCheck(this, Repository);

    this.queries = queries || {};
  }

  _createClass(Repository, [{
    key: "parse",
    value: function parse(element, options, queryOptions) {
      if (!this.queries[element]) throw Error("Unknown query type ".concat(element));
      return this.queries[element](this, options, queryOptions);
    }
  }, {
    key: "register",
    value: function register(element, parser) {
      this.queries[element] = parser;
    }
  }]);

  return Repository;
}();

var QueryRepository = new Repository();

var Query = /*#__PURE__*/function () {
  function Query() {
    _classCallCheck(this, Query);
  }

  _createClass(Query, [{
    key: "filter",
    value: function filter(index, options) {
      var results = this.score(index, options);
      return results.filter(function (_ref) {
        var id = _ref.id,
            score = _ref.score;
        return score > 0;
      });
    }
  }, {
    key: "score",
    value: function score(index, options) {
      throw Error('Please extend the score() method');
    } // Basic query

  }, {
    key: "rewrite",
    value: function rewrite(index) {
      return this;
    }
  }]);

  return Query;
}();

var NotQuery = /*#__PURE__*/function (_Query) {
  _inherits(NotQuery, _Query);

  var _super = _createSuper(NotQuery);

  function NotQuery(innerQuery) {
    var _this;

    _classCallCheck(this, NotQuery);

    _this = _super.call(this, innerQuery);
    _this.inner = innerQuery;
    return _this;
  }

  _createClass(NotQuery, [{
    key: "score",
    value: function score(index, options) {
      var queryAll = index.all(options),
          queryScore = this.inner.score(index, options);
      var matchedIDS = queryScore.map(function (doc) {
        return doc.ref;
      });
      return queryAll.filter(function (id) {
        return matchedIDS.indexOf(id) < 0;
      }).map(function (id) {
        return {
          ref: id,
          score: 1
        };
      });
    }
  }]);

  return NotQuery;
}(Query);

QueryRepository.register('not', function (repo, options, queryOptions) {
  var keys = Object.keys(options);
  if (!keys || !keys[0]) throw Error('A not query must have a query type as root element');
  return new NotQuery(QueryRepository.parse(keys[0], options[keys[0]], options));
});

var BoolQuery = /*#__PURE__*/function (_Query2) {
  _inherits(BoolQuery, _Query2);

  var _super2 = _createSuper(BoolQuery);

  function BoolQuery(options) {
    var _this2;

    _classCallCheck(this, BoolQuery);

    _this2 = _super2.call(this, options);
    _this2.should = options.should || [];
    _this2.must = options.must || false;
    _this2.must_not = options.must_not || false;
    _this2.filter = options.filter;
    _this2.minimum_should_match = options.minimum_should_match || 1;
    return _this2;
  }

  _createClass(BoolQuery, [{
    key: "rewrite",
    value: function rewrite(idx) {
      var filters = this.filter || [];
      var q = new BoolQuery({
        should: (this.should || []).map(function (q) {
          return q.rewrite(idx);
        }),
        must: this.must ? this.must.rewrite(idx) : false,
        minimum_should_match: this.minimum_should_match
      });

      if (this.must_not) {
        filters.push(new NotQuery(this.must_not.rewrite(idx)));
      }

      if (filters && filters.length) {
        q.filter = filters.map(function (r) {
          return r.rewrite(idx);
        });
      }

      return q;
    }
  }, {
    key: "score",
    value: function score(index, options, isRewritten) {
      var _this3 = this;

      if (!isRewritten) {
        return this.rewrite(index).score(index, options, true);
      } // Run filter context and must/must not if any


      var filter_results = false;

      if (this.filter && this.filter.length) {
        filter_results = this.filter.reduce(function (currentDocSet, query) {
          var q = currentDocSet !== false ? {
            filtered: currentDocSet.map(function (doc) {
              return doc.ref;
            })
          } : {};
          return query.filter(index, q);
        }, filter_results);
      }

      var docs = {};

      if (this.must) {
        // This score counts
        var q = filter_results !== false ? {
          filtered: filter_results.map(function (doc) {
            return doc.ref;
          })
        } : {};
        filter_results = this.must.score(index, q);
      }

      var filterQuery = {};

      if (filter_results !== false) {
        filterQuery.filtered = [];
        filter_results.forEach(function (doc) {
          filterQuery.filtered.push(doc.ref);
          docs[doc.ref] = {
            ref: doc.ref,
            positions: [],
            score: doc.score || 0,
            matched: 0
          };
        });
      }

      this.should.reduce(function (fq, query) {
        var results = query.score(index, fq);
        results.forEach(function (doc) {
          if (!docs[doc.ref]) {
            docs[doc.ref] = {
              ref: doc.ref,
              positions: {},
              score: 0,
              matched: 0
            };
          }

          Object.entries(doc.positions).forEach(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
                field = _ref3[0],
                tokens = _ref3[1];

            if (!docs[doc.ref].positions[field]) docs[doc.ref].positions[field] = [];
            tokens.forEach(function (t) {
              return docs[doc.ref].positions[field].push(t);
            });
          });
          docs[doc.ref].score += doc.score;
          docs[doc.ref].matched++;
        });
        return fq;
      }, filterQuery);
      return Object.entries(docs).map(function (o) {
        return o[1];
      }).filter(function (doc) {
        return doc.matched >= _this3.minimum_should_match && doc.score > 0;
      });
    }
  }]);

  return BoolQuery;
}(Query);

QueryRepository.register('bool', function (repo, options, queryOptions) {
  var opts = {};

  if (options.should) {
    opts.should = options.should.map(function (query) {
      var k = Object.keys(query);
      if (!k || !k[0]) return repo.parse('match_all', {});
      return repo.parse(k[0], query[k[0]], query);
    });
  }

  if (options.filter) {
    opts.filter = options.filter.map(function (query) {
      var k = Object.keys(query);
      if (!k || !k[0]) return repo.parse('match_all', {});
      return repo.parse(k[0], query[k[0]], query);
    });
  }

  if (options.must) {
    var must_k = Object.keys(options.must);
    if (must_k && must_k[0]) opts.must = repo.parse(must_k[0], options.must[must_k[0]], options.must);
  }

  if (options.must_not) {
    var must_not_k = Object.keys(options.must_not);

    if (must_not_k && must_not_k[0]) {
      opts.must_not = repo.parse(must_not_k[0], options.must_not[must_not_k[0]], options.must_not);
    }
  }

  if (options.minimum_should_match && options.minimum_should_match <= opts.should.length) {
    opts.minimum_should_match = options.minimum_should_match;
  }

  return new BoolQuery(opts);
}); // let QueryCache = {};

var TermsQuery = /*#__PURE__*/function (_Query3) {
  _inherits(TermsQuery, _Query3);

  var _super3 = _createSuper(TermsQuery);

  function TermsQuery(options) {
    var _this4;

    _classCallCheck(this, TermsQuery);

    _this4 = _super3.call(this, options);
    _this4.minimum_should_match = options.minimum_should_match || 1;
    _this4.expand = !!options.expand;
    _this4.field = options.field || '';
    _this4.terms = options.terms || [];
    _this4.boost = options.boost || 1;
    _this4.fuzziness = options.fuzziness || 0;
    if (!Array.isArray(_this4.terms)) _this4.terms = [_this4.terms];
    return _this4;
  }

  _createClass(TermsQuery, [{
    key: "score",
    value: function score(index, options) {
      if (!options) options = {};
      var query = {
        field: this.field,
        terms: this.expand ? this.terms.map(function (term) {
          return new RegExp('^' + term + '.*');
        }) : this.terms,
        fuzziness: this.fuzziness,
        minimum_should_match: this.minimum_should_match
      };

      if (options.filtered) {
        query.docs = (options || {}).filtered;
      }

      var docs = index.terms(query);
      var ids = Object.keys(docs);
      var matched = [];

      for (var _i2 = 0, _ids = ids; _i2 < _ids.length; _i2++) {
        var i = _ids[_i2];
        var pickedScore = docs[i].map(function (t) {
          return [t.tf * Math.pow(t.idf, 2) * t.norm, t];
        }).reduce(function (i, t) {
          return t[0] > i[0] ? t : i;
        }, [0, undefined]);
        matched.push({
          ref: i,
          field: this.field,
          positions: _defineProperty({}, this.field, pickedScore[1].positions),
          score: pickedScore[0] * this.boost
        });
      }

      return matched;
    }
  }]);

  return TermsQuery;
}(Query);

var MatchAllQuery = /*#__PURE__*/function (_Query4) {
  _inherits(MatchAllQuery, _Query4);

  var _super4 = _createSuper(MatchAllQuery);

  function MatchAllQuery(options) {
    var _this5;

    _classCallCheck(this, MatchAllQuery);

    _this5 = _super4.call(this, options);
    _this5.boost = options.boost || 1;
    return _this5;
  }

  _createClass(MatchAllQuery, [{
    key: "score",
    value: function score(index, options) {
      var _this6 = this;

      var docIds = index.all();
      return docIds.map(function (docId) {
        return {
          ref: docId,
          score: _this6.boost
        };
      });
    }
  }]);

  return MatchAllQuery;
}(Query);

var MatchQuery = /*#__PURE__*/function (_Query5) {
  _inherits(MatchQuery, _Query5);

  var _super5 = _createSuper(MatchQuery);

  function MatchQuery(options) {
    var _this7;

    _classCallCheck(this, MatchQuery);

    _this7 = _super5.call(this, options);
    _this7.expand = !!options.expand;
    _this7.field = options.field || '';
    _this7.query = options.query || '';
    _this7.boost = options.boost || 1;
    _this7.fuzziness = options.fuzziness || 0;
    _this7.minMatch = options.minimum_must_match !== undefined ? options.minimum_must_match : 1;
    _this7.operator = options.operator === 'and' ? 'and' : 'or';
    return _this7;
  }

  _createClass(MatchQuery, [{
    key: "score",
    value: function score(index, options) {
      // Rewrite
      return this.rewrite(index).score(index, options);
    }
  }, {
    key: "rewrite",
    value: function rewrite(index) {
      var tokens = index.analyze(this.field, this.query, {
        isQuery: true
      });
      if (!Array.isArray(tokens)) tokens = [tokens];
      var q;

      if (tokens.length > 1) {
        q = new TermsQuery({
          field: this.field,
          expand: this.expand,
          terms: tokens,
          fuzziness: this.fuzziness,
          boost: this.boost,
          minimum_should_match: this.operator === 'and' && this.minMatch === 0 ? tokens.length : this.minMatch
        });
        /*
              q = new BoolQuery({
              should: tokens
                  .map((token) => new TermsQuery({
                      field: this.field,
                      expand: this.expand,
                      terms: [token.toString()],
                      fuzziness: this.fuzziness,
                      boost: this.boost
                  }))
              ,
              minimum_should_match: (this.operator === "and" && this.minMatch === 0) ? tokens.length : this.minMatch
              }); */
      } else if (tokens.length === 1) {
        q = new TermsQuery({
          field: this.field,
          expand: this.expand,
          terms: [tokens[0].toString()],
          fuzziness: this.fuzziness,
          boost: this.boost
        });
      } else {
        q = new MatchAllQuery({});
      }

      return q;
    }
  }]);

  return MatchQuery;
}(Query);

QueryRepository.register('match', function (repository, options, queryOptions) {
  var fields = Object.entries(options).filter(function (r) {
    return ['fuzziness', 'operator'].indexOf(r[0]) < 0;
  });
  if (fields.length === 0) return repository.parse('match_all', {}, {});

  if (fields.length > 1) {
    return repository.parse('bool', {
      'should': fields.map(function (_ref4) {
        var _match;

        var _ref5 = _slicedToArray(_ref4, 2),
            fieldName = _ref5[0],
            terms = _ref5[1];

        return {
          'match': (_match = {}, _defineProperty(_match, fieldName, terms), _defineProperty(_match, "fuzziness", options.fuzziness), _defineProperty(_match, "operator", options.operator), _match),
          'expand': !!queryOptions.expand
        };
      }),
      'minimum_should_match': options && options.operator && typeof options.operator === 'string' && options.operator.toLowerCase() === 'and' ? fields.length : 1
    });
  }

  return new MatchQuery({
    field: fields[0][0],
    query: fields[0][1],
    fuzziness: options.fuzziness,
    expand: !!queryOptions.expand,
    operator: options && options.operator && typeof options.operator === 'string' && options.operator.toLowerCase() === 'and' ? 'and' : 'or',
    minimum_must_match: options && options.operator && typeof options.operator === 'string' && options.operator.toLowerCase() === 'and' ? 0 : 1
  });
});
QueryRepository.register('terms', function (repository, options) {
  var fields = Object.entries(options);
  if (fields.length === 0) return repository.parse('match_all', {}, {});

  if (fields.length > 1) {
    return repository.parse('bool', {
      'should': fields.map(function (_ref6) {
        var _ref7 = _slicedToArray(_ref6, 2),
            fieldName = _ref7[0],
            terms = _ref7[1];

        return {
          'terms': _defineProperty({}, fieldName, terms)
        };
      })
    });
  }

  return new TermsQuery({
    field: fields[0][0],
    terms: fields[0][1]
  });
});
QueryRepository.register('match_all', function (repository, options) {
  return new MatchAllQuery({
    boost: options.boost || 1
  });
});


/***/ }),

/***/ "./lib/elasticlunr.js":
/*!****************************!*\
  !*** ./lib/elasticlunr.js ***!
  \****************************/
/*! exports provided: elasticlunr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "elasticlunr", function() { return elasticlunr; });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ "./lib/index.js");
/* harmony import */ var _configuration_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./configuration.js */ "./lib/configuration.js");
/* harmony import */ var _event_emitter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./event_emitter.js */ "./lib/event_emitter.js");
/* harmony import */ var _pipeline_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pipeline.js */ "./lib/pipeline.js");
/* harmony import */ var _document_store_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./document_store.js */ "./lib/document_store.js");
/* harmony import */ var _sorted_set_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sorted_set.js */ "./lib/sorted_set.js");
/* harmony import */ var _tokenizer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./tokenizer.js */ "./lib/tokenizer.js");
/* harmony import */ var _stemmer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./stemmer.js */ "./lib/stemmer.js");
/* harmony import */ var _stop_word_filter_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./stop_word_filter.js */ "./lib/stop_word_filter.js");
/* harmony import */ var _trimmer_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./trimmer.js */ "./lib/trimmer.js");
/* !
 * elasticlunr.js
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

/**
 * Convenience function for instantiating a new elasticlunr index and configuring it
 * with the default pipeline functions and the passed config function.
 *
 * When using this convenience function a new index will be created with the
 * following functions already in the pipeline:
 *
 * 1. elasticlunr.trimmer - trim non-word character
 * 2. elasticlunr.StopWordFilter - filters out any stop words before they enter the
 * index
 * 3. elasticlunr.stemmer - stems the tokens before entering the index.
 *
 *
 * Example:
 *
 *     var idx = elasticlunr(function () {
 *       this.addField('id');
 *       this.addField('title');
 *       this.addField('body');
 *
 *       //this.setRef('id'); // default ref is 'id'
 *
 *       this.pipeline.add(function () {
 *         // some custom pipeline function
 *       });
 *     });
 *
 *    idx.addDoc({
 *      id: 1,
 *      title: 'Oracle released database 12g',
 *      body: 'Yesterday, Oracle has released their latest database, named 12g, more robust.'
 *    });
 *
 *    idx.addDoc({
 *      id: 2,
 *      title: 'Oracle released annual profit report',
 *      body: 'Yesterday, Oracle has released their annual profit report of 2015, total profit is 12.5 Billion.'
 *    });
 *
 *    # simple search
 *    idx.search('oracle database');
 *
 *    # search with query-time boosting
 *    idx.search('oracle database', {fields: {title: {boost: 2}, body: {boost: 1}}});
 *
 * @param {Function} config A function that will be called with the new instance
 * of the elasticlunr.Index as both its context and first parameter. It can be used to
 * customize the instance of new elasticlunr.Index.
 * @namespace
 * @module
 * @return {elasticlunr.Index}
 *
 */
var elasticlunr = function elasticlunr(config) {
  var idx = elasticlunr.Index();
  idx.pipeline.add(elasticlunr.trimmer, elasticlunr.stopWordFilter, elasticlunr.stemmer);
  if (config) config.call(idx, idx);
  return idx;
};












[_utils_js__WEBPACK_IMPORTED_MODULE_0__["utils"], _index_js__WEBPACK_IMPORTED_MODULE_1__["index"], _configuration_js__WEBPACK_IMPORTED_MODULE_2__["configuration"], _event_emitter_js__WEBPACK_IMPORTED_MODULE_3__["eventEmitter"], _pipeline_js__WEBPACK_IMPORTED_MODULE_4__["pipeline"], _document_store_js__WEBPACK_IMPORTED_MODULE_5__["documentStore"], _sorted_set_js__WEBPACK_IMPORTED_MODULE_6__["sortedSet"], _tokenizer_js__WEBPACK_IMPORTED_MODULE_7__["tokenizer"], _stemmer_js__WEBPACK_IMPORTED_MODULE_8__["stemmer"], _stop_word_filter_js__WEBPACK_IMPORTED_MODULE_9__["stopWordFilter"], _trimmer_js__WEBPACK_IMPORTED_MODULE_10__["trimmer"]].forEach(function (module) {
  module(elasticlunr);
}); // elasticlunr.version = __VERSION__;
// only used this to make elasticlunr.js compatible with lunr-languages
// this is a trick to define a global alias of elasticlunr



/***/ }),

/***/ "./lib/event_emitter.js":
/*!******************************!*\
  !*** ./lib/event_emitter.js ***!
  \******************************/
/*! exports provided: eventEmitter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eventEmitter", function() { return eventEmitter; });
/* !
 * elasticlunr.EventEmitter
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */
function eventEmitter(elasticlunr) {
  /**
   * elasticlunr.EventEmitter is an event emitter for elasticlunr.
   * It manages adding and removing event handlers and triggering events and their handlers.
   *
   * Each event could has multiple corresponding functions,
   * these functions will be called as the sequence that they are added into the event.
   *
   * @constructor
   */
  elasticlunr.EventEmitter = function () {
    this.events = {};
  };
  /**
   * Binds a handler function to a specific event(s).
   *
   * Can bind a single function to many different events in one call.
   *
   * @param {String} [eventName] The name(s) of events to bind this function to.
   * @param {Function} fn The function to call when an event is fired.
   * @memberOf EventEmitter
   */


  elasticlunr.EventEmitter.prototype.addListener = function () {
    var args = Array.prototype.slice.call(arguments),
        fn = args.pop(),
        names = args;
    if (typeof fn !== 'function') throw new TypeError('last argument must be a function');
    names.forEach(function (name) {
      if (!this.hasHandler(name)) this.events[name] = [];
      this.events[name].push(fn);
    }, this);
    return true;
  };
  /**
   * Removes a handler function from a specific event.
   *
   * @param {String} eventName The name of the event to remove this function from.
   * @param {Function} fn The function to remove from an event.
   * @memberOf EventEmitter
   */


  elasticlunr.EventEmitter.prototype.removeListener = function (name, fn) {
    var fnIndex;
    if (!this.hasHandler(name)) return;
    fnIndex = this.events[name].indexOf(fn);
    if (fnIndex === -1) return;
    this.events[name].splice(fnIndex, 1);
    if (this.events[name].length === 0) delete this.events[name];
  };
  /**
   * Call all functions that bounded to the given event.
   *
   * Additional data can be passed to the event handler as arguments to `emit`
   * after the event name.
   *
   * @param {String} eventName The name of the event to emit.
   * @memberOf EventEmitter
   */


  elasticlunr.EventEmitter.prototype.emit = function (name) {
    var args;
    if (!this.hasHandler(name)) return;
    args = Array.prototype.slice.call(arguments, 1);
    this.events[name].forEach(function (fn) {
      fn.apply(undefined, args);
    }, this);
  };
  /**
   * Checks whether a handler has ever been stored against an event.
   *
   * @param {String} eventName The name of the event to check.
   * @private
   * @memberOf EventEmitter
   */


  elasticlunr.EventEmitter.prototype.hasHandler = function (name) {
    return name in this.events;
  };
}
;

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! exports provided: index */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "index", function() { return index; });
/* harmony import */ var _index_withPosition_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index/withPosition.js */ "./lib/index/withPosition.js");
/* harmony import */ var _index_converter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index/converter.js */ "./lib/index/converter.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// import idx096 from "./index/legacy.js";



var IndexAssembly = /*#__PURE__*/function () {
  function IndexAssembly(elasticlunr) {
    _classCallCheck(this, IndexAssembly);

    this.elasticlunr = elasticlunr;
    this.knownVersions = [];
    this.components = {};
  }

  _createClass(IndexAssembly, [{
    key: "registerComponent",
    value: function registerComponent(componentType, item) {
      this.components[componentType] = item;
    }
  }, {
    key: "register",
    value: function register(version, generator, isDefault) {
      this.knownVersions.push({
        version: version,
        generator: generator,
        "default": isDefault
      });
    }
  }, {
    key: "loadComponent",
    value: function loadComponent(component) {
      if (this.components[component]) return this.components[component](this);
      return null;
    }
  }, {
    key: "loadIndex",
    value: function loadIndex(data) {
      if (!data.version) {
        throw Error('No index version provided. Are you sure this is an elasticlunr index?');
      }

      var _iterator = _createForOfIteratorHelper(this.knownVersions),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var o = _step.value;

          if (typeof o.version === 'string' && data.version === o.version) {
            return o.generator(this).load(data);
          }

          if (o.version instanceof RegExp && o.version.test(data.version)) {
            return o.generator(this).load(data);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      throw Error("Unknown index version ".concat(data.version));
    }
  }, {
    key: "createDefault",
    value: function createDefault() {
      var _iterator2 = _createForOfIteratorHelper(this.knownVersions),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var o = _step2.value;
          if (o["default"]) return o.generator(this);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return null;
    }
  }]);

  return IndexAssembly;
}();

;
function index(elasticlunr) {
  var newIndexShim = function newIndexShim(elasticlunr) {
    return function (components) {
      // This is where the great big wrapping magic happens
      var pipeline = new elasticlunr.Pipeline();
      var proxy = new Proxy(pipeline, {
        get: function get(target, propKey, receiver) {
          var propValue = target[propKey];

          if (typeof propValue !== 'function' || propKey !== 'run') {
            return propValue;
          }

          return function () {
            return propValue.call(this, elasticlunr.tokenizer(arguments[0]));
          };
        }
      });
      var objE = new _index_converter_js__WEBPACK_IMPORTED_MODULE_1__["Converter"](new _index_withPosition_js__WEBPACK_IMPORTED_MODULE_0__["Index"]({
        storePositions: true,
        emitter: new elasticlunr.EventEmitter(),
        storeDocuments: true,
        pipeline: proxy
      }), {
        elasticlunr: elasticlunr,
        pipeline: proxy
      });
      objE.pipeline = proxy;
      return objE;
    };
  };

  var idx = new IndexAssembly(elasticlunr); //    var i096 = idx096(elasticlunr);

  var newIndex = newIndexShim(elasticlunr);
  /* idx.register("0.9.6", function(components) {
        return i096(components);
    }, true); */

  idx.register(new RegExp('^(0.9|1.0)'), function (components) {
    var o = newIndex(components);
    return o;
  }, true);

  var idxLoader = function idxLoader() {
    return idx.createDefault();
  };

  idxLoader.load = function (data) {
    return idx.loadIndex(data);
  };

  idxLoader.registerComponent = function (component, generator) {
    return idx.registerComponent(component, generator);
  };

  idxLoader.register = function (version, generator, isDefault) {
    return idx.register(version, generator, isDefault);
  };

  elasticlunr.Index = idxLoader; // Default settings

  idxLoader.registerComponent('documentStore', function (registry) {
    return new elasticlunr.DocumentStore();
  });
  idxLoader.registerComponent('eventEmitter', function (registry) {
    return new elasticlunr.EventEmitter();
  });
  idxLoader.registerComponent('pipeline', function (registry) {
    return new elasticlunr.Pipeline();
  });
}
;

/***/ }),

/***/ "./lib/index/converter.js":
/*!********************************!*\
  !*** ./lib/index/converter.js ***!
  \********************************/
/*! exports provided: Converter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Converter", function() { return Converter; });
/* harmony import */ var _interface_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interface.js */ "./lib/index/interface.js");
/* harmony import */ var _dsl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dsl.js */ "./lib/dsl.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var Converter = /*#__PURE__*/function () {
  function Converter(inner, options) {
    _classCallCheck(this, Converter);

    if (!(inner instanceof _interface_js__WEBPACK_IMPORTED_MODULE_0__["Index"])) throw Error('The object provided must be an instance of the index interface');
    this.inner = inner;
    this.eslunr = options.elasticlunr;
    this.defaultPipeline = this.inner.pipeline;
    this.documentStore = this.inner.documentStore;
  }

  _createClass(Converter, [{
    key: "getRef",
    value: function getRef() {
      return this.inner.getRef();
    }
  }, {
    key: "saveDocument",
    value: function saveDocument(toSave) {
      for (var _i = 0, _Object$values = Object.values(this.inner._fields); _i < _Object$values.length; _i++) {
        var o = _Object$values[_i];
        o._store = toSave;
      }
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.inner.toJSON();
    }
  }, {
    key: "on",
    value: function on() {
      return this.inner.emitter.addListener.apply(this.inner.emitter, arguments);
    }
  }, {
    key: "load",
    value: function load(idx) {
      var _this = this;

      // Sucks, but we need to reyhydrate the pipelines here
      // This is what happens when you have stuff in the global scope, boys and girls!
      if (idx.version === '1.0.0') {
        if (idx.fields) {
          var _loop = function _loop(o) {
            if (idx.fields[o] && idx.fields[o].settings && idx.fields[o].settings.pipeline && Array.isArray(idx.fields[o].settings.pipeline)) {
              if (idx.fields[o].settings.pipeline.length > 0) {
                (function (eslunr) {
                  var pipeline = new eslunr.Pipeline();
                  idx.fields[o].settings.pipeline.forEach(function (fnName) {
                    var fn = eslunr.Pipeline.getRegisteredFunction(fnName);

                    if (fn) {
                      pipeline.add(fn);
                    } else {
                      throw new Error('Cannot load un-registered function: ' + fnName);
                    }
                  });
                  var proxy = new Proxy(pipeline, {
                    get: function get(target, propKey, receiver) {
                      var propValue = target[propKey];

                      if (typeof propValue !== 'function' || propKey !== 'run') {
                        return propValue;
                      }

                      return function () {
                        return propValue.call(this, eslunr.tokenizer(arguments[0]));
                      };
                    }
                  });
                  idx.fields[o].settings.pipeline = proxy;
                })(_this.eslunr);
              } else {
                idx.fields[o].settings.pipeline = _this.defaultPipeline;
              }
            } else {
              delete idx.fields[o].settings.pipeline;
            }
          };

          for (var o = 0; o < idx.fields.length; o++) {
            _loop(o);
          }
        }

        this.inner._load(idx);
      } else {
        if (idx && idx.pipeline) {
          idx.pipeline = this.eslunr.Pipeline.load(idx.pipeline);
        }

        this.inner._legacyLoad(idx);
      }

      return this;
    }
  }, {
    key: "off",
    value: function off() {
      return this.inner.emitter.removeListener.apply(this.inner.emitter, arguments);
    }
  }, {
    key: "setRef",
    value: function setRef(field) {
      return this.inner.setRef(field);
    }
  }, {
    key: "addDoc",
    value: function addDoc(doc, mute) {
      return this.inner.add([doc], mute);
    }
  }, {
    key: "add",
    value: function add(doc) {
      return this.addDoc(doc);
    }
  }, {
    key: "elasticsearch",
    value: function elasticsearch(query) {
      if (!query || !query.query) throw Error('Root object must have a query element');
      var root = query.query;
      var keys = Object.entries(root);
      var q = _dsl_js__WEBPACK_IMPORTED_MODULE_1__["QueryRepository"].parse(keys[0][0], keys[0][1], root);
      return q.score(this.inner).sort(function (a, b) {
        return a.score < b.score;
      });
    }
  }, {
    key: "highlight",
    value: function highlight(ref, matched) {
      return this.inner.highlight(ref, matched);
    }
  }, {
    key: "search",
    value: function search(query, options) {
      var _this2 = this;

      if (!query) return []; // lunr/elasticlunr common format

      if (typeof query === 'string') {
        // lunr search/elasticlunr simple search
        if (!options || _typeof(options) !== 'object') {
          return this.elasticsearch({
            'query': {
              'bool': {
                'should': this.inner.getFields().filter(function (field) {
                  return field !== _this2.inner.getRef();
                }).map(function (field) {
                  return {
                    'match': _defineProperty({}, field, query)
                  };
                })
              }
            }
          });
        } // elasticlunr boosted queries


        if (options.fields) {
          return this.elasticsearch({
            'query': {
              'bool': {
                'should': this.inner.getFields().filter(function (field) {
                  return field !== _this2.inner.getRef() && options.fields[field] && options.fields[field].boost > 0;
                }).map(function (field) {
                  return {
                    match: _defineProperty({}, field, query),
                    boost: options.fields[field].boost
                  };
                })
              }
            }
          });
        }
      } // elasticlunr advanced query format


      if (_typeof(query) === 'object' && !query.query) {
        if (!options) {
          return this.search(query, {
            operator: 'OR'
          });
        }

        var search = Object.entries(query);
        return this.elasticsearch({
          'query': {
            'bool': {
              'should': search.map(function (_ref) {
                var _match3;

                var _ref2 = _slicedToArray(_ref, 2),
                    field = _ref2[0],
                    content = _ref2[1];

                return {
                  'match': (_match3 = {}, _defineProperty(_match3, field, content), _defineProperty(_match3, 'operator', options && options.bool && options.bool.toLowerCase() === 'and' ? 'and' : 'or'), _match3),
                  'expand': !!(options && options.expand)
                };
              })
            }
          }
        });
      }

      return this.elasticsearch(query);
    }
  }, {
    key: "updateDoc",
    value: function updateDoc(doc, mute) {
      return this.inner.update([doc], mute);
    }
  }, {
    key: "removeDoc",
    value: function removeDoc(doc, mute) {
      var idField = this.getRef();
      if (!doc || !doc[idField]) return null;
      return this.inner.remove([doc[idField]], mute);
    }
  }, {
    key: "removeDocByRef",
    value: function removeDocByRef(doc, mute) {
      this.inner.remove([doc], mute);
      return;
    }
  }, {
    key: "use",
    value: function use(plugin) {
      var args = Array.prototype.slice.call(arguments, 1);
      args.unshift(this);
      plugin.apply(this, args);
    }
  }, {
    key: "getFields",
    value: function getFields() {
      return this.inner.getFields();
    }
  }, {
    key: "getField",
    value: function getField(field) {
      return this.inner.getField(field);
    }
  }, {
    key: "addField",
    value: function addField(field) {
      return this.inner.addField(field);
    }
  }, {
    key: "field",
    value: function field(_field) {
      return this.addField(_field);
    }
  }]);

  return Converter;
}();

/***/ }),

/***/ "./lib/index/interface.js":
/*!********************************!*\
  !*** ./lib/index/interface.js ***!
  \********************************/
/*! exports provided: Index */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Index", function() { return Index; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Index = /*#__PURE__*/function () {
  function Index() {
    _classCallCheck(this, Index);
  }

  _createClass(Index, [{
    key: "getDocumentStore",
    value:
    /** Individual elements */
    function getDocumentStore() {
      throw Error('getDocumentStore() must be defined');
    }
    /** Index ops */

  }, {
    key: "add",
    value: function add(documents) {
      throw Error('This index does not support adding documents');
    }
  }, {
    key: "remove",
    value: function remove(matcherFn) {
      throw Error('This index does not support removal of documents');
    }
  }, {
    key: "all",
    value: function all() {
      return this.getDocumentStore().all();
    }
  }, {
    key: "getRef",
    value: function getRef() {
      throw Error('getRef must be implemented');
    }
    /** Terms/search */

  }, {
    key: "getFields",
    value: function getFields() {
      throw Error('getFields() must be implemented');
    }
  }, {
    key: "getField",
    value: function getField(fieldName) {
      throw Error('getField() must be implemented');
    }
  }, {
    key: "analyze",
    value: function analyze(field, str) {
      throw Error('The analyze(field, str) method must be implemented. This must return tokens for the given string.');
    }
    /** Query operators */

  }, {
    key: "terms",
    value: function terms(query) {
      throw Error('The terms(query) method must be implemented.');
    }
  }]);

  return Index;
}();

/***/ }),

/***/ "./lib/index/withPosition.js":
/*!***********************************!*\
  !*** ./lib/index/withPosition.js ***!
  \***********************************/
/*! exports provided: Index, Field, Token */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Index", function() { return Index; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Field", function() { return Field; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Token", function() { return Token; });
/* harmony import */ var _interface_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interface.js */ "./lib/index/interface.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * elasticlunr.index.withPosition
 *
 * Copyright (C) Seb Renauld
 */


function levenshteinDistance(a, b) {
  // Create empty edit distance matrix for all possible modifications of
  // substrings of a to substrings of b.
  var distanceMatrix = Array(b.length + 1).fill(null).map(function () {
    return Array(a.length + 1).fill(null);
  }); // Fill the first row of the matrix.
  // If this is first row then we're transforming empty string to a.
  // In this case the number of transformations equals to size of a substring.

  for (var i = 0; i <= a.length; i += 1) {
    distanceMatrix[0][i] = i;
  } // Fill the first column of the matrix.
  // If this is first column then we're transforming empty string to b.
  // In this case the number of transformations equals to size of b substring.


  for (var j = 0; j <= b.length; j += 1) {
    distanceMatrix[j][0] = j;
  }

  for (var _j = 1; _j <= b.length; _j += 1) {
    for (var _i = 1; _i <= a.length; _i += 1) {
      var indicator = a[_i - 1] === b[_j - 1] ? 0 : 1;
      distanceMatrix[_j][_i] = Math.min(distanceMatrix[_j][_i - 1] + 1, // deletion
      distanceMatrix[_j - 1][_i] + 1, // insertion
      distanceMatrix[_j - 1][_i - 1] + indicator // substitution
      );
    }
  }

  return distanceMatrix[b.length][a.length];
}

var union = function union(array1, array2) {
  var _iterator = _createForOfIteratorHelper(array2),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var o = _step.value;
      if (array1.indexOf(o) < 0) array1.push(o);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return array1;
};

var Token = /*#__PURE__*/function () {
  function Token(token, metadata) {
    _classCallCheck(this, Token);

    this.token = token;
    this.metadata = metadata || {};
  }

  _createClass(Token, [{
    key: "update",
    value: function update(fn) {
      var out = fn(this.token, this.metadata);

      if (Array.isArray(out) && out.length === 2) {
        this.token = out[0];
        this.metadata = _objectSpread(_objectSpread({}, this.metadata), out[1]);
        return this;
      }

      this.token = out;
      return this;
    }
  }, {
    key: "getPosition",
    value: function getPosition() {
      if (this.metadata.start && this.metadata.end) return [this.metadata.start, this.metadata.end];
      return null;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.token;
    }
  }, {
    key: "term",
    value: function term() {
      return this.toString();
    }
  }]);

  return Token;
}();

var Field = /*#__PURE__*/function () {
  function Field(options) {
    _classCallCheck(this, Field);

    if (options.pipeline) this.setPipeline(options.pipeline);
    if (options.queryPipeline) this.setQueryPipeline(options.queryPipeline);
    this.storePositions = options.storePositions || false;
    this._terms = {}; // done

    this._documents = {};

    if (options.storeDocuments) {
      this._store = true;
    }

    this._tf = {}; // done

    this._idf = {}; // done

    this._flnorm = 1; // done

    this._ids = []; // done
  }

  _createClass(Field, [{
    key: "termFrequency",
    value: function termFrequency(term) {
      return this._tf[term];
    }
  }, {
    key: "hasToken",
    value: function hasToken(term) {
      return this._idf[term] > 0;
    }
  }, {
    key: "allTokens",
    value: function allTokens() {
      var _this = this;

      return Object.keys(this._terms).map(function (term) {
        return {
          term: term,
          tf: _this._tf[term],
          terms: _this._terms[term],
          idf: _this._idf[term],
          norm: _this._flnorm,
          documents: Object.keys(_this._tf[term] || {})
        };
      });
    }
  }, {
    key: "getToken",
    value: function getToken(term) {
      if (!this._idf[term]) return null;
      return {
        term: term,
        tf: this._tf[term],
        idf: this._idf[term],
        norm: this._flnorm,
        documents: Object.keys(this._tf[term] || {})
      };
    }
  }, {
    key: "setToken",
    value: function setToken(term, documents) {
      var docIdsChanged = [];

      for (var _i2 = 0, _Object$entries = Object.entries(documents); _i2 < _Object$entries.length; _i2++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
            docId = _Object$entries$_i[0],
            options = _Object$entries$_i[1];

        var tf = options.tf;
        var ct = Math.pow(tf, 2);

        if (ct < 1) {
          // Token counts as deleted for this document
          delete this._terms[term][docId];
          delete this._tf[term][docId];
          if (docIdsChanged.indexOf(docId) < 0) docIdsChanged.push(docId);
          continue;
        }

        if (!this._terms[term]) this._terms[term] = {};
        this._terms[term][docId] = {
          positions: options.positions || [],
          total: ct
        };
        if (!this._tf[term]) this._tf[term] = {};
        this._tf[term][docId] = tf;
        if (this._ids.indexOf(docId) < 0) this._ids.push(docId);
      }

      this.recalculateIDF();
    }
  }, {
    key: "highlight",
    value: function highlight(id, highlightPositions) {
      if (!this._documents[id]) throw Error("Document not found: ".concat(id));
      var str = this._documents[id];
      var sortedPositions = highlightPositions.sort(function (a, b) {
        return a[0] - b[0];
      }).reduce(function (current, pos) {
        if (!current.length) {
          current.push(pos);
          return current;
        }

        if (pos[0] > current[current.length - 1][0]) {
          current.push(pos);
          return current;
        }

        if (pos[1] > current[current.length - 1][0]) {
          current[current.length - 1][1] = pos[1];
        }

        return current;
      }, []).sort(function (a, b) {
        return a[0] - b[0];
      });
      return function (startTag, endTag) {
        var components = [];

        for (var i = 0; i < sortedPositions.length; i++) {
          components.push(str.substring(i === 0 ? 0 : sortedPositions[i - 1][1], sortedPositions[i][0]));
          components.push(startTag);
          components.push(str.substring(sortedPositions[i][0], sortedPositions[i][1]));
          components.push(endTag);
        }

        if (sortedPositions.length > 0) {
          components.push(str.substring(sortedPositions[sortedPositions.length - 1][1]));
        }

        return components.join('');
      };
    }
  }, {
    key: "terms",
    value: function terms(query) {
      var _this2 = this;

      var matchingDocs = {};
      var fuzz = query.fuzziness || 0;
      var msm = query.minimum_should_match || 1;
      query.terms.forEach(function (term) {
        if (term instanceof RegExp) {
          var terms = Object.keys(_this2._terms);
          terms.filter(function (idxTerm) {
            return term.test(idxTerm);
          }).map(function (matchedTerm) {
            var ids = Object.keys(_this2._terms[matchedTerm]);
            (query.docs ? ids.filter(function (i) {
              return query.docs.indexOf(i) >= 0;
            }) : ids).forEach(function (i) {
              if (!matchingDocs[i]) matchingDocs[i] = [];
              matchingDocs[i].push({
                ref: i,
                positions: _this2._terms[matchedTerm][i].positions,
                tf: _this2._tf[matchedTerm][i],
                idf: _this2._idf[matchedTerm],
                norm: _this2._flnorm,
                content: _this2._store && _this2._documents[i] ? _this2._documents[i] : null
              });
            });
          });
        } else if (fuzz === 0 && _this2._terms[term]) {
          var ids = Object.keys(_this2._terms[term]);
          (query.docs ? ids.filter(function (i) {
            return query.docs.indexOf(i) >= 0;
          }) : ids).forEach(function (i) {
            if (!matchingDocs[i]) matchingDocs[i] = [];
            matchingDocs[i].push({
              ref: i,
              positions: _this2._terms[term][i].positions,
              tf: _this2._tf[term][i],
              idf: _this2._idf[term],
              norm: _this2._flnorm,
              content: _this2._store && _this2._documents[i] ? _this2._documents[i] : null
            });
          });
        }

        if (fuzz > 0) {
          var _loop = function _loop() {
            var o = _Object$keys[_i3];

            if (levenshteinDistance(o, term) <= fuzz) {
              var _ids = Object.keys(_this2._terms[o]);

              (query.docs ? _ids.filter(function (i) {
                return query.docs.indexOf(i) >= 0;
              }) : _ids).forEach(function (i) {
                if (!matchingDocs[i]) matchingDocs[i] = [];
                matchingDocs[i].push({
                  ref: i,
                  positions: _this2._terms[o][i].positions,
                  tf: _this2._tf[o][i],
                  idf: _this2._idf[o],
                  norm: _this2._flnorm,
                  content: _this2._store && _this2._documents[i] ? _this2._documents[i] : null
                });
              });
            }
          };

          for (var _i3 = 0, _Object$keys = Object.keys(_this2._terms); _i3 < _Object$keys.length; _i3++) {
            _loop();
          }
        }
      });
      if (msm <= 1) return matchingDocs;
      return Object.entries(matchingDocs).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            docId = _ref2[0],
            content = _ref2[1];

        return content.length >= query.minimum_should_match;
      }).reduce(function (current, data) {
        current[data[0]] = data[1];
        return current;
      }, {});
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        pipeline: this.pipeline,
        documents: this._documents,
        store: {
          positions: this.storePositions,
          documents: this._store
        }
      };
    }
  }, {
    key: "all",
    value: function all() {
      return this._ids;
    }
  }, {
    key: "update",
    value: function update(documents) {
      var _this3 = this;

      var toRemove = documents.filter(function (doc) {
        return _this3._ids.indexOf(doc.id) >= 0;
      }).map(function (doc) {
        return doc.id;
      });
      return union(union([], this.remove(toRemove)), this.add(documents));
    }
  }, {
    key: "recalculateIDF",
    value: function recalculateIDF() {
      var _this4 = this;

      this._flnorm = 1 / Math.sqrt(Object.keys(this._terms).length); // Quick calculation so we don't have to do it every time

      Object.keys(this._terms).forEach(function (token) {
        _this4._idf[token] = 1 + Math.log10(_this4._ids.length / (Object.keys(_this4._terms[token]).length + 1));
      });
    }
  }, {
    key: "add",
    value: function add(documents) {
      var _this5 = this;

      var updated = [];

      var _iterator2 = _createForOfIteratorHelper(documents),
          _step2;

      try {
        var _loop2 = function _loop2() {
          var o = _step2.value;
          if (_this5._ids.indexOf(o.id) >= 0) throw Error("Document id ".concat(o.id, " already exists in the index"));
          updated.push(o.id);
          if (_this5._store) _this5._documents[o.id] = o.content;

          _this5._ids.push(o.id);

          var tokens = _this5.pipeline.run(o.content);

          if (!Array.isArray(tokens)) tokens = [tokens];
          tokens.forEach(function (token) {
            if (typeof token === 'string') {
              token = new Token(token);
            }

            var term = token.toString();
            if (!_this5._terms[term]) _this5._terms[term] = {};

            if (!_this5._terms[term][o.id]) {
              _this5._terms[term][o.id] = {
                positions: [],
                total: 0
              };
            }

            if (token instanceof Token) {
              var position = token.getPosition();
              if (position) _this5._terms[term][o.id].positions.push(position);
            }

            _this5._terms[term][o.id].total++;
            if (!_this5._tf[term]) _this5._tf[term] = {};
            _this5._tf[term][o.id] = Math.sqrt(_this5._terms[term][o.id].total);
          });
        };

        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          _loop2();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.recalculateIDF();
      return updated;
    }
  }, {
    key: "remove",
    value: function remove(ids) {
      var _this6 = this;

      var updated = [];
      ids.forEach(function (id) {
        if (_this6._documents[id]) {
          updated.push(id);
        }

        delete _this6._documents[id];

        var inIdPos = _this6._ids.indexOf(id);

        if (inIdPos >= 0) _this6._ids.splice(inIdPos, 1);

        for (var _i4 = 0, _Object$keys2 = Object.keys(_this6._terms); _i4 < _Object$keys2.length; _i4++) {
          var o = _Object$keys2[_i4];

          if (_this6._terms[o][id]) {
            delete _this6._terms[o][id];
            delete _this6._tf[o][id];

            if (Object.keys(_this6._terms[o]).length === 0) {
              delete _this6._terms[o];
              delete _this6._tf[o];
              delete _this6._idf[o];
            }
          }
        }
      });
      this.recalculateIDF();
      return updated;
    }
  }, {
    key: "setPipeline",
    value: function setPipeline(pipeline) {
      this.pipeline = pipeline;
    }
  }, {
    key: "setQueryPipeline",
    value: function setQueryPipeline(pipeline) {
      this.queryPipeline = pipeline;
    }
  }, {
    key: "analyze",
    value: function analyze(str, options) {
      if (options && options.isQuery && this.queryPipeline) return this.queryPipeline.run(str);
      return this.pipeline.run(str);
    }
  }]);

  return Field;
}();

var DocumentStore = /*#__PURE__*/function () {
  function DocumentStore(idx) {
    _classCallCheck(this, DocumentStore);

    this.inner = idx;
    this.length = 0;
  }

  _createClass(DocumentStore, [{
    key: "size",
    value: function size() {
      return this.length;
    }
  }, {
    key: "updateLength",
    value: function updateLength() {
      var _this7 = this;

      this.length = this.inner.getFields().map(function (field) {
        var o = _this7.inner.getField(field)._ids.length;

        return o;
      }).reduce(function (prev, d) {
        return d > prev ? d : prev;
      }, 0);
    }
  }]);

  return DocumentStore;
}();

var Index = /*#__PURE__*/function (_Index) {
  _inherits(Index, _Index);

  var _super = _createSuper(Index);

  function Index(options) {
    var _this8;

    _classCallCheck(this, Index);

    _this8 = _super.call(this, options);
    _this8._fields = options.fields || {};
    _this8._ref = options._ref || 'id';
    _this8.emitter = options.emitter;
    _this8.storePositions = options.storePositions || false;
    _this8.storeDocuments = options.storeDocuments || false;
    _this8._fields[_this8._ref] = new Field({
      pipeline: {
        run: function run(str) {
          return [str];
        }
      }
    });
    _this8.documentStore = new DocumentStore(_assertThisInitialized(_this8));
    _this8.pipeline = options.pipeline;
    return _this8;
  }

  _createClass(Index, [{
    key: "highlight",
    value: function highlight(id, data) {
      var _this9 = this;

      // Pre-compute stuff
      var preComputed = Object.entries(data).filter(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            field = _ref4[0],
            positions = _ref4[1];

        return !!_this9._fields[field];
      }).map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            field = _ref6[0],
            positions = _ref6[1];

        return [field, _this9._fields[field].highlight(id, positions)];
      });
      return function (startTag, endTag) {
        var obj = {};
        preComputed.forEach(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              field = _ref8[0],
              fn = _ref8[1];

          obj[field] = fn(startTag, endTag);
        });
        return obj;
      };
    }
  }, {
    key: "_load",
    value: function _load(idxData) {
      var _this10 = this;

      var fieldMap = []; // Create the fields

      idxData.fields.forEach(function (field) {
        fieldMap.push(field.name);

        _this10.addField(field.name, field.settings || {});

        if (field.settings && field.settings.store && field.settings.store.documents) {
          _this10.getField(field.name)._documents = field.settings.documents;
        }
      });
      Object.entries(idxData.index).forEach(function (_ref9) {
        var _ref10 = _slicedToArray(_ref9, 2),
            term = _ref10[0],
            occurences = _ref10[1];

        occurences.forEach(function (record) {
          var field = fieldMap[record[0]];
          var reconstructed = {};
          Object.entries(record[1].tf).forEach(function (_ref11) {
            var _ref12 = _slicedToArray(_ref11, 2),
                docID = _ref12[0],
                tf = _ref12[1];

            if (!reconstructed[docID]) reconstructed[docID] = {};
            reconstructed[docID].tf = tf;
          });
          Object.entries(record[1].p).forEach(function (_ref13) {
            var _ref14 = _slicedToArray(_ref13, 2),
                docID = _ref14[0],
                info = _ref14[1];

            if (!reconstructed[docID]) reconstructed[docID] = {};
            if (info.positions) reconstructed[docID].positions = info.positions;
          });

          _this10.getField(field).setToken(term, reconstructed);
        });
      });
    }
  }, {
    key: "_legacyLoad",
    value: function _legacyLoad(idxData) {
      var _this11 = this;

      // The "save" flag that we use as storeDocuments is in an awkward place
      var saveDocs = idxData.documentStore.save || false; // Pipeline? Set it in the idx

      if (idxData && idxData.pipeline) {
        this.pipeline = idxData.pipeline;
      } // First, we create the fields


      idxData.fields.forEach(function (field) {
        _this11.addField(field.name, {
          storeDocuments: saveDocs
        });
      });

      if (idxData.ref !== 'id') {
        this.newRef(idxData.ref);
      } // From here, we reimport the TF/IDF for all terms


      var recurseTerm = function recurseTerm(field, rootTerm, settings) {
        var branches = Object.keys(settings);

        for (var _i5 = 0, _branches = branches; _i5 < _branches.length; _i5++) {
          var o = _branches[_i5];
          if (o === 'df') continue;

          if (o === 'docs') {
            for (var _i6 = 0, _Object$entries2 = Object.entries(settings[o]); _i6 < _Object$entries2.length; _i6++) {
              var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i6], 2),
                  records = _Object$entries2$_i[1];

              field.setToken(rootTerm, {
                tf: records.tf
              });
            }

            continue;
          }

          recurseTerm(field, rootTerm + o, settings[o]);
        }
      };

      for (var _i7 = 0, _Object$entries3 = Object.entries(idxData.index); _i7 < _Object$entries3.length; _i7++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i7], 2),
            field = _Object$entries3$_i[0],
            entries = _Object$entries3$_i[1];

        if (!entries.root) continue;
        recurseTerm(this._fields[field], '', entries.root);
      }
    }
  }, {
    key: "getFields",
    value: function getFields() {
      return Object.keys(this._fields);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var fieldRef = [];
      var idxJson = {};
      Object.entries(this._fields).forEach(function (_ref15) {
        var _ref16 = _slicedToArray(_ref15, 2),
            fieldName = _ref16[0],
            field = _ref16[1];

        fieldRef.push({
          name: fieldName,
          settings: field.toJSON()
        });
        var fieldID = fieldRef.length - 1;
        field.allTokens().forEach(function (term) {
          if (!idxJson[term.term]) idxJson[term.term] = [];
          idxJson[term.term].push([fieldID, {
            tf: term.tf,
            idf: term.idf,
            p: term.terms
          }]);
        });
      });
      return {
        fields: fieldRef,
        ref: this._ref,
        index: idxJson,
        pipeline: this.pipeline.toJSON(),
        version: '1.0.0'
      };
    }
  }, {
    key: "getRef",
    value: function getRef() {
      return this._ref;
    }
  }, {
    key: "update",
    value: function update(documents, muteEvent) {
      var _this12 = this;

      var updatedIds = []; // Break down in chunks

      documents.forEach(function (doc) {
        // Get keys
        var id = doc[_this12._ref];
        Object.entries(doc).forEach(function (_ref17) {
          var _ref18 = _slicedToArray(_ref17, 2),
              key = _ref18[0],
              content = _ref18[1];

          if (_this12._fields[key]) {
            updatedIds = union(updatedIds, _this12._fields[key].update([{
              id: id,
              content: content
            }]));
          }
        });
      });

      if (this.emitter && muteEvent !== false) {
        documents.filter(function (doc) {
          return updatedIds.indexOf(doc[_this12._ref]) >= 0;
        }).map(function (doc) {
          return _this12.emitter.emit('update', doc, _this12);
        });
      }

      this.documentStore.updateLength();
      return true;
    }
  }, {
    key: "add",
    value: function add(documents, muteEvent) {
      var _this13 = this;

      var updatedIds = []; // Break down in chunks

      documents.forEach(function (doc) {
        // Get keys
        var id = doc[_this13._ref];
        Object.entries(doc).forEach(function (_ref19) {
          var _ref20 = _slicedToArray(_ref19, 2),
              key = _ref20[0],
              content = _ref20[1];

          if (_this13._fields[key]) {
            updatedIds = union(updatedIds, _this13._fields[key].add([{
              id: id,
              content: content
            }]));
          }
        });
      });

      if (this.emitter && muteEvent !== false) {
        documents.filter(function (doc) {
          return updatedIds.indexOf(doc[_this13._ref]) >= 0;
        }).map(function (doc) {
          return _this13.emitter.emit('add', doc, _this13);
        });
      }

      this.documentStore.updateLength();
      return true;
    }
  }, {
    key: "reindex",
    value: function reindex() {
      /* return this.fields().then((field) => {
              let fObj = this.getField(field);
              fObj.add(Object.values(fObj._documents))
          }); */
    }
  }, {
    key: "remove",
    value: function remove(docIDs, muteEvent) {
      var _this14 = this;

      var updatedIds = Object.values(this._fields).reduce(function (updatedIds, field) {
        return union(updatedIds, field.remove(docIDs));
      }, []);

      if (this.emitter && muteEvent !== false) {
        updatedIds.forEach(function (doc) {
          return _this14.emitter.emit('remove', doc, _this14);
        });
      }

      this.documentStore.updateLength();
      return true;
    }
  }, {
    key: "addField",
    value: function addField(field, options) {
      var fieldOptions = {};
      options = options || {};
      fieldOptions.pipeline = options.pipeline || this.pipeline;
      fieldOptions.storeDocuments = options.storeDocuments || this.storeDocuments;
      fieldOptions.storePositions = true;
      this._fields[field] = new Field(fieldOptions);
      return this;
    }
  }, {
    key: "getField",
    value: function getField(field) {
      return this._fields[field];
    }
  }, {
    key: "removeField",
    value: function removeField(field) {
      delete this._fields[field];
    }
  }, {
    key: "setRef",
    value: function setRef(field) {
      if (!this._fields[field]) {
        throw Error("Unknown field ".concat(field));
      }

      this._ref = field;
      return this.reindex();
    }
  }, {
    key: "newRef",
    value: function newRef(field) {
      this.removeField(this._ref);
      this._fields[field] = new Field({
        pipeline: {
          run: function run(str) {
            return [str];
          }
        }
      });
      this.setRef(field);
    }
  }, {
    key: "all",
    value: function all() {
      return this._fields[this._ref].all();
    }
  }, {
    key: "analyze",
    value: function analyze(field, str, options) {
      return this._fields[field].analyze(str, options);
    }
  }, {
    key: "terms",
    value: function terms(query) {
      return this._fields[query.field].terms(query);
    }
  }]);

  return Index;
}(_interface_js__WEBPACK_IMPORTED_MODULE_0__["Index"]);


/* export default function(elasticlunr) {
    elasticlunr.index.register('1.0.0', function(config) {
        return new Idx(elasticlunr);
    });
}; */

/***/ }),

/***/ "./lib/pipeline.js":
/*!*************************!*\
  !*** ./lib/pipeline.js ***!
  \*************************/
/*! exports provided: pipeline */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pipeline", function() { return pipeline; });
/* !
 * elasticlunr.Pipeline
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

/**
   * elasticlunr.Pipelines maintain an ordered list of functions to be applied to
   * both documents tokens and query tokens.
   *
   * An instance of elasticlunr.Index will contain a pipeline
   * with a trimmer, a stop word filter, an English stemmer. Extra
   * functions can be added before or after either of these functions or these
   * default functions can be removed.
   *
   * When run the pipeline, it will call each function in turn.
   *
   * The output of the functions in the pipeline will be passed to the next function
   * in the pipeline. To exclude a token from entering the index the function
   * should return undefined, the rest of the pipeline will not be called with
   * this token.
   *
   * For serialisation of pipelines to work, all functions used in an instance of
   * a pipeline should be registered with elasticlunr.Pipeline. Registered functions can
   * then be loaded. If trying to load a serialised pipeline that uses functions
   * that are not registered an error will be thrown.
   *
   * If not planning on serialising the pipeline then registering pipeline functions
   * is not necessary.
   *
   * @constructor
   */
function pipeline(elasticlunr) {
  elasticlunr.Pipeline = function () {
    this._queue = [];
  };

  elasticlunr.Pipeline.registeredFunctions = {};
  /**
   * Register a function in the pipeline.
   *
   * Functions that are used in the pipeline should be registered if the pipeline
   * needs to be serialised, or a serialised pipeline needs to be loaded.
   *
   * Registering a function does not add it to a pipeline, functions must still be
   * added to instances of the pipeline for them to be used when running a pipeline.
   *
   * @param {Function} fn The function to register.
   * @param {String} label The label to register this function with
   * @memberOf Pipeline
   */

  elasticlunr.Pipeline.registerFunction = function (fn, label) {
    if (label in elasticlunr.Pipeline.registeredFunctions) {
      elasticlunr.utils.warn('Overwriting existing registered function: ' + label);
    }

    fn.label = label;
    elasticlunr.Pipeline.registeredFunctions[label] = fn;
  };
  /**
   * Get a registered function in the pipeline.
   *
   * @param {String} label The label of registered function.
   * @return {Function}
   * @memberOf Pipeline
   */


  elasticlunr.Pipeline.getRegisteredFunction = function (label) {
    if (label in elasticlunr.Pipeline.registeredFunctions !== true) {
      return null;
    }

    return elasticlunr.Pipeline.registeredFunctions[label];
  };
  /**
   * Warns if the function is not registered as a Pipeline function.
   *
   * @param {Function} fn The function to check for.
   * @private
   * @memberOf Pipeline
   */


  elasticlunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
    var isRegistered = fn.label && fn.label in this.registeredFunctions;

    if (!isRegistered) {
      elasticlunr.utils.warn('Function is not registered with pipeline. ' + 'This may cause problems when serialising the index.\n', fn);
    }
  };
  /**
   * Loads a previously serialised pipeline.
   *
   * All functions to be loaded must already be registered with elasticlunr.Pipeline.
   * If any function from the serialised data has not been registered then an
   * error will be thrown.
   *
   * @param {Object} serialised The serialised pipeline to load.
   * @return {elasticlunr.Pipeline}
   * @memberOf Pipeline
   */


  elasticlunr.Pipeline.load = function (serialised) {
    var pipeline = new elasticlunr.Pipeline();
    serialised.forEach(function (fnName) {
      var fn = elasticlunr.Pipeline.getRegisteredFunction(fnName);

      if (fn) {
        pipeline.add(fn);
      } else {
        throw new Error('Cannot load un-registered function: ' + fnName);
      }
    });
    return pipeline;
  };
  /**
   * Adds new functions to the end of the pipeline.
   *
   * Logs a warning if the function has not been registered.
   *
   * @param {Function} functions Any number of functions to add to the pipeline.
   * @memberOf Pipeline
   */


  elasticlunr.Pipeline.prototype.add = function () {
    var fns = Array.prototype.slice.call(arguments);
    fns.forEach(function (fn) {
      elasticlunr.Pipeline.warnIfFunctionNotRegistered(fn);

      this._queue.push(fn);
    }, this);
  };
  /**
   * Adds a single function after a function that already exists in the
   * pipeline.
   *
   * Logs a warning if the function has not been registered.
   * If existingFn is not found, throw an Exception.
   *
   * @param {Function} existingFn A function that already exists in the pipeline.
   * @param {Function} newFn The new function to add to the pipeline.
   * @memberOf Pipeline
   */


  elasticlunr.Pipeline.prototype.after = function (existingFn, newFn) {
    var pos;
    elasticlunr.Pipeline.warnIfFunctionNotRegistered(newFn);
    pos = this._queue.indexOf(existingFn);

    if (pos === -1) {
      throw new Error('Cannot find existingFn');
    }

    this._queue.splice(pos + 1, 0, newFn);
  };
  /**
   * Adds a single function before a function that already exists in the
   * pipeline.
   *
   * Logs a warning if the function has not been registered.
   * If existingFn is not found, throw an Exception.
   *
   * @param {Function} existingFn A function that already exists in the pipeline.
   * @param {Function} newFn The new function to add to the pipeline.
   * @memberOf Pipeline
   */


  elasticlunr.Pipeline.prototype.before = function (existingFn, newFn) {
    var pos;
    elasticlunr.Pipeline.warnIfFunctionNotRegistered(newFn);
    pos = this._queue.indexOf(existingFn);

    if (pos === -1) {
      throw new Error('Cannot find existingFn');
    }

    this._queue.splice(pos, 0, newFn);
  };
  /**
   * Removes a function from the pipeline.
   *
   * @param {Function} fn The function to remove from the pipeline.
   * @memberOf Pipeline
   */


  elasticlunr.Pipeline.prototype.remove = function (fn) {
    var pos = this._queue.indexOf(fn);

    if (pos === -1) {
      return;
    }

    this._queue.splice(pos, 1);
  };
  /**
   * Runs the current list of functions that registered in the pipeline against the
   * input tokens.
   *
   * @param {Array} tokens The tokens to run through the pipeline.
   * @return {Array}
   * @memberOf Pipeline
   */


  elasticlunr.Pipeline.prototype.run = function (tokens) {
    if (!this._queue.length) {
      return tokens;
    }

    return this._queue.reduce(function (out, queueEntry) {
      return out.reduce(function (state, element, i) {
        var output = queueEntry(element, i, out);
        if (!Array.isArray(output)) output = [output];
        output.filter(function (e) {
          return e !== null && e !== void 0;
        }).forEach(function (item) {
          state.push(item);
        });
        return state;
      }, []).filter(function (e) {
        return e !== '';
      });
    }, tokens);
  };
  /**
   * Resets the pipeline by removing any existing processors.
   *
   * @memberOf Pipeline
   */


  elasticlunr.Pipeline.prototype.reset = function () {
    this._queue = [];
  };
  /**
    * Get the pipeline if user want to check the pipeline.
    *
    * @memberOf Pipeline
    */


  elasticlunr.Pipeline.prototype.get = function () {
    return this._queue;
  };
  /**
   * Returns a representation of the pipeline ready for serialisation.
   * Only serialize pipeline function's name. Not storing function, so when
   * loading the archived JSON index file, corresponding pipeline function is
   * added by registered function of elasticlunr.Pipeline.registeredFunctions
   *
   * Logs a warning if the function has not been registered.
   *
   * @return {Array}
   * @memberOf Pipeline
   */


  elasticlunr.Pipeline.prototype.toJSON = function () {
    return this._queue.map(function (fn) {
      elasticlunr.Pipeline.warnIfFunctionNotRegistered(fn);
      return fn.label;
    });
  };
}
;

/***/ }),

/***/ "./lib/sorted_set.js":
/*!***************************!*\
  !*** ./lib/sorted_set.js ***!
  \***************************/
/*! exports provided: sortedSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortedSet", function() { return sortedSet; });
/**
 * sorted_set.js is added only to make elasticlunr.js compatible with lunr-languages.
 * if elasticlunr.js support different languages by default, this will make elasticlunr.js
 * much bigger that not good for browser usage.
 *
 */

/* !
 * lunr.SortedSet
 * Copyright (C) @YEAR Oliver Nightingale
 */
function sortedSet(lunr) {
  /**
   * lunr.SortedSets are used to maintain an array of uniq values in a sorted
   * order.
   *
   * @constructor
   */
  lunr.SortedSet = function () {
    this.length = 0;
    this.elements = [];
  };
  /**
   * Loads a previously serialised sorted set.
   *
   * @param {Array} serialisedData The serialised set to load.
   * @returns {lunr.SortedSet}
   * @memberOf SortedSet
   */


  lunr.SortedSet.load = function (serialisedData) {
    var set = new this();
    set.elements = serialisedData;
    set.length = serialisedData.length;
    return set;
  };
  /**
   * Inserts new items into the set in the correct position to maintain the
   * order.
   *
   * @param {Object} The objects to add to this set.
   * @memberOf SortedSet
   */


  lunr.SortedSet.prototype.add = function () {
    var i, element;

    for (i = 0; i < arguments.length; i++) {
      element = arguments[i];
      if (~this.indexOf(element)) continue;
      this.elements.splice(this.locationFor(element), 0, element);
    }

    this.length = this.elements.length;
  };
  /**
   * Converts this sorted set into an array.
   *
   * @returns {Array}
   * @memberOf SortedSet
   */


  lunr.SortedSet.prototype.toArray = function () {
    return this.elements.slice();
  };
  /**
   * Creates a new array with the results of calling a provided function on every
   * element in this sorted set.
   *
   * Delegates to Array.prototype.map and has the same signature.
   *
   * @param {Function} fn The function that is called on each element of the
   * set.
   * @param {Object} ctx An optional object that can be used as the context
   * for the function fn.
   * @returns {Array}
   * @memberOf SortedSet
   */


  lunr.SortedSet.prototype.map = function (fn, ctx) {
    return this.elements.map(fn, ctx);
  };
  /**
   * Executes a provided function once per sorted set element.
   *
   * Delegates to Array.prototype.forEach and has the same signature.
   *
   * @param {Function} fn The function that is called on each element of the
   * set.
   * @param {Object} ctx An optional object that can be used as the context
   * @memberOf SortedSet
   * for the function fn.
   */


  lunr.SortedSet.prototype.forEach = function (fn, ctx) {
    return this.elements.forEach(fn, ctx);
  };
  /**
   * Returns the index at which a given element can be found in the
   * sorted set, or -1 if it is not present.
   *
   * @param {Object} elem The object to locate in the sorted set.
   * @returns {Number}
   * @memberOf SortedSet
   */


  lunr.SortedSet.prototype.indexOf = function (elem) {
    var start = 0,
        end = this.elements.length,
        sectionLength = end - start,
        pivot = start + Math.floor(sectionLength / 2),
        pivotElem = this.elements[pivot];

    while (sectionLength > 1) {
      if (pivotElem === elem) return pivot;
      if (pivotElem < elem) start = pivot;
      if (pivotElem > elem) end = pivot;
      sectionLength = end - start;
      pivot = start + Math.floor(sectionLength / 2);
      pivotElem = this.elements[pivot];
    }

    if (pivotElem === elem) return pivot;
    return -1;
  };
  /**
   * Returns the position within the sorted set that an element should be
   * inserted at to maintain the current order of the set.
   *
   * This function assumes that the element to search for does not already exist
   * in the sorted set.
   *
   * @param {Object} elem The elem to find the position for in the set
   * @returns {Number}
   * @memberOf SortedSet
   */


  lunr.SortedSet.prototype.locationFor = function (elem) {
    var start = 0,
        end = this.elements.length,
        sectionLength = end - start,
        pivot = start + Math.floor(sectionLength / 2),
        pivotElem = this.elements[pivot];

    while (sectionLength > 1) {
      if (pivotElem < elem) start = pivot;
      if (pivotElem > elem) end = pivot;
      sectionLength = end - start;
      pivot = start + Math.floor(sectionLength / 2);
      pivotElem = this.elements[pivot];
    }

    if (pivotElem > elem) return pivot;
    return pivot + 1; //    if (pivotElem < elem) return pivot + 1;
  };
  /**
   * Creates a new lunr.SortedSet that contains the elements in the intersection
   * of this set and the passed set.
   *
   * @param {lunr.SortedSet} otherSet The set to intersect with this set.
   * @returns {lunr.SortedSet}
   * @memberOf SortedSet
   */


  lunr.SortedSet.prototype.intersect = function (otherSet) {
    var intersectSet = new lunr.SortedSet(),
        i = 0,
        j = 0,
        aLen = this.length,
        bLen = otherSet.length,
        a = this.elements,
        b = otherSet.elements;

    while (true) {
      if (i > aLen - 1 || j > bLen - 1) break;

      if (a[i] === b[j]) {
        intersectSet.add(a[i]);
        i++;
        j++;
        continue;
      }

      if (a[i] < b[j]) {
        i++;
        continue;
      }

      if (a[i] > b[j]) {
        j++;
        continue;
      }
    }

    ;
    return intersectSet;
  };
  /**
   * Makes a copy of this set
   *
   * @returns {lunr.SortedSet}
   * @memberOf SortedSet
   */


  lunr.SortedSet.prototype.clone = function () {
    var clone = new lunr.SortedSet();
    clone.elements = this.toArray();
    clone.length = clone.elements.length;
    return clone;
  };
  /**
   * Creates a new lunr.SortedSet that contains the elements in the union
   * of this set and the passed set.
   *
   * @param {lunr.SortedSet} otherSet The set to union with this set.
   * @returns {lunr.SortedSet}
   * @memberOf SortedSet
   */


  lunr.SortedSet.prototype.union = function (otherSet) {
    var longSet, shortSet, unionSet, i, shortSetElements;

    if (this.length >= otherSet.length) {
      longSet = this;
      shortSet = otherSet;
    } else {
      longSet = otherSet;
      shortSet = this;
    }

    unionSet = longSet.clone();

    for (i = 0, shortSetElements = shortSet.toArray(); i < shortSetElements.length; i++) {
      unionSet.add(shortSetElements[i]);
    }

    return unionSet;
  };
  /**
   * Returns a representation of the sorted set ready for serialisation.
   *
   * @returns {Array}
   * @memberOf SortedSet
   */


  lunr.SortedSet.prototype.toJSON = function () {
    return this.toArray();
  };
}
;

/***/ }),

/***/ "./lib/stemmer.js":
/*!************************!*\
  !*** ./lib/stemmer.js ***!
  \************************/
/*! exports provided: stemmer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stemmer", function() { return stemmer; });
/* !
 * elasticlunr.stemmer
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * elasticlunr.stemmer is an english language stemmer, this is a JavaScript
 * implementation of the PorterStemmer taken from http://tartarus.org/~martin
 *
 * @module
 * @param {String} str The string to stem
 * @return {String}
 * @see elasticlunr.Pipeline
 */
function stemmer(elasticlunr) {
  elasticlunr.stemmer = function () {
    var step2list = {
      'ational': 'ate',
      'tional': 'tion',
      'enci': 'ence',
      'anci': 'ance',
      'izer': 'ize',
      'bli': 'ble',
      'alli': 'al',
      'entli': 'ent',
      'eli': 'e',
      'ousli': 'ous',
      'ization': 'ize',
      'ation': 'ate',
      'ator': 'ate',
      'alism': 'al',
      'iveness': 'ive',
      'fulness': 'ful',
      'ousness': 'ous',
      'aliti': 'al',
      'iviti': 'ive',
      'biliti': 'ble',
      'logi': 'log'
    },
        step3list = {
      'icate': 'ic',
      'ative': '',
      'alize': 'al',
      'iciti': 'ic',
      'ical': 'ic',
      'ful': '',
      'ness': ''
    },
        c = '[^aeiou]',
        // consonant
    v = '[aeiouy]',
        // vowel
    C = c + '[^aeiouy]*',
        // consonant sequence
    V = v + '[aeiou]*',
        // vowel sequence
    mgr0 = '^(' + C + ')?' + V + C,
        // [C]VC... is m>0
    meq1 = '^(' + C + ')?' + V + C + '(' + V + ')?$',
        // [C]VC[V] is m=1
    mgr1 = '^(' + C + ')?' + V + C + V + C,
        // [C]VCVC... is m>1
    s_v = '^(' + C + ')?' + v; // vowel in stem

    var re_mgr0 = new RegExp(mgr0);
    var re_mgr1 = new RegExp(mgr1);
    var re_meq1 = new RegExp(meq1);
    var re_s_v = new RegExp(s_v);
    var re_1a = /^(.+?)(ss|i)es$/;
    var re2_1a = /^(.+?)([^s])s$/;
    var re_1b = /^(.+?)eed$/;
    var re2_1b = /^(.+?)(ed|ing)$/;
    var re_1b_2 = /.$/;
    var re2_1b_2 = /(at|bl|iz)$/;
    var re3_1b_2 = new RegExp('([^aeiouylsz])\\1$');
    var re4_1b_2 = new RegExp('^' + C + v + '[^aeiouwxy]$');
    var re_1c = /^(.+?[^aeiou])y$/;
    var re_2 = new RegExp('^(.+?)(' + Object.keys(step2list).join('|') + ')$');
    var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
    var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
    var re2_4 = /^(.+?)(s|t)(ion)$/;
    var re_5 = /^(.+?)e$/;
    var re_5_1 = /ll$/;
    var re3_5 = new RegExp('^' + C + v + '[^aeiouwxy]$');

    var porterStemmer = function porterStemmer(token) {
      var w = token.toString();
      var stem, suffix, firstch, re, re2, re3, re4, fp;

      if (w.length < 3) {
        return w;
      }

      firstch = w.substr(0, 1);

      if (firstch === 'y') {
        w = firstch.toUpperCase() + w.substr(1);
      } // Step 1a


      re = re_1a;
      re2 = re2_1a;

      if (re.test(w)) {
        w = w.replace(re, '$1$2');
      } else if (re2.test(w)) {
        w = w.replace(re2, '$1$2');
      } // Step 1b


      re = re_1b;
      re2 = re2_1b;

      if (re.test(w)) {
        fp = re.exec(w);
        re = re_mgr0;

        if (re.test(fp[1])) {
          re = re_1b_2;
          w = w.replace(re, '');
        }
      } else if (re2.test(w)) {
        fp = re2.exec(w);
        stem = fp[1];
        re2 = re_s_v;

        if (re2.test(stem)) {
          w = stem;
          re2 = re2_1b_2;
          re3 = re3_1b_2;
          re4 = re4_1b_2;

          if (re2.test(w)) {
            w = w + 'e';
          } else if (re3.test(w)) {
            re = re_1b_2;
            w = w.replace(re, '');
          } else if (re4.test(w)) {
            w = w + 'e';
          }
        }
      } // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is
      // not the first letter of the word (so cry -> cri, by -> by, say -> say)


      re = re_1c;

      if (re.test(w)) {
        fp = re.exec(w);
        stem = fp[1];
        w = stem + 'i';
      } // Step 2


      re = re_2;

      if (re.test(w)) {
        fp = re.exec(w);
        stem = fp[1];
        suffix = fp[2];
        re = re_mgr0;

        if (re.test(stem)) {
          w = stem + step2list[suffix];
        }
      } // Step 3


      re = re_3;

      if (re.test(w)) {
        fp = re.exec(w);
        stem = fp[1];
        suffix = fp[2];
        re = re_mgr0;

        if (re.test(stem)) {
          w = stem + step3list[suffix];
        }
      } // Step 4


      re = re_4;
      re2 = re2_4;

      if (re.test(w)) {
        fp = re.exec(w);
        stem = fp[1];
        re = re_mgr1;

        if (re.test(stem)) {
          w = stem;
        }
      } else if (re2.test(w)) {
        fp = re2.exec(w);
        stem = fp[1] + fp[2];
        re2 = re_mgr1;

        if (re2.test(stem)) {
          w = stem;
        }
      } // Step 5


      re = re_5;

      if (re.test(w)) {
        fp = re.exec(w);
        stem = fp[1];
        re = re_mgr1;
        re2 = re_meq1;
        re3 = re3_5;

        if (re.test(stem) || re2.test(stem) && !re3.test(stem)) {
          w = stem;
        }
      }

      re = re_5_1;
      re2 = re_mgr1;

      if (re.test(w) && re2.test(w)) {
        re = re_1b_2;
        w = w.replace(re, '');
      } // and turn initial Y back to y


      if (firstch === 'y') {
        w = firstch.toLowerCase() + w.substr(1);
      }

      return token.update(function (i) {
        return w;
      });
    };

    return porterStemmer;
  }();

  elasticlunr.Pipeline.registerFunction(elasticlunr.stemmer, 'stemmer');
}
;

/***/ }),

/***/ "./lib/stop_word_filter.js":
/*!*********************************!*\
  !*** ./lib/stop_word_filter.js ***!
  \*********************************/
/*! exports provided: stopWordFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stopWordFilter", function() { return stopWordFilter; });
/* !
 * elasticlunr.stopWordFilter
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

/**
 * elasticlunr.stopWordFilter is an English language stop words filter, any words
 * contained in the stop word list will not be passed through the filter.
 *
 * This is intended to be used in the Pipeline. If the token does not pass the
 * filter then undefined will be returned.
 * Currently this StopwordFilter using dictionary to do O(1) time complexity stop word filtering.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @return {String}
 * @see elasticlunr.Pipeline
 */
function stopWordFilter(elasticlunr) {
  elasticlunr.generateStopWordFilter = function (stopWords) {
    var words = stopWords.reduce(function (memo, stopWord) {
      memo[stopWord] = stopWord;
      return memo;
    }, {});
    return function (token) {
      if (token && words[token.toString()] !== token.toString()) return token;
      return null;
    };
  };

  elasticlunr.stopWordFilter = function (token) {
    if (token && elasticlunr.stopWordFilter.stopWords[token] !== true) {
      return token;
    }

    return null;
  };
  /**
   * Remove predefined stop words
   * if user want to use customized stop words, user could use this function to delete
   * all predefined stopwords.
   *
   * @return {null}
   */


  elasticlunr.clearStopWords = function () {
    elasticlunr.stopWordFilter.stopWords = {};
  };
  /**
   * Add customized stop words
   * user could use this function to add customized stop words
   *
   * @params {Array} words customized stop words
   * @return {null}
   */


  elasticlunr.addStopWords = function (words) {
    if (words == null || Array.isArray(words) === false) return;
    words.forEach(function (word) {
      elasticlunr.stopWordFilter.stopWords[word] = true;
    }, this);
  };
  /**
   * Reset to default stop words
   * user could use this function to restore default stop words
   *
   * @return {null}
   */


  elasticlunr.resetStopWords = function () {
    elasticlunr.stopWordFilter.stopWords = elasticlunr.defaultStopWords;
  };

  elasticlunr.defaultStopWords = {
    '': true,
    'a': true,
    'able': true,
    'about': true,
    'across': true,
    'after': true,
    'all': true,
    'almost': true,
    'also': true,
    'am': true,
    'among': true,
    'an': true,
    'and': true,
    'any': true,
    'are': true,
    'as': true,
    'at': true,
    'be': true,
    'because': true,
    'been': true,
    'but': true,
    'by': true,
    'can': true,
    'cannot': true,
    'could': true,
    'dear': true,
    'did': true,
    'do': true,
    'does': true,
    'either': true,
    'else': true,
    'ever': true,
    'every': true,
    'for': true,
    'from': true,
    'get': true,
    'got': true,
    'had': true,
    'has': true,
    'have': true,
    'he': true,
    'her': true,
    'hers': true,
    'him': true,
    'his': true,
    'how': true,
    'however': true,
    'i': true,
    'if': true,
    'in': true,
    'into': true,
    'is': true,
    'it': true,
    'its': true,
    'just': true,
    'least': true,
    'let': true,
    'like': true,
    'likely': true,
    'may': true,
    'me': true,
    'might': true,
    'most': true,
    'must': true,
    'my': true,
    'neither': true,
    'no': true,
    'nor': true,
    'not': true,
    'of': true,
    'off': true,
    'often': true,
    'on': true,
    'only': true,
    'or': true,
    'other': true,
    'our': true,
    'own': true,
    'rather': true,
    'said': true,
    'say': true,
    'says': true,
    'she': true,
    'should': true,
    'since': true,
    'so': true,
    'some': true,
    'than': true,
    'that': true,
    'the': true,
    'their': true,
    'them': true,
    'then': true,
    'there': true,
    'these': true,
    'they': true,
    'this': true,
    'tis': true,
    'to': true,
    'too': true,
    'twas': true,
    'us': true,
    'wants': true,
    'was': true,
    'we': true,
    'were': true,
    'what': true,
    'when': true,
    'where': true,
    'which': true,
    'while': true,
    'who': true,
    'whom': true,
    'why': true,
    'will': true,
    'with': true,
    'would': true,
    'yet': true,
    'you': true,
    'your': true
  };
  elasticlunr.stopWordFilter.stopWords = elasticlunr.defaultStopWords;
  return elasticlunr.Pipeline.registerFunction(elasticlunr.stopWordFilter, 'stopWordFilter');
}
;

/***/ }),

/***/ "./lib/tokenizer.js":
/*!**************************!*\
  !*** ./lib/tokenizer.js ***!
  \**************************/
/*! exports provided: tokenizer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tokenizer", function() { return tokenizer; });
/* harmony import */ var _index_withPosition_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index/withPosition.js */ "./lib/index/withPosition.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }


/* !
 * elasticlunr.tokenizer
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

function tokenizer(elasticlunr) {
  var _split = function _split(str) {
    var tokens = [],
        lastIndex = 0,
        newIndex;
    str = str.toString();
    elasticlunr.tokenizer.seperator.lastIndex = 0;

    while (lastIndex < str.length) {
      newIndex = elasticlunr.tokenizer.seperator.exec(str); // No match

      if (!newIndex) {
        tokens.push(new _index_withPosition_js__WEBPACK_IMPORTED_MODULE_0__["Token"](str.substring(lastIndex).trim().toLowerCase(), {
          start: lastIndex,
          end: str.length
        }));
        break;
      }

      if (newIndex.index > lastIndex) {
        tokens.push(new _index_withPosition_js__WEBPACK_IMPORTED_MODULE_0__["Token"](str.substring(lastIndex, newIndex.index).trim().toLowerCase(), {
          start: lastIndex,
          end: newIndex.index
        }));
      }

      lastIndex = newIndex.index + newIndex[0].length;
    }

    return tokens; // str.toString().trim().toLowerCase().split(elasticlunr.tokenizer.seperator)
  };
  /**
   * A function for splitting a string into tokens.
   * Currently English is supported as default.
   * Uses `elasticlunr.tokenizer.seperator` to split strings, you could change
   * the value of this property to set how you want strings are split into tokens.
   * IMPORTANT: use elasticlunr.tokenizer.seperator carefully, if you are not familiar with
   * text process, then you'd better not change it.
   *
   * @module
   * @param {String} str The string that you want to tokenize.
   * @see elasticlunr.tokenizer.seperator
   * @return {Array}
   */


  elasticlunr.tokenizer = function (str) {
    if (!str) return [];

    if (Array.isArray(str)) {
      throw Error('This operation does not make sense');
    }

    return _split(str);
  };
  /**
   * Default string seperator.
   */


  elasticlunr.tokenizer.defaultSeperator = /[\s\-]+/g;
  /**
   * The sperator used to split a string into tokens. Override this property to change the behaviour of
   * `elasticlunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
   *
   * @static
   * @see elasticlunr.tokenizer
   */

  elasticlunr.tokenizer.seperator = elasticlunr.tokenizer.defaultSeperator;
  /**
   * Set up customized string seperator
   *
   * @param {Object} sep The customized seperator that you want to use to tokenize a string.
   */

  elasticlunr.tokenizer.setSeperator = function (sep) {
    if (sep !== null && sep !== undefined && _typeof(sep) === 'object') {
      elasticlunr.tokenizer.seperator = sep;
    }
  };
  /**
   * Reset string seperator
   *
   */


  elasticlunr.tokenizer.resetSeperator = function () {
    elasticlunr.tokenizer.seperator = elasticlunr.tokenizer.defaultSeperator;
  };
  /**
   * Get string seperator
   *
   */


  elasticlunr.tokenizer.getSeperator = function () {
    return elasticlunr.tokenizer.seperator;
  };
}
;

/***/ }),

/***/ "./lib/trimmer.js":
/*!************************!*\
  !*** ./lib/trimmer.js ***!
  \************************/
/*! exports provided: trimmer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trimmer", function() { return trimmer; });
/* !
 * elasticlunr.trimmer
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

/**
 * elasticlunr.trimmer is a pipeline function for trimming non word
 * characters from the begining and end of tokens before they
 * enter the index.
 *
 * This implementation may not work correctly for non latin
 * characters and should either be removed or adapted for use
 * with languages with non-latin characters.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @return {String}
 * @see elasticlunr.Pipeline
 */
function trimmer(elasticlunr) {
  elasticlunr.trimmer = function (_token) {
    var token = _token.toString();

    if (token === null || token === undefined) {
      throw new Error('token should not be undefined');
    }

    return _token.update(function (word) {
      return word.replace(/^\W+/, '').replace(/\W+$/, '');
    });
  };

  elasticlunr.Pipeline.registerFunction(elasticlunr.trimmer, 'trimmer');
}
;

/***/ }),

/***/ "./lib/utils.js":
/*!**********************!*\
  !*** ./lib/utils.js ***!
  \**********************/
/*! exports provided: utils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "utils", function() { return utils; });
/* !
 * elasticlunr.utils
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */
function utils(elasticlunr) {
  /**
   * A namespace containing utils for the rest of the elasticlunr library
   */
  elasticlunr.utils = {};
  /**
   * Print a warning message to the console.
   *
   * @param {String} message The message to be printed.
   * @memberOf Utils
   */

  elasticlunr.utils.warn = function (global) {
    return function (message) {
      if (global && global.console && global.console.warn) {
        global.console.warn(message);
      }
    };
  }(this);
  /**
   * Convert an object to string.
   *
   * In the case of `null` and `undefined` the function returns
   * an empty string, in all other cases the result of calling
   * `toString` on the passed object is returned.
   *
   * @param {object} obj The object to convert to a string.
   * @return {String} string representation of the passed object.
   * @memberOf Utils
   */


  elasticlunr.utils.toString = function (obj) {
    if (obj === void 0 || obj === null) {
      return '';
    }

    return obj.toString();
  };
}
;

/***/ })

/******/ });
});