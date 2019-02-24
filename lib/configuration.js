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
module.exports = function (elasticlunr) {
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
            boost: (fieldConfig.boost || fieldConfig.boost === 0) ? fieldConfig.boost : 1,
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
};
