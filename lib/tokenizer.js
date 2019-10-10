import { Token } from './index/withPosition.js';
/* !
 * elasticlunr.tokenizer
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

export default function (elasticlunr) {
  var _split = function (str) {
    var tokens = [],
      lastIndex = 0, newIndex;

    str = str.toString();

    elasticlunr.tokenizer.seperator.lastIndex = 0;
    while (lastIndex < str.length) {
      newIndex = elasticlunr.tokenizer.seperator.exec(str);
      // No match
      if (!newIndex) {
        tokens.push(new Token(str.substring(lastIndex).trim().toLowerCase(), {
          start: lastIndex,
          end: str.length
        }));
        break;
      }
      if (newIndex.index > lastIndex) {
        tokens.push(new Token(
          str.substring(lastIndex, newIndex.index).trim().toLowerCase(),
          {
            start: lastIndex,
            end: newIndex.index
          }
        ));
      }
      lastIndex = newIndex.index + newIndex[0].length;
    }
    return tokens;
    // str.toString().trim().toLowerCase().split(elasticlunr.tokenizer.seperator)
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
    if (sep !== null && sep !== undefined && typeof (sep) === 'object') {
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
};
