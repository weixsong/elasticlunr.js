"use strict";

var jade = require('jade'),
  fs     = require('fs'),
  path   = require('path'),
  _      = require('lodash');


/**
 * Compile
 * @param  {Object} locals local variable object
 * @jsFiddle http://jsfiddle.net/4L6Br/embedded/
 * @return {String} rendered content
 */
function compile(locals) {
  return jade.compile(compile.tpl, {
    pretty: true,
    filename: compile.tplFileName
  })(locals);
}


/**
 * Jade support for filter `:code`
 * @param  {String} block
 * @return {String}
 */
jade.filters.code = function( block ) {
 return block.replace( /&/g, '&amp;'  )
  .replace( /</g, '&lt;'   )
  .replace( />/g, '&gt;'   )
  .replace( /"/g, '&quot;' )
  .replace( /#/g, '&#35;'  )
  .replace( /\\/g, '\\\\'  )
  .replace( /\n/g, '\\n'   );
};


/**
 * Template used to produce the documentation
 * @type {String} template string
 */
compile.tpl = fs.readFileSync(path.resolve(__dirname, '../views/template.jade')).toString();

module.exports = compile;
