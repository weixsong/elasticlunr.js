var elasticlunr = require("../lib/elasticlunr.js");
var lunrStemmer = require("../node_modules/lunr-languages/lunr.stemmer.support.js")(elasticlunr);
var lunrFR = require("../node_modules/lunr-languages/lunr.fr.js")(elasticlunr);
var util = require("util");

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
        })
        console.log(util.inspect(idx, false, null, true));
    })
})