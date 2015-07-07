# elasticlunr.js

[![Build Status](https://travis-ci.org/olivernn/lunr.js.png?branch=master)](https://travis-ci.org/olivernn/lunr.js)

Elasticlunr.js is developed based on Lunr.js, but more flexible that lunr.js. Elasticlunr.js provides Query-Time boosting and field search.
A bit like Solr, but much smaller and not as bright, but also provide flexible usage and query-time boosting.

# Key Features Comparing with Lunr.js

 * 1. Query-Time boosting, you don't need to setup boosting weight in index building procedure, this make it more flexible that you could try different boosting scheme.
 * 2. More rational scoring mechanism, Elasticlunr.js use quite the same scoring mechanism as Elasticsearch, and also this scoring mechanism is used by lucene.
 * 3. Field-search, you could choose which field to index and which field to search.
 * 4. Combined Boolean Model, TF/IDF Model and the Vector Space Model, make the results ranking more reliable.
 * 5. Fast, Elasticlunr.js removed TokenCorpus and Vector from lunr.js, by using combined model there is need to compute the vector of a document to compute the score of a document, this improve the search speed significantly.
 * 6. Small index file, Elasticlunr.js did not store TokenCorpus because there is no need to compute query vector and document vector, then the index file is very small, this is especially helpful when elasticlurn.js is used as offline search.

## Example

A very simple search index can be created using the following:

```javascript
var idx = lunr(function () {
    this.field('title', { boost: 10 })
    this.field('body')
})
```

Adding documents to be indexed is as simple as:

```javascript
var doc = {
    "title": "Twelfth-Night",
    "body": "If music be the food of love, play on: Give me excess of it…",
    "author": "William Shakespeare",
    "id": 1
}
idx.add(doc)
```

Then searching is as simple:

```javascript
idx.search("love")
```

This returns a list of matching documents with a score of how closely they match the search query:

```javascript
[{
    "ref": 1,
    "score": 0.87533
}]
```

[API documentation](http://lunrjs.com/docs) is available, as well as a [full working example](http://lunrjs.com/example/).

## Description

Lunr.js is a small, full-text search library for use in the browser.  It indexes JSON documents and provides a simple search interface for retrieving documents that best match text queries.

## Why

For web applications with all their data already sitting in the client, it makes sense to be able to search that data on the client too.  It saves adding extra, compacted services on the server.  A local search index will be quicker, there is no network overhead, and will remain available and useable even without a network connection.

## Installation

Simply include the lunr.js source file in the page that you want to use it.  Lunr.js is supported in all modern browsers.

Browsers that do not support ES5 will require a JavaScript shim for Lunr to work. You can either use [Augment.js](https://github.com/olivernn/augment.js), [ES5-Shim](https://github.com/kriskowal/es5-shim) or any library that patches old browsers to provide an ES5 compatible JavaScript environment.

## Contributing

See the [`CONTRIBUTING.mdown` file](CONTRIBUTING.mdown).
