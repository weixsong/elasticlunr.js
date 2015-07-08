module('elasticlunr')

test('returns a new instance of elasticlunr.Index', function () {
  var index = elasticlunr()

  equal(index.constructor, elasticlunr.Index)
})

test('should set up the pipeline', function () {
  var index = elasticlunr(),
      stack = index.pipeline._stack

  equal(stack.length, 3)
  equal(stack.indexOf(elasticlunr.trimmer), 0)
  equal(stack.indexOf(elasticlunr.stopWordFilter), 1)
  equal(stack.indexOf(elasticlunr.stemmer), 2)
})

test('passing a config fn which is called with the new index', function () {
  var configCtx, configArg

  var index = elasticlunr(function (idx) {
    configCtx = this
    configArg = idx

    this.ref('cid')

    this.field('title', 10)
    this.field('body')
  })

  equal(configCtx, index)
  equal(configArg, index)

  equal(index._ref, 'cid')
  equal(index._fields.length, 2)
})
