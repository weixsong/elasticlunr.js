module('elasticlunr.trimmer');

test('latin characters', function () {
  var token = 'hello';
  equal(elasticlunr.trimmer(token), token);
});

test('removing leading and trailing punctuation', function () {
  var fullStop = 'hello.',
      innerApostrophe = "it's",
      trailingApostrophe = "james'",
      exclamationMark = 'stop!',
      comma = 'first,',
      empty = '',
      brackets = '[tag]';

  deepEqual(elasticlunr.trimmer(fullStop), 'hello');
  deepEqual(elasticlunr.trimmer(innerApostrophe), "it's");
  deepEqual(elasticlunr.trimmer(trailingApostrophe), "james");
  deepEqual(elasticlunr.trimmer(exclamationMark), 'stop');
  deepEqual(elasticlunr.trimmer(comma), 'first');
  deepEqual(elasticlunr.trimmer(empty), '');
  deepEqual(elasticlunr.trimmer(brackets), 'tag');
});

test('should be registered with elasticlunr.Pipeline', function () {
  equal(elasticlunr.trimmer.label, 'trimmer');
  deepEqual(elasticlunr.Pipeline.registeredFunctions['trimmer'], elasticlunr.trimmer);
});

test('test null input to trimmer', function () {
  var token = null;
  throws(function () {
    elasticlunr.trimmer(token);
  });

  token = undefined;
  throws(function () {
    elasticlunr.trimmer(token);
  });

  token = void 0;
  throws(function () {
    elasticlunr.trimmer(token);
  });
});
