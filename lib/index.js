// import idx096 from "./index/legacy.js";
import { Index } from './index/withPosition.js';
import {Converter} from './index/converter.js';

class IndexAssembly {

  constructor(elasticlunr) {
    this.elasticlunr = elasticlunr;
    this.knownVersions = [];
    this.components = {};
  }

  registerComponent(componentType, item) {
    this.components[componentType] = item;
  }

  register(version, generator, isDefault) {
    this.knownVersions.push({
      version: version,
      generator: generator,
      default: isDefault
    });
  }

  loadComponent(component) {
    if (this.components[component]) return this.components[component](this);
    return null;
  }

  loadIndex(data) {
    if (!data.version) {
      throw Error('No index version provided. Are you sure this is an elasticlunr index?');
    }
    for (let o of this.knownVersions) {
      if (typeof o.version === 'string' && data.version === o.version) {
        return o.generator(this).load(data);
      }
      if (o.version instanceof RegExp && o.version.test(data.version)) {
        return o.generator(this).load(data);
      }
    }
    throw Error(`Unknown index version ${data.version}`);
  }

  createDefault() {
    for (let o of this.knownVersions) {
      if (o.default) return o.generator(this);
    }
    return null;
  }
};

export function index(elasticlunr) {
  const newIndexShim = (elasticlunr) => {
    return (components) => {
      // This is where the great big wrapping magic happens
      var pipeline = new elasticlunr.Pipeline();
      var proxy = new Proxy(pipeline, {
        get: function (target, propKey, receiver) {
          var propValue = target[propKey];

          if (typeof propValue !== 'function' || propKey !== 'run') {
            return propValue;
          }

          return function () {
            return propValue.call(this, elasticlunr.tokenizer(arguments[0]));
          };

        }
      });
      var objE = new Converter(new Index({
        storePositions: true,
        emitter: new elasticlunr.EventEmitter(),
        storeDocuments: true,
        pipeline: proxy
      }), {
        elasticlunr: elasticlunr,
        pipeline: proxy
      });

      objE.pipeline = proxy;
      return objE;
    };
  };

  var idx = new IndexAssembly(elasticlunr);
  //    var i096 = idx096(elasticlunr);
  var newIndex = newIndexShim(elasticlunr);

  /* idx.register("0.9.6", function(components) {
        return i096(components);
    }, true); */

  idx.register(new RegExp('^(0.9|1.0)'), function (components) {
    var o = newIndex(components);

    return o;
  }, true);

  let idxLoader = function () {
    return idx.createDefault();
  };

  idxLoader.load = function (data) {
    return idx.loadIndex(data);
  };

  idxLoader.registerComponent = function (component, generator) {
    return idx.registerComponent(component, generator);
  };

  idxLoader.register = function (version, generator, isDefault) {
    return idx.register(version, generator, isDefault);
  };

  elasticlunr.Index = idxLoader;
  // Default settings
  idxLoader.registerComponent('documentStore', function (registry) {
    return new elasticlunr.DocumentStore();
  });
  idxLoader.registerComponent('eventEmitter', function (registry) {
    return new elasticlunr.EventEmitter();
  });
  idxLoader.registerComponent('pipeline', function (registry) {
    return new elasticlunr.Pipeline();
  });
};
