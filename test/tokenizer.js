var elasticlunr = require("../lib/elasticlunr.js"),
    assert = require("assert");

describe('elasticlunr.tokenizer', function() {
  afterEach(function() {
    elasticlunr.tokenizer.resetSeperator();
  })

  it('should split simple strings into tokens', function() {
    assert.deepEqual(elasticlunr.tokenizer('this is a simple string'), ['this', 'is', 'a', 'simple', 'string']);
  })

  it('should downcast tokens', function() {
    var simpleString = 'FOO BAR',
    tags = ['Foo', 'BAR'];

    assert.deepEqual(elasticlunr.tokenizer(simpleString), ['foo', 'bar']);
    assert.deepEqual(elasticlunr.tokenizer(tags), ['foo', 'bar']);
  })

  it('should handle arrays of strings', function() {
    assert.deepEqual(elasticlunr.tokenizer(['foo', 'bar']), ['foo', 'bar']);
  })

  it('should remove undefined or null values from arrays', function() {
    assert.deepEqual(elasticlunr.tokenizer(['foo', null, undefined, 'bar']), ['foo', 'bar'])
  })

  it('should remove multiple whitespace', function() {
    var testString = '  foo    bar  ',
    tokens = elasticlunr.tokenizer(testString);

    assert.deepEqual(tokens, ['foo', 'bar']);
  });

  it('should handle null-like arguments', function() {
    assert.deepEqual(elasticlunr.tokenizer(), []);
    assert.deepEqual(elasticlunr.tokenizer(null), []);
    assert.deepEqual(elasticlunr.tokenizer(undefined), []);
  })

  it('calls toString on arguments', function() {
    var date = new Date (Date.UTC(2013, 0, 1, 12)),
    obj = {
      toString: function () { return 'custom object' }
    };

    assert.equal(elasticlunr.tokenizer(41), '41');
    assert.equal(elasticlunr.tokenizer(false), 'false');
    assert.deepEqual(elasticlunr.tokenizer(obj), ['custom', 'object']);

// slicing here to avoid asserting on the timezone part of the date
// that will be different whereever the test is run.
    assert.deepEqual(elasticlunr.tokenizer(date).slice(0, 4), ['tue', 'jan', '01', '2013']);
  });

  it("splits strings with hyphens", function () {
    var simpleString = "take the New York-San Francisco flight",
        tokens = elasticlunr.tokenizer(simpleString);
  
    assert.deepEqual(tokens, ['take', 'the', 'new', 'york', 'san', 'francisco', 'flight']);
  });
  
  it("splits strings with hyphens and spaces", function () {
    var simpleString = "Solve for A - B",
        tokens = elasticlunr.tokenizer(simpleString);
  
    assert.deepEqual(tokens, ['solve', 'for', 'a', 'b']);
  });
  
  it("test with customized seperator", function () {
    var sep = /[\/]+/;
    var s = 'hello/world/I/love';
  
    var sep2 = /[\\]+/;
    var s2 = 'hello\\world\\I\\love';
  
    var sep3 = /[\/\%]+/;
    var s3 = 'hello/world/%%%apple%pie';
  
    elasticlunr.tokenizer.setSeperator(sep);
    assert.deepEqual(elasticlunr.tokenizer(s), ['hello', 'world', 'i', 'love']);
  
    elasticlunr.tokenizer.setSeperator(sep2);
    assert.deepEqual(elasticlunr.tokenizer(s2), ['hello', 'world', 'i', 'love']);
  
    elasticlunr.tokenizer.setSeperator(sep3);
    assert.deepEqual(elasticlunr.tokenizer(s3), ['hello', 'world', 'apple', 'pie']);
  });
  
  it("test reset seperator", function () {
    var sep = /[\/]+/;
    var s = 'hello world I love apple';
  
    elasticlunr.tokenizer.setSeperator(sep);
    elasticlunr.tokenizer.resetSeperator()
    assert.deepEqual(elasticlunr.tokenizer(s), ['hello', 'world', 'i', 'love', 'apple']);
  });
  
  it("test get seperator function", function () {
    var sep = /[\/]+/;
  
    elasticlunr.tokenizer.setSeperator(sep);
    assert.deepEqual(elasticlunr.tokenizer.getSeperator(), sep);
  
    elasticlunr.tokenizer.resetSeperator();
    assert.deepEqual(elasticlunr.tokenizer.getSeperator(), elasticlunr.tokenizer.defaultSeperator);
  
    var sep2= /[*]+/;
    elasticlunr.tokenizer.setSeperator(sep2);
    assert.deepEqual(elasticlunr.tokenizer.getSeperator(), sep2);
  });
  
  it("tokenize array", function () {
    var str = ['hello world', 'glad to see you'];
    var tokens = elasticlunr.tokenizer(str);
    assert.deepEqual(tokens, ['hello', 'world', 'glad', 'to', 'see', 'you']);
  });
  
  it("tokenize array 2", function () {
    var str = ['helloworld', 'glad to see you'];
    var tokens = elasticlunr.tokenizer(str);
    assert.deepEqual(tokens, ['helloworld', 'glad', 'to', 'see', 'you']);
  });
  
  it("tokenize array", function () {
    var str = ['helloworld', null, undefined, 'glad to see you'];
    var tokens = elasticlunr.tokenizer(str);
    assert.deepEqual(tokens, ['helloworld', 'glad', 'to', 'see', 'you']);
  });
  
  it("tokenize array", function () {
    var str = ['helloworld', 'glad to see you', 'hyper-parameters'];
    var tokens = elasticlunr.tokenizer(str);
    assert.deepEqual(tokens, ['helloworld', 'glad', 'to', 'see', 'you', 'hyper', 'parameters']);
  });
})

