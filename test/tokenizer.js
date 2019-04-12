var elasticlunr = require("../lib/elasticlunr.js"),
    assert = require("assert");

describe('elasticlunr.tokenizer', function() {
  afterEach(function() {
    elasticlunr.tokenizer.resetSeperator();
  })

  it('should split simple strings into tokens', function() {
    assert.deepEqual(elasticlunr.tokenizer('this is a simple string').map((r) => r.toString()), ['this', 'is', 'a', 'simple', 'string']);
  })

  it('should downcast tokens', function() {
    var simpleString = 'FOO BAR';

    assert.deepEqual(elasticlunr.tokenizer(simpleString).map((r) => r.toString()), ['foo', 'bar']);
  })

  it('should remove multiple whitespace', function() {
    var testString = '  foo    bar  ',
    tokens = elasticlunr.tokenizer(testString);

    assert.deepEqual(tokens.map((r) => r.toString()), ['foo', 'bar']);
  });

  it('should handle null-like arguments', function() {
    assert.deepEqual(elasticlunr.tokenizer().map((r) => r.toString()), []);
    assert.deepEqual(elasticlunr.tokenizer(null).map((r) => r.toString()), []);
    assert.deepEqual(elasticlunr.tokenizer(undefined).map((r) => r.toString()), []);
  })

  it('calls toString on arguments', function() {
    var date = new Date (Date.UTC(2013, 0, 1, 12)),
    obj = {
      toString: function () { return 'custom object' }
    };

    assert.deepEqual(elasticlunr.tokenizer(41).map((r) => r.toString()), ['41']);
    assert.deepEqual(elasticlunr.tokenizer(obj).map((r) => r.toString()), ['custom', 'object']);

// slicing here to avoid asserting on the timezone part of the date
// that will be different whereever the test is run.
    assert.deepEqual(elasticlunr.tokenizer(date).slice(0, 4).map((r) => r.toString()), ['tue', 'jan', '01', '2013']);
  });

  it("splits strings with hyphens", function () {
    var simpleString = "take the New York-San Francisco flight",
        tokens = elasticlunr.tokenizer(simpleString);
  
    assert.deepEqual(tokens.map((r) => r.toString()), ['take', 'the', 'new', 'york', 'san', 'francisco', 'flight']);
  });
  
  it("splits strings with hyphens and spaces", function () {
    var simpleString = "Solve for A - B",
        tokens = elasticlunr.tokenizer(simpleString);
  
    assert.deepEqual(tokens.map((r) => r.toString()), ['solve', 'for', 'a', 'b']);
  });
  
  it("test with customized seperator", function () {
    var sep = /[\/]+/g;
    var s = 'hello/world/I/love';
  
    var sep2 = /[\\]+/g;
    var s2 = 'hello\\world\\I\\love';
  
    var sep3 = /[\/\%]+/g;
    var s3 = 'hello/world/%%%apple%pie';
  
    elasticlunr.tokenizer.setSeperator(sep);
    assert.deepEqual(elasticlunr.tokenizer(s).map((r) => r.toString()), ['hello', 'world', 'i', 'love']);
  
    elasticlunr.tokenizer.setSeperator(sep2);
    assert.deepEqual(elasticlunr.tokenizer(s2).map((r) => r.toString()), ['hello', 'world', 'i', 'love']);
  
    elasticlunr.tokenizer.setSeperator(sep3);
    assert.deepEqual(elasticlunr.tokenizer(s3).map((r) => r.toString()), ['hello', 'world', 'apple', 'pie']);
  });
  
  it("test reset seperator", function () {
    var sep = /[\/]+/g;
    var s = 'hello world I love apple';
  
    elasticlunr.tokenizer.setSeperator(sep);
    elasticlunr.tokenizer.resetSeperator()
    assert.deepEqual(elasticlunr.tokenizer(s).map((r) => r.toString()), ['hello', 'world', 'i', 'love', 'apple']);
  });
  
  it("test get seperator function", function () {
    var sep = /[\/]+/g;
  
    elasticlunr.tokenizer.setSeperator(sep);
    assert.deepEqual(elasticlunr.tokenizer.getSeperator(), sep);
  
    elasticlunr.tokenizer.resetSeperator();
    assert.deepEqual(elasticlunr.tokenizer.getSeperator(), elasticlunr.tokenizer.defaultSeperator);
  
    var sep2= /[*]+/g;
    elasticlunr.tokenizer.setSeperator(sep2);
    assert.deepEqual(elasticlunr.tokenizer.getSeperator(), sep2);
  });
})