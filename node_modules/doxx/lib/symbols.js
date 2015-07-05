"use strict";

var _ = require('lodash');

/**
 * Return the structure of a parsed file
 * @param  {Array} symbols  array of symbols
 * @param  {String} file    filename
 * @return {Array}
 */
function structure(symbols, file){
  return _.compact(symbols.map(function(method){
    if (!method.ctx || !method.ctx.name){return null;}
    return {
      targetFile:file,
      name:method.ctx.name,
      type:method.ctx.type
    };
  })) || [];
}

/**
 * Exports
 *
 * @ignore
 */
module.exports = structure;
