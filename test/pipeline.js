var elasticlunr = require("../lib/elasticlunr.js"),
    assert = require("assert");

    var sinon = require("sinon");
var $ = {
  noop: function() { }
};
describe('elasticlunr.Pipeline', function() {
  var out = null;
  var _pipeline = function() {
    return out;
  };
  var existingRegisteredFunctions = [];
  var existingWarnIfFunctionNotRegistered = null;

  beforeEach(function() {
    out = new elasticlunr.Pipeline;
    existingRegisteredFunctions = elasticlunr.Pipeline.registeredFunctions;
    elasticlunr.Pipeline.registeredFunctions = {};
  
    existingWarnIfFunctionNotRegistered = elasticlunr.Pipeline.warnIfFunctionNotRegistered;
    elasticlunr.Pipeline.warnIfFunctionNotRegistered = $.noop;
  });
  afterEach(function() {
    elasticlunr.Pipeline.registeredFunctions = existingRegisteredFunctions;
    elasticlunr.Pipeline.warnIfFunctionNotRegistered = existingWarnIfFunctionNotRegistered;

  });
  it("adding a new item to the pipeline", function () {
    var pipeline = _pipeline();
    assert.equal(pipeline._queue.length, 0);

    pipeline.add($.noop);
    assert.equal(pipeline._queue.length, 1);
  });

  it('should warn when overwriting existing elements', function() {
    var oldwarn = elasticlunr.utils.warn;
    var spy = sinon.spy();
    elasticlunr.utils.warn = spy;

    var pipeline = _pipeline();
    var fn = $.noop;

    elasticlunr.Pipeline.registerFunction(fn, 'test');
    elasticlunr.Pipeline.registerFunction(fn, 'test');
    assert.ok(spy.calledOnce);
    elasticlunr.utils.warn = oldwarn;
  })
  it('should warn when adding unregistered functions', function() {
    var oldwarn = elasticlunr.utils.warn;
    var spy = sinon.spy();
    elasticlunr.utils.warn = spy;

    var pipeline = _pipeline();
    var fn = function() {};
    
    elasticlunr.Pipeline.registeredFunctions = existingRegisteredFunctions;
    existingWarnIfFunctionNotRegistered(fn);
    assert.ok(spy.calledOnce);
    elasticlunr.utils.warn = oldwarn;
  });
  it("adding multiple items to the pipeline in one go", function () {
    var pipeline = _pipeline();

    pipeline.add($.noop, $.noop);
    assert.equal(pipeline._queue.length, 2);
  });

  it("removing an item from the pipeline", function () {
    var pipeline = _pipeline(),
      fn = $.noop;

    pipeline.add(fn);
    assert.equal(pipeline._queue.length, 1);

    pipeline.remove(fn);
    assert.equal(pipeline._queue.length, 0);
  });

  it("removing a nonexistent item from the pipeline", function () {
    var pipeline = _pipeline(),
      fn1 = $.noop,
      fn2 = function () {};

    pipeline.add(fn1);
    assert.equal(pipeline._queue.length, 1);

    pipeline.remove(fn2);
    assert.equal(pipeline._queue.length, 1);
});

  it("adding an item to the pipeline before another item", function () {
    var pipeline = _pipeline(),
      fn1 = $.noop,
      fn2 = function () {};

    pipeline.add(fn1);
    pipeline.before(fn1, fn2);

    assert.deepEqual(pipeline._queue, [fn2, fn1]);
  });

  it("adding an item to the pipeline before nonexistent item", function () {
    var pipeline = _pipeline(),
      fn1 = $.noop,
      fn2 = function () {},
      fn3 = function () {};

    pipeline.add(fn1, fn2);

    assert.throws(function () {
      pipeline.before(fn3, fn1);
    });

    assert.deepEqual(pipeline._queue, [fn1, fn2]);
  });

  it("adding an item to the pipeline after another item", function () {
    var pipeline = _pipeline(),
      fn1 = $.noop,
      fn2 = function () {},
      fn3 = function () {};

    pipeline.add(fn1, fn2);
    pipeline.after(fn1, fn3);

    assert.deepEqual(pipeline._queue, [fn1, fn3, fn2]);
  });

  it("adding an item to the pipeline after existent item", function () {
    var pipeline = _pipeline(),
      fn1 = $.noop,
      fn2 = function () {},
      fn3 = function () {};

    pipeline.add(fn1, fn2);
    pipeline.after(fn2, fn3);

    assert.deepEqual(pipeline._queue, [fn1, fn2, fn3]);
  });

  it("run calls each member of the pipeline for each input", function () {
    var pipeline = _pipeline(),
      count1 = 0, count2 = 0,
      fn1 = function (token) { count1++ ; return token },
      fn2 = function (token) { count2++ ; return token };

    pipeline.add(fn1, fn2);
    pipeline.run([1,2,3]);

    assert.equal(count1, 3);
    assert.equal(count2, 3);
  });

  it("run should pass three inputs to the pipeline fn", function () {
    var pipeline = _pipeline(),
      input, index, arr,
      fn1 = function () { input = arguments[0], index = arguments[1], arr = arguments[2] };

    pipeline.add(fn1);
    pipeline.run(['a']);

    assert.equal(input, 'a');
    assert.equal(index, 0);
    assert.deepEqual(arr, ['a']);
  });

  it("run should pass the output of one into the input of the next", function () {
    var pipeline = _pipeline(),
      output,
      fn1 = function (t1) { return t1.toUpperCase(); },
      fn2 = function (t2) { output = t2 };

    pipeline.add(fn1);
    pipeline.add(fn2);
    pipeline.run(['a']);

    assert.equal(output, 'A');
  });

  it("run should return the result of running the entire pipeline on each element", function () {
    var pipeline = _pipeline(),
      fn1 = function (t1) { return t1.toUpperCase(); };

    pipeline.add(fn1);

    assert.deepEqual(pipeline.run(['a']), ['A']);
  });

  it("run should filter out any undefined values at each stage in the pipeline", function () {
    var pipeline = _pipeline(),
      fn2Count = 0,
      fn1 = function (t) { if (t < 5) return t; },
      fn2 = function (t) { fn2Count++ ; return t; };

    pipeline.add(fn1, fn2);
    var output = pipeline.run([0,1,2,3,4,5,6,7,8,9]);

    assert.equal(fn2Count, 5);
    assert.equal(output.length, 5);
  });

  it("run should allow a pipeline step to split a token into multiple tokens", function() {
    var pipeline = _pipeline(),
      splitter = function(t) { return t.split("-"); };
    pipeline.add(splitter);

    var output = pipeline.run(['t-h-i-s']);
    assert.deepEqual(output, ['t', 'h', 'i', 's']);
  });
  it('toJSON', function () {
    var pipeline = _pipeline(),
      fn1 = function () {},
      fn2 = function () {};

    elasticlunr.Pipeline.registerFunction(fn1, 'fn1');
    elasticlunr.Pipeline.registerFunction(fn2, 'fn2');

    pipeline.add(fn1, fn2);

    assert.deepEqual(pipeline.toJSON(), ['fn1', 'fn2']);
  });

  it('test get empty pipeline', function () {
    var pipeline = _pipeline();

    assert.deepEqual(pipeline.get(), []);
  });

  it('test get pipeline', function () {
    var pipeline = _pipeline(),
      fn1 = function () {},
      fn2 = function () {};

    elasticlunr.Pipeline.registerFunction(fn1, 'fn1');
    elasticlunr.Pipeline.registerFunction(fn2, 'fn2');

    pipeline.add(fn1, fn2);

    assert.deepEqual(pipeline.get(), [fn1, fn2]);
  });

  it('registering a pipeline function', function () {
    var fn1 = function () {};
    _pipeline();
    assert.equal(Object.keys(elasticlunr.Pipeline.registeredFunctions).length, 0);
    elasticlunr.Pipeline.registerFunction(fn1, 'fn1');

    assert.equal(fn1.label, 'fn1');
    assert.equal(Object.keys(elasticlunr.Pipeline.registeredFunctions).length, 1);
    assert.deepEqual(elasticlunr.Pipeline.registeredFunctions['fn1'], fn1);
  });

  it('test getRegisteredFunction', function () {
    var pipeline = _pipeline(),
      fn1 = function () {},
      fn2 = function () {};

    elasticlunr.Pipeline.registerFunction(fn1, 'fn1');
    elasticlunr.Pipeline.registerFunction(fn2, 'fn2');

    assert.equal(elasticlunr.Pipeline.getRegisteredFunction('non-exist'), null);
    assert.equal(elasticlunr.Pipeline.getRegisteredFunction(null), null);
    assert.equal(elasticlunr.Pipeline.getRegisteredFunction(undefined), null);
    assert.deepEqual(elasticlunr.Pipeline.getRegisteredFunction('fn1'), fn1);
    assert.deepEqual(elasticlunr.Pipeline.getRegisteredFunction('fn2'), fn2);
  });

  it('load', function () {
    _pipeline();
    var fn1 = function () {},
      fn2 = function () {};

    elasticlunr.Pipeline.registerFunction(fn1, 'fn1');
    elasticlunr.Pipeline.registerFunction(fn2, 'fn2');

    var serialised = ['fn1', 'fn2'];

    var pipeline = elasticlunr.Pipeline.load(serialised);

    assert.equal(pipeline._queue.length, 2);
    assert.deepEqual(pipeline._queue[0], fn1);
    assert.deepEqual(pipeline._queue[1], fn2);
  });

  it('loading an un-registered pipeline function', function () {
    var serialised = ['fn1'];

    elasticlunr.Pipeline.registeredFunctions = {};
    assert.throws(function () {
      elasticlunr.Pipeline.load(serialised);
    });
  });

  it('resetting the pipeline', function () {
    var fn1 = function () {},
      fn2 = function () {},
      pipeline = _pipeline();

    pipeline.add(fn1, fn2);
    assert.deepEqual(pipeline._queue, [fn1, fn2]);

    pipeline.reset();
    assert.deepEqual(pipeline._queue, []);
  });
});