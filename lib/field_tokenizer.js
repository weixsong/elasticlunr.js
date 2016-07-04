elasticlunr.FieldTokenizer = function () {
  this._tokenizer = {};
};

elasticlunr.FieldTokenizer.load = function() {
  return new elasticlunr.FieldTokenizer;
}

elasticlunr.FieldTokenizer.prototype.tokenizer = function (str, field) {
  var tokenizer = this.getFieldTokenizer(field);
  if (tokenizer) {
    return tokernizer(str);
  }
  return elasticlunr.tokenizer(str);
};

elasticlunr.FieldTokenizer.prototype.getFieldTokenizer = function(field) {
  var tokenizer = this._tokenizer[field];
  if (tokenizer && typeof tokenizer === 'function') {
    return tokenizer;
  }
  return undefined;
}

elasticlunr.FieldTokenizer.prototype.registerFieldTokenizer = function(tokenizer, field) {
  var tokenizer = this.getFieldTokenizer(field);
  if (tokenizer) {
    elasticlunr.utils.warn('Tokenizer for field "' + field +'" is already registered.\n', tokenizer);
  }
  this._tokenizer[field] = tokenizer;
}

elasticlunr.FieldTokenizer.prototype.unregisterFieldTokenizer = function(tokenizer, field) {
  this._tokenizer[field] = undefined;
}
