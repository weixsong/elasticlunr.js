export class Index {

  /** Individual elements */
  getDocumentStore() {
    throw Error('getDocumentStore() must be defined');
  }

  /** Index ops */
  add(documents) {
    throw Error('This index does not support adding documents');
  }

  remove(matcherFn) {
    throw Error('This index does not support removal of documents');
  }

  all() {
    return this.getDocumentStore().all();
  }

  getRef() {
    throw Error('getRef must be implemented');
  }

  /** Terms/search */
  getFields() {
    throw Error('getFields() must be implemented');
  }

  getField(fieldName) {
    throw Error('getField() must be implemented');
  }

  analyze(field, str) {
    throw Error('The analyze(field, str) method must be implemented. This must return tokens for the given string.');
  }

  /** Query operators */
  terms(query) {
    throw Error('The terms(query) method must be implemented.');
  }
}
