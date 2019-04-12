
import elasticlunr from '../lib/elasticlunr.js';
import assert from 'assert';

describe('Configuration', function () {
  describe("constructor test", function() {
    var tests = [
      {
        fields: ['title', 'body'],
        config: '{"fields": {"title": {"boost": 2}},"bool": "OR"}',
        expected: {
          title: {
            boost: 2,
            bool: "OR",
            expand: false
          }
        }
      },
      {
        fields: ['title', 'body'],
        config: '{"fields": {"title": {"boost": 3},"body": {"boost": 2}},"bool": "OR"}',
        expected: {
          title: {
            boost: 3,
            bool: "OR",
            expand: false
          },
          body: {
            boost: 2,
            bool: "OR",
            expand: false
          }
        }
      },
      {
        fields: ['title', 'body'],
        config: null,
        expected: {
          title: {
            boost: 1,
            bool: "OR",
            expand: false
          },
          body: {
            boost: 1,
            bool: "OR",
            expand: false
          }
        }
      },
      {
        fields: ['title', 'body'],
        config: '{"bool": "OR"',
        expected: {
          title: {
            boost: 1,
            bool: "OR",
            expand: false
          },
          body: {
            boost: 1,
            bool: "OR",
            expand: false
          }
        }
      },
      {
        fields: ['title', 'body'],
        config: '{"fields": {"title": {"boost": 3, "bool": "AND"},"body": {"boost": 2}},"bool": "OR"}',
        expected: {
          title: {
            boost: 3,
            bool: "AND",
            expand: false
          },
          body: {
            boost: 2,
            bool: "OR",
            expand: false
          }
        }
      },
      {
        fields: ['title', 'body'],
        config: '{"fields": {"title": {"bool": "AND"},"body": {}},"bool": "OR"}',
        expected: {
          title: {
            boost: 1,
            bool: "AND",
            expand: false
          },
          body: {
            boost: 1,
            bool: "OR",
            expand: false
          }
        }
      },
      {
        fields: ['title', 'body'],
        config: '{"fields": {"title": {"boost": 2},"body": {}}}',
        expected: {
          title: {
            boost: 2,
            bool: "OR",
            expand: false
          },
          body: {
            boost: 1,
            bool: "OR",
            expand: false
          }
        }
      },
      {
        fields: ['title', 'body'],
        config: '{"fields": {"head": {"boost": 3, "bool": "AND"},"body": {"boost": 2}},"bool": "OR"}',
        expected: {
          body: {
            boost: 2,
            bool: "OR",
            expand: false
          }
        }
      },
      {
        fields: null,
        config: '{"fields": {"head": {"boost": 3, "bool": "AND"},"body": {"boost": 2}},"bool": "OR"}',
        throws: "fields should not be null"
      },
      {
        fields: ['title', 'body'],
        config: '{"fields: {"head": {"boost": 3, "bool": "AND"},"body": {"boost": 2}},"bool": "OR"}',
        expected: {
          title: {
            boost: 1,
            bool: "OR",
            expand: false
          },
          body: {
            boost: 1,
            bool: "OR",
            expand: false
          }
        }
      },
      {
        fields: ['title', 'body'],
        config: '',
        expected: {
          title: {
            boost: 1,
            bool: "OR",
            expand: false
          },
          body: {
            boost: 1,
            bool: "OR",
            expand: false
          }
        }
      },
      {
        fields: ['title', 'body'],
        config: '{"fields": {"title": {"boost": 3, "bool": "AND"},"body": {"boost": 2}},"bool":"OR", "expand":true}',
        expected: {
          title: {
            boost: 3,
            bool: "AND",
            expand: true
          },
          body: {
            boost: 2,
            bool: "OR",
            expand: true
          }
        }
      },
      {
        fields: ['title', 'body'],
        config: '{"fields": {"title": {"boost": 3, "bool": "AND", "expand":false},"body": {"boost": 2}},"bool":"OR", "expand":true}',
        expected: {
          title: {
            boost: 3,
            bool: "AND",
            expand: false
          },
          body: {
            boost: 2,
            bool: "OR",
            expand: true
          }
        }
      },
      {
        fields: ['title', 'body'],
        config: '{"fields": {"title": {"boost": 3, "bool": "AND", "expand":false},"body": {"boost": 2,"expand":true}},"bool":"OR", "expand":false}',
        expected: {
          title: {
            boost: 3,
            bool: "AND",
            expand: false
          },
          body: {
            boost: 2,
            bool: "OR",
            expand: true
         }
        }
      },
      {
        fields: ['title', 'body'],
        config: '{"fields": {"title": {"boost": 3, "bool": "AND", "expand":false},"body": {"boost": 2,"expand":false}},"bool":"OR", "expand":false}',
        expected: {
          title: {
            boost: 3,
            bool: "AND",
            expand: false
          },
          body: {
            boost: 2,
            bool: "OR",
            expand: false
          }
        }
      },
      {
        fields: ['title', 'body'],
        config: '{"fields": {"title": {"boost": 0},"body": {"boost": 2}}}',
        expected: {
          title: {
            boost: 0,
            bool: "OR",
            expand: false
          },
          body: {
            boost: 2,
            bool: "OR",
            expand: false
          }
        }
      }
    ];

    it('should properly set up a configuration based on user config and fields', function() {
      for (var test of tests) {
        if (test.throws) {
          assert.throws(function() { return new elasticlunr.Configuration(test.config, test.fields); }, Error, test.throws);
        } else {
          var config = new elasticlunr.Configuration(test.config, test.fields);
          assert.deepEqual(config.get(), test.expected);
        }
      }
    });
  });
});