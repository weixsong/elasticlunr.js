var elasticlunr = require("../lib/elasticlunr.js"),
    assert = require("assert");

describe("elasticlunr.SortedSet", function() {
    it("Should create, add, serialize and deserialize properly", function() {
        var set = new elasticlunr.SortedSet();
        assert.equal(set.length, 0);
        assert.deepEqual(set.elements, []);

        set.add("b", "a", "c");
        assert.equal(set.length, 3);
        assert.deepEqual(set.elements, ["a", "b", "c"]);

        assert.deepEqual(JSON.parse(JSON.stringify(set)), ["a", "b", "c"]);
        var set2 = elasticlunr.SortedSet.load(JSON.parse(JSON.stringify(set)));
        assert.deepEqual(set.elements, set2.elements);
    });
    it("implements basic operations", function() {
        var set = elasticlunr.SortedSet.load(["a", "b", "c"]);
        assert.deepEqual(set.map((e) => {
            return "1";
        }, null), ["1", "1", "1"]);
        var o = 0;
        set.forEach((r) => {
            o++
        });
        assert.equal(o, 3);
    });
    it("implements union()", function() {
        var set1 = elasticlunr.SortedSet.load(["a", "b", "c"]);
        var set2 = elasticlunr.SortedSet.load(["d", "e"]);
        var union = set2.union(set1);
        assert.deepEqual(union.elements, ["a", "b", "c", "d", "e"]);
    });
    it("implements intersect", function() {
        var set1 = elasticlunr.SortedSet.load(["a", "b", "c"]);
        var set2 = elasticlunr.SortedSet.load(['a', 'z']);
        assert.deepEqual(set1.intersect(set2).elements, ['a']);
    })
});