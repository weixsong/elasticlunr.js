var elasticlunr = require("../lib/elasticlunr.js"),
    assert = require("assert");

var util = require("util");
describe('serialization', function() {
  var corpus = [{
    id: 'a',
    title: 'Mr. Green kills Colonel Mustard',
    body: 'Mr. Green killed Colonel Mustard in the study with the candlestick. Mr. Green is not a very nice fellow.'
  },{
    id: 'b',
    title: 'Plumb waters plant',
    body: 'Professor Plumb has a green plant in his study'
  },{
    id: 'c',
    title: 'Scarlett helps Professor',
    body: 'Miss Scarlett watered Professor Plumbs green plant while he was away from his office last week.'
  }];

  it('should serialize and deserialize an index successfully', function() {
    var idx = new elasticlunr.Index;

    idx.addField('title');
    idx.addField('body');

    corpus.forEach(function (doc) { 
      idx.addDoc(doc);
    });
  
    var dumpedIdx = JSON.stringify(idx),
        clonedIdx = elasticlunr.Index.load(JSON.parse(dumpedIdx));
    //    assert.deepEqual(idx.inner._fields.title, clonedIdx.inner._fields.title);
   //     assert.deepEqual(idx.inner._fields.body, clonedIdx.inner._fields.body);
    assert.deepEqual(idx.search('green plant'), clonedIdx.search('green plant'));
  });

  it('should serialize and deserialize indexes with pipelines defined', function() {
    var idx = elasticlunr(function () {
      this.addField('title');
      this.addField('body');
    });
  
    corpus.forEach(function (doc) { idx.addDoc(doc) });
  
    var dumpedIdx = JSON.stringify(idx),
        clonedIdx = elasticlunr.Index.load(JSON.parse(dumpedIdx));
    assert.deepEqual(idx.pipeline._stack, clonedIdx.pipeline._stack);
    assert.deepEqual(idx.search('water'), clonedIdx.search('water'));
  })
});
