var elasticlunr = require("../lib/elasticlunr.js"),
    assert = require("assert");

describe('elasticlunr.trimmer', function() {
  it('should pass through latin characters', function() {
    var token = 'hello';
    assert.equal(elasticlunr.trimmer(token), token);
  });

  it('should remove leading and trailing punctuation', function() {
    var fullStop = 'hello.',
     innerApostrophe = "it's",
      trailingApostrophe = "james'",
      exclamationMark = 'stop!',
      comma = 'first,',
      empty = '',
      brackets = '[tag]',
      moreBrackets = '[[[tag]]]',
      combined1 = '[[!@#@!hello]]]}}}',
      combined2 = '~!@@@hello***()()()]]';

    assert.deepEqual(elasticlunr.trimmer(fullStop), 'hello');
    assert.deepEqual(elasticlunr.trimmer(innerApostrophe), "it's");
    assert.deepEqual(elasticlunr.trimmer(trailingApostrophe), "james");
    assert.deepEqual(elasticlunr.trimmer(exclamationMark), 'stop');
    assert.deepEqual(elasticlunr.trimmer(comma), 'first');
    assert.deepEqual(elasticlunr.trimmer(empty), '');
    assert.deepEqual(elasticlunr.trimmer(brackets), 'tag');
    assert.deepEqual(elasticlunr.trimmer(moreBrackets), 'tag');
    assert.deepEqual(elasticlunr.trimmer(combined1), 'hello');
    assert.deepEqual(elasticlunr.trimmer(combined2), 'hello');
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

return;
module('elasticlunr.trimmer');

test('latin characters', function () {
  var token = 'hello';
  equal(elasticlunr.trimmer(token), token);
});

test('removing leading and trailing punctuation', function () {
  var fullStop = 'hello.',
      innerApostrophe = "it's",
      trailingApostrophe = "james'",
      exclamationMark = 'stop!',
      comma = 'first,',
      empty = '',
      brackets = '[tag]',
      moreBrackets = '[[[tag]]]',
      combined1 = '[[!@#@!hello]]]}}}',
      combined2 = '~!@@@hello***()()()]]';

  deepEqual(elasticlunr.trimmer(fullStop), 'hello');
  deepEqual(elasticlunr.trimmer(innerApostrophe), "it's");
  deepEqual(elasticlunr.trimmer(trailingApostrophe), "james");
  deepEqual(elasticlunr.trimmer(exclamationMark), 'stop');
  deepEqual(elasticlunr.trimmer(comma), 'first');
  deepEqual(elasticlunr.trimmer(empty), '');
  deepEqual(elasticlunr.trimmer(brackets), 'tag');
  deepEqual(elasticlunr.trimmer(moreBrackets), 'tag');
  deepEqual(elasticlunr.trimmer(combined1), 'hello');
  deepEqual(elasticlunr.trimmer(combined2), 'hello');
});

test('should be registered with elasticlunr.Pipeline', function () {
  equal(elasticlunr.trimmer.label, 'trimmer');
  deepEqual(elasticlunr.Pipeline.getRegisteredFunction('trimmer'), elasticlunr.trimmer);
});

test('test null input to trimmer', function () {
  var token = null;
  throws(function () {
    elasticlunr.trimmer(token);
  });

  token = undefined;
  throws(function () {
    elasticlunr.trimmer(token);
  });

  token = void 0;
  throws(function () {
    elasticlunr.trimmer(token);
  });
});