return;
module('elasticlunr.tokenizer', {
  teardown: function () {
    elasticlunr.tokenizer.resetSeperator();
  }
});

test("splitting simple strings into tokens", function () {
  var simpleString = "this is a simple string",
      tokens = elasticlunr.tokenizer(simpleString);

  deepEqual(tokens, ['this', 'is', 'a', 'simple', 'string']);
});

test('downcasing tokens', function () {
  var simpleString = 'FOO BAR',
      tags = ['Foo', 'BAR'];

  deepEqual(elasticlunr.tokenizer(simpleString), ['foo', 'bar']);
  deepEqual(elasticlunr.tokenizer(tags), ['foo', 'bar']);
});

test('handling arrays of strings', function () {
  var tags = ['foo', 'bar'],
      tokens = elasticlunr.tokenizer(tags);

  deepEqual(tokens, tags);
});

test('handling arrays with undefined or null values', function () {
  var arr = ['foo', undefined, null, 'bar'],
      tokens = elasticlunr.tokenizer(arr);

  deepEqual(tokens, ['foo', 'bar']);
});

test('handling multiple white spaces', function () {
  var testString = '  foo    bar  ',
      tokens = elasticlunr.tokenizer(testString);

  deepEqual(tokens, ['foo', 'bar']);
});

test('handling null-like arguments', function () {
  deepEqual(elasticlunr.tokenizer(), []);
  deepEqual(elasticlunr.tokenizer(null), []);
  deepEqual(elasticlunr.tokenizer(undefined), []);
});

test('calling to string on passed val', function () {
  var date = new Date (Date.UTC(2013, 0, 1, 12)),
      obj = {
        toString: function () { return 'custom object' }
      };

  equal(elasticlunr.tokenizer(41), '41');
  equal(elasticlunr.tokenizer(false), 'false');
  deepEqual(elasticlunr.tokenizer(obj), ['custom', 'object']);

  // slicing here to avoid asserting on the timezone part of the date
  // that will be different whereever the test is run.
  deepEqual(elasticlunr.tokenizer(date).slice(0, 4), ['tue', 'jan', '01', '2013']);
});

test("splitting strings with hyphens", function () {
  var simpleString = "take the New York-San Francisco flight",
      tokens = elasticlunr.tokenizer(simpleString);

  deepEqual(tokens, ['take', 'the', 'new', 'york', 'san', 'francisco', 'flight']);
});

test("splitting strings with hyphens and spaces", function () {
  var simpleString = "Solve for A - B",
      tokens = elasticlunr.tokenizer(simpleString);

  deepEqual(tokens, ['solve', 'for', 'a', 'b']);
});

test("test with customized seperator", function () {
  var sep = /[\/]+/;
  var s = 'hello/world/I/love';

  var sep2 = /[\\]+/;
  var s2 = 'hello\\world\\I\\love';

  var sep3 = /[\/\%]+/;
  var s3 = 'hello/world/%%%apple%pie';

  elasticlunr.tokenizer.setSeperator(sep);
  deepEqual(elasticlunr.tokenizer(s), ['hello', 'world', 'i', 'love']);

  elasticlunr.tokenizer.setSeperator(sep2);
  deepEqual(elasticlunr.tokenizer(s2), ['hello', 'world', 'i', 'love']);

  elasticlunr.tokenizer.setSeperator(sep3);
  deepEqual(elasticlunr.tokenizer(s3), ['hello', 'world', 'apple', 'pie']);
});

test("test reset seperator", function () {
  var sep = /[\/]+/;
  var s = 'hello world I love apple';

  elasticlunr.tokenizer.setSeperator(sep);
  elasticlunr.tokenizer.resetSeperator()
  deepEqual(elasticlunr.tokenizer(s), ['hello', 'world', 'i', 'love', 'apple']);
});

test("test get seperator function", function () {
  var sep = /[\/]+/;

  elasticlunr.tokenizer.setSeperator(sep);
  deepEqual(elasticlunr.tokenizer.getSeperator(), sep);

  elasticlunr.tokenizer.resetSeperator();
  deepEqual(elasticlunr.tokenizer.getSeperator(), elasticlunr.tokenizer.defaultSeperator);

  var sep2= /[*]+/;
  elasticlunr.tokenizer.setSeperator(sep2);
  deepEqual(elasticlunr.tokenizer.getSeperator(), sep2);
});

test("tokenize array", function () {
  var str = ['hello world', 'glad to see you'];
  var tokens = elasticlunr.tokenizer(str);
  deepEqual(tokens, ['hello', 'world', 'glad', 'to', 'see', 'you']);
});

test("tokenize array 2", function () {
  var str = ['helloworld', 'glad to see you'];
  var tokens = elasticlunr.tokenizer(str);
  deepEqual(tokens, ['helloworld', 'glad', 'to', 'see', 'you']);
});

test("tokenize array", function () {
  var str = ['helloworld', null, undefined, 'glad to see you'];
  var tokens = elasticlunr.tokenizer(str);
  deepEqual(tokens, ['helloworld', 'glad', 'to', 'see', 'you']);
});

test("tokenize array", function () {
  var str = ['helloworld', 'glad to see you', 'hyper-parameters'];
  var tokens = elasticlunr.tokenizer(str);
  deepEqual(tokens, ['helloworld', 'glad', 'to', 'see', 'you', 'hyper', 'parameters']);
});
