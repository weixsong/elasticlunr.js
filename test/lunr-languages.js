var elasticlunr = require("../lib/elasticlunr.js");
require("../node_modules/lunr-languages/lunr.stemmer.support.js")(elasticlunr);
require("../node_modules/lunr-languages/lunr.fr.js")(elasticlunr);
var util = require("util");
var assert = require("assert");

describe('lunr-languages', () => {
    it('Allows the usage of the package', () => {
        var idx = elasticlunr(function() {
            this.use(elasticlunr.fr);
            this.field('body');
            this.add({
                id: 1,
                body: 'Ce document consiste d\'un petit paragraphe en francais afin de tester lunr-languages'
            });
            this.add({
                id: 2,
                body: 'Some english to make sure it works'
            });
        });
        assert.deepEqual(idx.inner.pipeline._queue.map((r) => r.label), ['trimmer-fr', 'stopWordFilter-fr', 'stemmer-fr']);
        var results = idx.search('document');
        assert.deepEqual(results.map((r) => r.ref), [1]);
    })
})