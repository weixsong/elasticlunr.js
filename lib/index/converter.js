import intf from './interface.js';
import { QueryRepository } from '../dsl.js';

export default class Converter {

  constructor(inner, options) {
    if (!(inner instanceof intf)) throw Error('The object provided must be an instance of the index interface');
    this.inner = inner;
    this.eslunr = options.elasticlunr;
    this.defaultPipeline = this.inner.pipeline;
    this.documentStore = this.inner.documentStore;
  }

  getRef() {
    return this.inner.getRef();
  }

  saveDocument(toSave) {
    for (let o of Object.values(this.inner._fields)) {
      o._store = toSave;
    }
  }

  toJSON() {
    return this.inner.toJSON();

  }
  on() {
    return this.inner.emitter.addListener.apply(this.inner.emitter, arguments);
  }

  load(idx) {
    // Sucks, but we need to reyhydrate the pipelines here
    // This is what happens when you have stuff in the global scope, boys and girls!
    if (idx.version === '1.0.0') {
      if (idx.fields) {
        for (let o = 0; o < idx.fields.length; o++) {
          if (
            idx.fields[o] &&
            idx.fields[o].settings &&
            idx.fields[o].settings.pipeline &&
            Array.isArray(idx.fields[o].settings.pipeline)
          ) {
            if (idx.fields[o].settings.pipeline.length > 0) {
              (function (eslunr) {
                var pipeline = new eslunr.Pipeline();

                idx.fields[o].settings.pipeline.forEach((fnName) => {
                  var fn = eslunr.Pipeline.getRegisteredFunction(fnName);

                  if (fn) {
                    pipeline.add(fn);
                  } else {
                    throw new Error('Cannot load un-registered function: ' + fnName);
                  }
                });

                let proxy = new Proxy(pipeline, {
                  get: (target, propKey, receiver) => {
                    var propValue = target[propKey];

                    if (typeof propValue !== 'function' || propKey !== 'run') {
                      return propValue;
                    }

                    return function () {
                      return propValue.call(this, eslunr.tokenizer(arguments[0]));
                    };

                  }
                });

                idx.fields[o].settings.pipeline = proxy;
              })(this.eslunr);
            } else {
              idx.fields[o].settings.pipeline = this.defaultPipeline;
            }
          } else {
            delete idx.fields[o].settings.pipeline;
          }
        }
      }
      this.inner._load(idx);
    } else {
      if (idx && idx.pipeline) {
        idx.pipeline = this.eslunr.Pipeline.load(idx.pipeline);
      }
      this.inner._legacyLoad(idx);
    }
    return this;
  }
  off() {
    return this.inner.emitter.removeListener.apply(this.inner.emitter, arguments);
  }

  setRef(field) {
    return this.inner.setRef(field);
  }

  addDoc(doc, mute) {
    return this.inner.add([doc], mute);
  }
  add(doc) {
    return this.addDoc(doc);
  }
  elasticsearch(query) {
    if (!query || !query.query) throw Error('Root object must have a query element');
    let root = query.query;
    let keys = Object.entries(root);
    let q = QueryRepository.parse(keys[0][0], keys[0][1], root);

    return q.score(this.inner).sort((a, b) => a.score < b.score);
  }
  highlight(ref, matched) {
    return this.inner.highlight(ref, matched);
  }
  search(query, options) {
    if (!query) return [];
    // lunr/elasticlunr common format
    if (typeof query === 'string') {
      // lunr search/elasticlunr simple search
      if (!options || typeof options !== 'object') {
        return this.elasticsearch({
          'query': {
            'bool': {
              'should': this.inner.getFields().filter((field) => field !== this.inner.getRef()).map((field) => {
                return {
                  'match': {
                    [field]: query
                  }
                };
              })
            }
          }
        });
      }
      // elasticlunr boosted queries
      if (options.fields) {
        return this.elasticsearch({
          'query': {
            'bool': {
              'should': this.inner.getFields()
                .filter((field) => field !== this.inner.getRef() &&
                  (options.fields[field] && options.fields[field].boost > 0))
                .map((field) => {
                  return {
                    match: {
                      [field]: query
                    },
                    boost: options.fields[field].boost
                  };
                })
            }
          }
        });
      }
    }
    // elasticlunr advanced query format
    if (typeof query === 'object' && !query.query) {
      if (!options) {
        return this.search(query, {operator: 'OR'});
      }
      let search = Object.entries(query);

      return this.elasticsearch({
        'query': {
          'bool': {
            'should': search.map(([field, content]) => {
              return {
                'match': {
                  [field]: content,
                  'operator': options && options.bool && options.bool.toLowerCase() === 'and' ? 'and' : 'or'
                },
                'expand': !!(options && options.expand)
              };
            })
          }
        }
      });
    }
    return this.elasticsearch(query);
  }

  updateDoc(doc, mute) {
    return this.inner.update([doc], mute);
  }

  removeDoc(doc, mute) {
    const idField = this.getRef();

    if (!doc || !doc[idField]) return null;
    return this.inner.remove([doc[idField]], mute);
  }
  removeDocByRef(doc, mute) {
    this.inner.remove([doc], mute);
    return;
  }

  use(plugin) {
    var args = Array.prototype.slice.call(arguments, 1);

    args.unshift(this);
    plugin.apply(this, args);
  }

  getFields() {
    return this.inner.getFields();
  }

  getField(field) {
    return this.inner.getField(field);
  }

  addField(field) {
    return this.inner.addField(field);
  }
  field(field) {
    return this.addField(field);
  }
}
