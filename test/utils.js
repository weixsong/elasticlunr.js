var elasticlunr = require("../lib/elasticlunr.js"),
    assert = require("assert");

describe('elasticlunr.utils', function() {
  it('tests if elasticlunr.utils.warn is a function', function() {
    var f = function() {};

    assert.deepEqual(typeof(elasticlunr.utils.warn), typeof(f));
  })

  describe('test toString', function() {
    it('should be empty for null-like inputs', function() {
      var a = null;
      var b = undefined;
      var c = void 0;
  
      assert.equal(elasticlunr.utils.toString(a), '');
      assert.equal(elasticlunr.utils.toString(b), '');
      assert.equal(elasticlunr.utils.toString(c), '');
    });
    it('should pass toString for objects', function() {
      var a = {name: 'ella', age: 15};
      var b = {};
  
      assert.equal(elasticlunr.utils.toString(a), a.toString());
      assert.equal(elasticlunr.utils.toString(b), b.toString());
    });
    it('should handle arrays', function() {
      var a = [],
      b = [1, 2, 3, 'hello', 'word'],
      c = [1, 2, 3, undefined],
      d = [1, 2, 3, 'hello', undefined],
      e = [1, 2, 3, null],
      f = [1, 2, 3, 'hello', null],
      g = ['hello', 'word'],
      h = ['hello', 'word', null];

      assert.equal(elasticlunr.utils.toString(a), a.toString());
      assert.equal(elasticlunr.utils.toString(b), b.toString());
      assert.equal(elasticlunr.utils.toString(c), c.toString());
      assert.equal(elasticlunr.utils.toString(d), d.toString());
      assert.equal(elasticlunr.utils.toString(e), e.toString());
      assert.equal(elasticlunr.utils.toString(f), f.toString());
      assert.equal(elasticlunr.utils.toString(g), g.toString());
      assert.equal(elasticlunr.utils.toString(h), h.toString());
    })
    it('should handle numbers', function() {
      var a = 0,
      b = -5,
      c = 20,
      e = 1e3,
      d = 1.0,
      f = 2.3,
      g = -3.2;

      assert.equal(elasticlunr.utils.toString(a), a.toString());
      assert.equal(elasticlunr.utils.toString(b), b.toString());
      assert.equal(elasticlunr.utils.toString(c), c.toString());
      assert.equal(elasticlunr.utils.toString(d), d.toString());
      assert.equal(elasticlunr.utils.toString(e), e.toString());
      assert.equal(elasticlunr.utils.toString(f), f.toString());
      assert.equal(elasticlunr.utils.toString(g), g.toString());
    })

    it('should handle functions', function () {
      var f1 = function() {};
      var f2 = function() {
        var n1 = 2;
        var n2 = 3;
        return n1 + n2;
      };
    
      var f3 = function(n1, n2) {
        return n1 + n2;
      };
    
      assert.equal(elasticlunr.utils.toString(f1), f1.toString());
      assert.equal(elasticlunr.utils.toString(f2), f2.toString());
      assert.equal(elasticlunr.utils.toString(f3), f3.toString());
    });
    
    it('should handle strings', function () {
      var a = '',
          b = 'hello world',
          c = 'microsoft',
          d = '   abc ',
          e = '%^&*((',
          f = "abc\s ' cd's";
    
      assert.equal(elasticlunr.utils.toString(a), a);
      assert.equal(elasticlunr.utils.toString(b), b);
      assert.equal(elasticlunr.utils.toString(c), c);
      assert.equal(elasticlunr.utils.toString(d), d);
      assert.equal(elasticlunr.utils.toString(e), e);
      assert.equal(elasticlunr.utils.toString(f), f);
    });
  });
})
