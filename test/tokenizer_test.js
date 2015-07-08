module('elasticlunr.tokenizer')

test("splitting simple strings into tokens", function () {
  var simpleString = "this is a simple string",
      tokens = elasticlunr.tokenizer(simpleString)

  deepEqual(tokens, ['this', 'is', 'a', 'simple', 'string'])
})

test('downcasing tokens', function () {
  var simpleString = 'FOO BAR',
      tags = ['Foo', 'BAR']

  deepEqual(elasticlunr.tokenizer(simpleString), ['foo', 'bar'])
  deepEqual(elasticlunr.tokenizer(tags), ['foo', 'bar'])
})

test('handling arrays', function () {
  var tags = ['foo', 'bar'],
      tokens = elasticlunr.tokenizer(tags)

  deepEqual(tokens, tags)
})

test('handling multiple white spaces', function () {
  var testString = '  foo    bar  ',
      tokens = elasticlunr.tokenizer(testString)

  deepEqual(tokens, ['foo', 'bar'])
})

test('handling null-like arguments', function () {
  deepEqual(elasticlunr.tokenizer(), [])
  deepEqual(elasticlunr.tokenizer(null), [])
  deepEqual(elasticlunr.tokenizer(undefined), [])
})

test('calling to string on passed val', function () {
  var date = new Date (Date.UTC(2013, 0, 1, 12)),
      obj = {
        toString: function () { return 'custom object' }
      }

  equal(elasticlunr.tokenizer(41), '41')
  equal(elasticlunr.tokenizer(false), 'false')
  deepEqual(elasticlunr.tokenizer(obj), ['custom', 'object'])

  // slicing here to avoid asserting on the timezone part of the date
  // that will be different whereever the test is run.
  deepEqual(elasticlunr.tokenizer(date).slice(0, 4), ['tue', 'jan', '01', '2013'])
})

test("splitting strings with hyphens", function () {
  var simpleString = "take the New York-San Francisco flight",
      tokens = elasticlunr.tokenizer(simpleString)

  deepEqual(tokens, ['take', 'the', 'new', 'york', 'san', 'francisco', 'flight'])
})

test("splitting strings with hyphens and spaces", function () {
  var simpleString = "Solve for A - B",
      tokens = elasticlunr.tokenizer(simpleString)

  deepEqual(tokens, ['solve', 'for', 'a', 'b'])
})
