
import elasticlunr from '../lib/elasticlunr.js';
import assert from 'assert';

describe('elasticlunr search', function() {
  var idx = null;
  beforeEach(function() {
    idx = new elasticlunr.Index;
    idx.addField('body');
    idx.addField('title');

    ;([{
      id: 'a',
      title: 'Mr. Green kills Colonel Mustard',
      body: 'Mr. Green killed Colonel Mustard in the study with the candlestick. Mr. Green is not a very nice fellow.',
      wordCount: 19
    },{
      id: 'b',
      title: 'Plumb waters green plant ',
      body: 'Professor Plumb has a green plant in his study',
      wordCount: 9
    },{
      id: 'c',
      title: 'Scarlett helps Professor',
      body: 'Miss Scarlett watered Professor Plumbs green plant while he was away from his office last week.',
      wordCount: 16
    },{
      id: 'd',
      title: 'title',
      body: 'handsome',
    },{
      id: 'e',
      title: 'title abc',
      body: 'hand',
    }]).forEach(function (doc) { idx.addDoc(doc); });

    this.idx = idx;
  });

  it('returns the correct results', function() {

    var results = idx.search();
    assert.deepEqual(results, []);

    var results = idx.search('green plant');
    assert.equal(results.length, 3);
    assert.equal(results[0].ref, 'b');

    var results = idx.search('foo');
    assert.equal(results.length, 0);

    var results = idx.search('foo green')
    assert.equal(results.length, 3);

    var results = idx.search('green foo');
    assert.equal(results.length, 3);

    var results = idx.search('professor');
    assert.equal(results.length, 2);
    assert.equal(results[0].ref, 'c');

    var results = idx.search('title');
    assert.equal(results.length, 2);
    assert.equal(results[0].ref, 'd');

    var results = idx.search('plant', {fields: {title: {boost: 1}, body: {boost: 0}}});
  
    assert.equal(results.length, 1);
    assert.equal(results[0].ref, 'b');

    var results = idx.search({title: 'green plant'}, {expand: true, bool: 'AND'});
    assert.equal(results.length, 1);

    var results = idx.search({title: 'gre plant'}, {expand: true, bool: 'AND'});
    assert.equal(results.length, 1);

    var results = idx.search({title: 'plant', body: 'Plumb'}, {bool: 'AND'});
    assert.equal(results.length, 1);
    
    var results = idx.search({title: 'blue plant'}, {bool: 'AND'});
    assert.equal(results.length, 0);

    var results = idx.search({title: 'plant red'}, {bool: 'AND'});
    assert.equal(results.length, 0);

    var results = idx.search({title: 'helps', body: 'nice'});
  
    assert.equal(results.length, 2);
    assert.equal(results[0].ref, 'c');
    assert.equal(results[1].ref, 'a');
  });
});

describe('elastic-like DSL', function() {
  var idx = null;
  beforeEach(() => {
    idx = new elasticlunr.Index();
    idx.addField('body');
    idx.addField('title');

    ([{
      id: 'a',
      title: 'Mr. Green kills Colonel Mustard',
      body: 'Mr. Green killed Colonel Mustard in the study with the candlestick. Mr. Green is not a very nice fellow.',
      wordCount: 19
    },{
      id: 'b',
      title: 'Plumb waters green plant ',
      body: 'Professor Plumb has a green plant in his study',
      wordCount: 9
    },{
      id: 'c',
      title: 'Scarlett helps Professor',
      body: 'Miss Scarlett watered Professor Plumbs green plant while he was away from his office last week.',
      wordCount: 16
    },{
      id: 'd',
      title: 'title',
      body: 'handsome',
    },{
      id: 'e',
      title: 'title abc',
      body: 'hand',
    }]).forEach(function (doc) { idx.addDoc(doc); });

    this.idx = idx;
  });
  it('Allows fuzzing', () => {
    var results = idx.search({
      query: {
        match: {
          title: 'grene',
          fuzziness: 2
        }
      }
    });
    assert.equal(results.length, 2);
  })
});
