var elasticlunr = require("../lib/elasticlunr.js"),
    assert = require("assert");

    import { Token } from '../lib/index/withPosition.js';

describe('elasticlunr.trimmer', function() {
  it('should pass through latin characters', function() {
    var token = new Token('hello');
    assert.equal(elasticlunr.trimmer(token), token);
  });

  it('should remove leading and trailing punctuation', function() {
    var fullStop = new Token('hello.'),
     innerApostrophe = new Token("it's"),
      trailingApostrophe = new Token("james'"),
      exclamationMark = new Token('stop!'),
      comma = new Token('first,'),
      empty = new Token(''),
      brackets = new Token('[tag]'),
      moreBrackets = new Token('[[[tag]]]'),
      combined1 = new Token('[[!@#@!hello]]]}}}'),
      combined2 = new Token('~!@@@hello***()()()]]');

    assert.deepEqual(elasticlunr.trimmer(fullStop).toString(), 'hello');
    assert.deepEqual(elasticlunr.trimmer(innerApostrophe).toString(), "it's");
    assert.deepEqual(elasticlunr.trimmer(trailingApostrophe).toString(), "james");
    assert.deepEqual(elasticlunr.trimmer(exclamationMark).toString(), 'stop');
    assert.deepEqual(elasticlunr.trimmer(comma).toString(), 'first');
    assert.deepEqual(elasticlunr.trimmer(empty).toString(), '');
    assert.deepEqual(elasticlunr.trimmer(brackets).toString(), 'tag');
    assert.deepEqual(elasticlunr.trimmer(moreBrackets).toString(), 'tag');
    assert.deepEqual(elasticlunr.trimmer(combined1).toString(), 'hello');
    assert.deepEqual(elasticlunr.trimmer(combined2).toString(), 'hello');
  });

  it('should be registered with elasticlunr.Pipeline', function () {
    assert.equal(elasticlunr.trimmer.label, 'trimmer');
    assert.deepEqual(elasticlunr.Pipeline.getRegisteredFunction('trimmer'), elasticlunr.trimmer);
  });
  
  it('test null input to trimmer', function () {
    var token = null;
    assert.throws(function () {
      elasticlunr.trimmer(token);
    });
  
    token = undefined;
    assert.throws(function () {
      elasticlunr.trimmer(token);
    });
  
    token = void 0;
    assert.throws(function () {
      elasticlunr.trimmer(token);
    });
  });
})