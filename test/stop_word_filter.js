var elasticlunr = require("../lib/elasticlunr.js"),
    assert = require("assert");

describe('elasticlunr.stopWordFilter', function() {
  afterEach(function() {
    elasticlunr.resetStopWords();
  });

  it('should be registered as a default element of the pipeline', function() {
    assert.equal(elasticlunr.stopWordFilter.label, 'stopWordFilter');
    assert.deepEqual(elasticlunr.Pipeline.getRegisteredFunction('stopWordFilter'), elasticlunr.stopWordFilter);
  })

  it('should remove stop words', function() {
    var stopWords = ['the', 'and', 'but', 'than', 'when'];
    stopWords.forEach(function(word) {
      assert.equal(elasticlunr.stopWordFilter(word), undefined);
    });
    ['interesting', 'words', 'pass', 'through'].forEach(function(word) {
      assert.equal(elasticlunr.stopWordFilter(word), word);
    })
  });

  it('should not filter Object.prototype terms', function() {
    ['constructor', 'hasOwnProperty', 'toString', 'valueOf'].forEach(function(word) {
      assert.equal(elasticlunr.stopWordFilter(word), word);
    })
  });

  it('should allow the user to modify, clear and add stop words', function() {
    assert.deepEqual(elasticlunr.stopWordFilter.stopWords, elasticlunr.defaultStopWords);
    var stopWords = ['the', 'and', 'but', 'than', 'when'];

    var tempStopWords = {};
    stopWords.forEach(function(word) {
      tempStopWords[word] = true;
    });

    elasticlunr.clearStopWords();
    elasticlunr.addStopWords(stopWords);
    assert.deepEqual(elasticlunr.stopWordFilter.stopWords, tempStopWords);

    var stopWords = ['hello', 'world', 'microsoft', 'TTS'];
    var nonStopWords = ['interesting', 'words', 'pass', 'through'];
  
    elasticlunr.addStopWords(stopWords);
  
    nonStopWords.forEach(function (word) {
      assert.equal(elasticlunr.stopWordFilter(word), word);
    });
    assert.equal(elasticlunr.stopWordFilter(undefined), undefined);
    assert.equal(elasticlunr.stopWordFilter(null), undefined);
  })
})