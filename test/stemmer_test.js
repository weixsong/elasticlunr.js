module('elasticlunr.stemmer')

test('should stem words correctly', function () {
  Object.keys(stemmingFixture).forEach(function (testWord) {
    var expected = stemmingFixture[testWord]

    equal(elasticlunr.stemmer(testWord), expected)
  })
})

test('should be registered with elasticlunr.Pipeline', function () {
  equal(elasticlunr.stemmer.label, 'stemmer')
  deepEqual(elasticlunr.Pipeline.registeredFunctions['stemmer'], elasticlunr.stemmer)
})
