/*!
 * elasticlunr.tokenizer
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

/**
 * A function for splitting a string into tokens.
 * Currently English is support as default.
 *
 * @module
 * @param {String} str The string that you want to tokenize.
 * @return {Array}
 */
elasticlunr.tokenizer = function (obj) {
  if (!arguments.length || obj == null || obj == undefined) return [];
  if (Array.isArray(obj)) {
    return obj.map(function (t) {
      return elasticlunr.utils.toString(t).toLowerCase();
    });
  }

  return obj.toString().trim().toLowerCase().split(/[\s\-]+/);
};

