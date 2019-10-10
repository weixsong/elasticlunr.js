const elasticlunr = require("../lib/elasticlunr.js"),
      assert = require("assert");

import { Token } from '../lib/index/withPosition.js';

var stemmingFixture = {
        "consign": "consign",
        "consigned": "consign",
        "consigning": "consign",
        "consignment": "consign",
        "consist": "consist",
        "consisted": "consist",
        "consistency": "consist",
        "consistent": "consist",
        "consistently": "consist",
        "consisting": "consist",
        "consists": "consist",
        "consolation": "consol",
        "consolations": "consol",
        "consolatory": "consolatori",
        "console": "consol",
        "consoled": "consol",
        "consoles": "consol",
        "consolidate": "consolid",
        "consolidated": "consolid",
        "consolidating": "consolid",
        "consoling": "consol",
        "consols": "consol",
        "consonant": "conson",
        "consort": "consort",
        "consorted": "consort",
        "consorting": "consort",
        "conspicuous": "conspicu",
        "conspicuously": "conspicu",
        "conspiracy": "conspiraci",
        "conspirator": "conspir",
        "conspirators": "conspir",
        "conspire": "conspir",
        "conspired": "conspir",
        "conspiring": "conspir",
        "constable": "constabl",
        "constables": "constabl",
        "constance": "constanc",
        "constancy": "constanc",
        "constant": "constant",
        "knack": "knack",
        "knackeries": "knackeri",
        "knacks": "knack",
        "knag": "knag",
        "knave": "knave",
        "knaves": "knave",
        "knavish": "knavish",
        "kneaded": "knead",
        "kneading": "knead",
        "knee": "knee",
        "kneel": "kneel",
        "kneeled": "kneel",
        "kneeling": "kneel",
        "kneels": "kneel",
        "knees": "knee",
        "knell": "knell",
        "knelt": "knelt",
        "knew": "knew",
        "knick": "knick",
        "knif": "knif",
        "knife": "knife",
        "knight": "knight",
        "knights": "knight",
        "knit": "knit",
        "knits": "knit",
        "knitted": "knit",
        "knitting": "knit",
        "knives": "knive",
        "knob": "knob",
        "knobs": "knob",
        "knock": "knock",
        "knocked": "knock",
        "knocker": "knocker",
        "knockers": "knocker",
        "knocking": "knock",
        "knocks": "knock",
        "knopp": "knopp",
        "knot": "knot",
        "knots": "knot",
        "lay": "lay",
        "try": "tri"
      };
      
describe('elasticlunr.stemmer', function() {
  it('should stem words correctly', function() {
    Object.keys(stemmingFixture).forEach(function(word) {
      assert.equal(elasticlunr.stemmer(new Token(word)), stemmingFixture[word]);
    });
  });
  it('should be registered with elasticlunr.Pipeline as default', function() {
    assert.equal(elasticlunr.stemmer.label, 'stemmer');
    assert.deepEqual(elasticlunr.Pipeline.getRegisteredFunction('stemmer'), elasticlunr.stemmer);
  })
})