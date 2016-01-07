/*!
 * elasticlunr.tokenizer
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

/**
 * A function for splitting a string into tokens.
 * Currently English is support as default.
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
elasticlunr.tokenizer = function (obj) {
  if (!arguments.length || obj == null || obj == undefined) return [];
  if (Array.isArray(obj)) {
    return obj.map(function (t) {
      return elasticlunr.utils.toString(t).toLowerCase();
    });
  }

  return obj.toString().trim().toLowerCase().split(elasticlunr.tokenizer.seperator);
};

/**
 * The sperator used to split a string into tokens. Override this property to change the behaviour of
 * `elasticlunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see elasticlunr.tokenizer
 */
elasticlunr.tokenizer.seperator = /[\s\-]+/
