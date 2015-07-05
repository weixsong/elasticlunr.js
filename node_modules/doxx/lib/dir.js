"use strict";

var fs     = require('fs'),
    path   = require('path'),
    path   = require('path'),
    mkdirp = require('mkdirp'),
    walkdir = require('walkdir'),
    _      = require('lodash');

/**
 * Create an array of all the right files in the source dir
 * @param  {String}   source source path
 * @param  {Object}   options option object
 * @return {Array}
 */
function collectFiles(source, options) {
  var dirtyFiles = walkdir.sync(source), // tee hee!
      ignore     = options.ignore || [],
      files      = [];

  dirtyFiles.forEach(function(file){
    file = path.relative(source, file);

    var doNotIgnore = _.all(ignore, function(d){
      // return true if no part of the path is in the ignore list
      return (file.indexOf(d) === -1);
    });

    if ((file.substr(-2) === 'js') && doNotIgnore) {
      files.push(file);
    }
  });

  return files;
}

/**
 * Exports
 *
 * @ignore
 */
exports.collectFiles = collectFiles;
