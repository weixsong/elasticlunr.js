# Elasticlunr.js

[![Build Status](https://travis-ci.org/olivernn/lunr.js.png?branch=master)](https://travis-ci.org/olivernn/lunr.js)

Elasticlunr.js is developed based on Lunr.js, but more flexible that lunr.js. Elasticlunr.js provides Query-Time boosting and field search.
A bit like Solr, but much smaller and not as bright, but also provide flexible configuration and query-time boosting.

# Key Features Comparing with Lunr.js

 * 1. **Query-Time boosting**, you don't need to setup boosting weight in index building procedure, this make it more flexible that you could try different boosting scheme.
 * 2. **More rational scoring mechanism**, Elasticlunr.js use quite the same scoring mechanism as Elasticsearch, and also this scoring mechanism is used by lucene.
 * 3. **Field-search**, you could choose which field to index and which field to search.
 * 4. **Boolean Model**, you could set which field to search and the boolean model for each query token, such as "OR", "AND".
 * 5. **Combined Boolean Model, TF/IDF Model and the Vector Space Model**, make the results ranking more reliable.
 * 6. **Fast**, Elasticlunr.js removed TokenCorpus and Vector from lunr.js, by using combined model there is need to compute the vector of a document to compute the score of a document, this improve the search speed significantly.
 * 7. **Small index file**, Elasticlunr.js did not store TokenCorpus because there is no need to compute query vector and document vector, then the index file is very small, this is especially helpful when elasticlurn.js is used as offline search.

## Example

A very simple search index can be created using the following scripts:

```javascript
var index = elasticlunr(function () {
    this.addField('title');
    this.addField('body');
    this.setRef('id');
});
```

Adding documents to the index is as simple as:

```javascript
var doc1 = {
    "id": 1,
    "title": "Oracle released its latest database Oracle 12g",
    "body": "Yestaday Oracle has released its new database Oracle 12g, this would make more money for this company and lead to a nice profit report of annual year."
}

var doc2 = {
    "id": 2,
    "title": "Oracle released its profit report of 2015",
    "body": "As expected, Oracle released its profit report of 2015, during the good sales of database and hardware, Oracle's profit of 2015 reached 12.5 Billion."
}

index.addDoc(doc1);
index.addDoc(doc2);
```

Then searching is as simple:

```javascript
index.search("Oracle database profit");
```

Also, you could do query-time boosting by passing in a configuration.

```javascript
index.search("Oracle database profit", {
    fields: {
        title: {boost: 2},
        body: {boost: 1}
    }
});
```

This returns a list of matching documents with a score of how closely they match the search query:

```javascript
[{
    "ref": 1,
    "score": 0.5376053707962494
},
{
    "ref": 2,
    "score": 0.5237481076838757
}]
```

[API documentation](http://weixsong.github.io/assets/elasticlunr/docs/index.html) is available, as well as a [full working example](http://weixsong.github.io/assets/elasticlunr/docs/index.html).

## Description

Elasticlunr.js is developed based on Lunr.js, but more flexible that lunr.js. Elasticlunr.js provides Query-Time boosting and field search.
A bit like Solr, but much smaller and not as bright, but also provide flexible configuration and query-time boosting.

## Why

1. In some system, you don't want to deploy any Web Server(such as Apache, Nginx, etc.), you only provide some static web pages and provide search function in client side. Then you could build index in previous and load index in client side.
2. Provide offline search functionality. For some documents, user usually download these documents, you could build index and put index in the documents package, then provide offline search functionality.
3. For some limited or restricted network, such WAN or LAN, offline search is a better choice.
4. For mobile device, Iphone or Android phone, network traffic maybe very expensive, then provide offline search is a good choice.

## Installation

Simply include the elasticlunr.js source file in the page that you want to use it.  Elasticlunr.js is supported in all modern browsers.

Browsers that do not support ES5 will require a JavaScript shim for Elasticlunr.js to work. You can either use [Augment.js](https://github.com/olivernn/augment.js), [ES5-Shim](https://github.com/kriskowal/es5-shim) or any library that patches old browsers to provide an ES5 compatible JavaScript environment.

## Contributing

See the [`CONTRIBUTING.mdown` file](CONTRIBUTING.mdown).
