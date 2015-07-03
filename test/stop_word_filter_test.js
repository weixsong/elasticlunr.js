module('elasticlunr.stopWordFilter')

test('stops stop words', function () {
  var stopWords = ['the', 'and', 'but', 'than', 'when']

  stopWords.forEach(function (word) {
    equal(elasticlunr.stopWordFilter(word), undefined)
  })
})

test('non stop words pass through', function () {
  var nonStopWords = ['interesting', 'words', 'pass', 'through']

  nonStopWords.forEach(function (word) {
    equal(elasticlunr.stopWordFilter(word), word)
  })
})

test('should be registered with elasticlunr.Pipeline', function () {
  equal(elasticlunr.stopWordFilter.label, 'stopWordFilter')
  deepEqual(elasticlunr.Pipeline.registeredFunctions['stopWordFilter'], elasticlunr.stopWordFilter)
})
