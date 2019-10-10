const elasticlunr = require("../lib/elasticlunr.js");
const assert = require("assert");
const sinon = require("sinon");

describe('elasticlunr.EventEmitter', function() {
  it('should throw if trying to register a non-function', function() {
    var emitter = new elasticlunr.EventEmitter;
    assert.throws(function() {
      emitter.addListener('foo', null);
    })
  });
  it('should properly propagate events to callables', function() {
    var emitter = new elasticlunr.EventEmitter;
    var multiListener = sinon.spy();
    var fooListener = sinon.spy();
    var bazListener = sinon.spy();

    assert.equal(emitter.removeListener('nonexistent', function(r) {}), null);
    emitter.addListener('foo', 'bar', 'baz', multiListener);
    emitter.addListener('foo', fooListener);
    emitter.emit('foo', true);
    assert.equal(emitter.emit('nonexistent', true), null);
    assert.equal(emitter.removeListener('foo', function(r) {}), null);
    assert.equal(multiListener.calledWith(true), true);
    assert.equal(fooListener.calledWith(true), true);
    emitter.removeListener('foo', fooListener);
    emitter.emit('foo', true);
    assert.equal(multiListener.calledTwice, true);
    assert.equal(fooListener.calledOnce, true);
    emitter.removeListener('foo', multiListener);
  });
});