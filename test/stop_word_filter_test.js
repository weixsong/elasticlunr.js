module('elasticlunr.stopWordFilter');

test('stops stop words', function () {
  var stopWords = ['the', 'and', 'but', 'than', 'when'];

  stopWords.forEach(function (word) {
    equal(elasticlunr.stopWordFilter(word), undefined);
  });
});

test('non stop words pass through', function () {
  var nonStopWords = ['interesting', 'words', 'pass', 'through'];

  nonStopWords.forEach(function (word) {
    equal(elasticlunr.stopWordFilter(word), word);
  });
});

test('should not filter Object.prototype terms', function () {
  var nonStopWords = ['constructor', 'hasOwnProperty', 'toString', 'valueOf'];

  nonStopWords.forEach(function (word) {
    equal(elasticlunr.stopWordFilter(word), word);
  });
});

test('should be registered with elasticlunr.Pipeline', function () {
  equal(elasticlunr.stopWordFilter.label, 'stopWordFilter');
  deepEqual(elasticlunr.Pipeline.registeredFunctions['stopWordFilter'], elasticlunr.stopWordFilter);
});

test('test default stop words', function () {
  deepEqual(elasticlunr.stopWordFilter.stopWords, elasticlunr.defaultStopWords);
});

test('test clear stop words by elasticlunr.clearStopWords', function () {
  elasticlunr.clearStopWords();
  deepEqual(elasticlunr.stopWordFilter.stopWords, {});
});

test('test add customized stop words by elasticlunr.addStopWords', function () {
  var stopWords = ['the', 'and', 'but', 'than', 'when'];

  var tempStopWords = {};
  stopWords.forEach(function(word) {
    tempStopWords[word] = true;
  }, this);

  elasticlunr.clearStopWords();
  elasticlunr.addStopWords(stopWords);
  deepEqual(elasticlunr.stopWordFilter.stopWords, tempStopWords);
});
