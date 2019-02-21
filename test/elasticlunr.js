const elasticlunr = require("../lib/elasticlunr.js");
const assert = require("assert");

describe('General elasticlunr functions', function() {
  it('should return a new index', function() {
    var index = elasticlunr();
    assert.equal(index.constructor, elasticlunr.Index);
  });
  it('should set up a pipeline', function() {
    var index = elasticlunr(),
    queue = index.pipeline._queue;

    assert.equal(queue.length, 3);
    assert.equal(queue.indexOf(elasticlunr.trimmer), 0);
    assert.equal(queue.indexOf(elasticlunr.stopWordFilter), 1);
    assert.equal(queue.indexOf(elasticlunr.stemmer), 2);
  });
  it('should initialize an index with the provided closure called on it', function() {
    var configCtx, configArg;

    var index = elasticlunr(function (idx) {
      configCtx = this;
      configArg = idx;
  
      this.setRef('cid');
  
      this.addField('title');
      this.addField('body');
    });
  
    assert.equal(configCtx, index);
    assert.equal(configArg, index);
  
    assert.equal(index._ref, 'cid');
    assert.equal(index._fields.length, 2);
  });
});