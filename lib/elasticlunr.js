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

var elasticlunr = function (config) {
  var idx = elasticlunr.Index();

  idx.pipeline.add(
    elasticlunr.trimmer,
    elasticlunr.stopWordFilter,
    elasticlunr.stemmer
  );

  if (config) config.call(idx, idx);

  return idx;
};
var lunr = elasticlunr;

import {utils} from './utils.js';
import {index} from './index.js';
import {configuration} from './configuration.js';
import {eventEmitter} from './event_emitter.js';
import {pipeline} from './pipeline.js';
import {documentStore} from './document_store.js';
import {sortedSet} from './sorted_set.js';
import {tokenizer} from './tokenizer.js';
import {stemmer} from './stemmer.js';
import {stopWordFilter} from './stop_word_filter.js';
import {trimmer} from './trimmer.js';

[
  utils,
  index,
  configuration,
  eventEmitter,
  pipeline,
  documentStore,
  sortedSet,
  tokenizer,
  stemmer,
  stopWordFilter,
  trimmer
].forEach(function (module) {
  module(elasticlunr);
});

elasticlunr.version = __VERSION__;

// only used this to make elasticlunr.js compatible with lunr-languages
// this is a trick to define a global alias of elasticlunr

export {elasticlunr, lunr};
