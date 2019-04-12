/**
 * elasticlunr.index.withPosition
 * 
 * Copyright (C) Seb Renauld
 */

import IdxInterface from './interface.js';
import { runInContext } from 'vm';
import util from 'util';

function levenshteinDistance(a, b) {
    // Create empty edit distance matrix for all possible modifications of
    // substrings of a to substrings of b.
    const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    // Fill the first row of the matrix.
    // If this is first row then we're transforming empty string to a.
    // In this case the number of transformations equals to size of a substring.
    for (let i = 0; i <= a.length; i += 1) {
        distanceMatrix[0][i] = i;
    }

    // Fill the first column of the matrix.
    // If this is first column then we're transforming empty string to b.
    // In this case the number of transformations equals to size of b substring.
    for (let j = 0; j <= b.length; j += 1) {
        distanceMatrix[j][0] = j;
    }

    for (let j = 1; j <= b.length; j += 1) {
        for (let i = 1; i <= a.length; i += 1) {
            const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
            distanceMatrix[j][i] = Math.min(
                distanceMatrix[j][i - 1] + 1, // deletion
                distanceMatrix[j - 1][i] + 1, // insertion
                distanceMatrix[j - 1][i - 1] + indicator, // substitution
            );
        }
    }

    return distanceMatrix[b.length][a.length];
}

let union = function (array1, array2) {
    for (var o of array2) {
        if (array1.indexOf(o) < 0) array1.push(o);
    }
    return array1;
}
class Token {
    constructor(token, metadata) {
        this.token = token;
        this.metadata = metadata || {};
    }

    update(fn) {
        var out = fn(this.token, this.metadata);
        if (Array.isArray(out) && out.length == 2) {
            this.token = out[0];
            this.metadata = {
                ... this.metadata,
                ...out[1]
            };
            return this;
        }
        this.token = out;
        return this;
    }
    getPosition() {
        if (this.metadata.start && this.metadata.end) return [this.metadata.start, this.metadata.end];
        return null;
    }

    toString() {
        return this.token;
    }
    term() {
        return this.toString();
    }
}

class Field {

    termFrequency(term) {
        return this._tf[term];
    }

    hasToken(term) {
        return this._idf[term] > 0 ? true : false;
    }

    allTokens() {
        return Object.keys(this._terms).map((term) => {
            return {
                term: term,
                tf: this._tf[term],
                terms: this._terms[term],
                idf: this._idf[term],
                norm: this._flnorm,
                documents: Object.keys(this._tf[term] || {})
            }
        });
    }
    getToken(term) {
        if (!this._idf[term]) return null;
        return {
            term: term,
            tf: this._tf[term],
            idf: this._idf[term],
            norm: this._flnorm,
            documents: Object.keys(this._tf[term] || {})
        };
    }
    setToken(term, documents) {
        var docIdsChanged = [];
        for (var [docId, options] of Object.entries(documents)) {
            var tf = options.tf;
            var ct = Math.pow(tf, 2);
            if (ct < 1) {
                // Token counts as deleted for this document
                delete this._terms[term][docId];
                delete this._tf[term][docId];
                if (docIdsChanged.indexOf(docId) < 0) docIdsChanged.push(docId);
                continue;
            }
            if (!this._terms[term]) this._terms[term] = {};
            this._terms[term][docId] = {
                positions: options.positions || [],
                total: ct
            };
            if (!this._tf[term]) this._tf[term] = {};
            this._tf[term][docId] = tf;
            if (this._ids.indexOf(docId) < 0) this._ids.push(docId);
        }
        this.recalculateIDF();
    }
    terms(query) {
        var matchingDocs = {};
        var fuzz = query.fuzziness || 0;
        query.terms.forEach((term) => {
            if (term instanceof RegExp) {
                var terms = Object.keys(this._terms);
                terms.filter((idxTerm) => term.test(idxTerm)).map( (matchedTerm) => {
                    var ids = Object.keys(this._terms[matchedTerm]);
                    (query.docs ? ids.filter((i) => query.docs.indexOf(i) >= 0) : ids).forEach((i) => {
                        if (!matchingDocs[i]) matchingDocs[i] = [];
                        matchingDocs[i].push({
                            ref: i,
                            positions: this._terms[matchedTerm][i].positions,
                            tf: this._tf[matchedTerm][i],
                            idf: this._idf[matchedTerm],
                            norm: this._flnorm
                        });
                    });
                });
            }
            else if (fuzz === 0 && this._terms[term]) {
                var ids = Object.keys(this._terms[term]);
                (query.docs ? ids.filter((i) => query.docs.indexOf(i) >= 0) : ids).forEach((i) => {
                    if (!matchingDocs[i]) matchingDocs[i] = [];
                    matchingDocs[i].push({
                        ref: i,
                        positions: this._terms[term][i].positions,
                        tf: this._tf[term][i],
                        idf: this._idf[term],
                        norm: this._flnorm
                    });
                });
            }
            if (fuzz > 0) {
                for (var o of Object.keys(this._terms)) {
                    if (levenshteinDistance(o, term) <= fuzz) {
                        var ids = Object.keys(this._terms[o]);
                        (query.docs ? ids.filter((i) => query.docs.indexOf(i) >= 0) : ids).forEach((i) => {
                            if (!matchingDocs[i]) matchingDocs[i] = [];
                            matchingDocs[i].push({
                                ref: i,
                                positions: this._terms[o][i].positions,
                                tf: this._tf[o][i],
                                idf: this._idf[o],
                                norm: this._flnorm
                            });
                        });
                    }
                }
            }
        });
        return matchingDocs;
    }

    constructor(options) {
        if (options.pipeline) this.setPipeline(options.pipeline);
        this.storePositions = options.storePositions || false;
        this._terms = {}; // done
        this._documents = {};
        if (options.storeDocuments) {
            this._store = true;
        }
        this._tf = {}; // done
        this._idf = {}; // done
        this._flnorm = 1; // done
        this._ids = []; // done
    }

    toJSON() {
        return {
            pipeline: this.pipeline,
            store: {
                positions: this.storePositions,
                documents: this._store
            }
        }
    }
    all() {
        return this._ids;
    }

    update(documents) {
        var modified = [];
        var toRemove = documents.filter((doc) => this._ids.indexOf(doc.id) >= 0).map((doc) => doc.id);
        return union(union([], this.remove(toRemove)), this.add(documents))
    }

    recalculateIDF() {
        this._flnorm = 1 / Math.sqrt(Object.keys(this._terms).length);
        // Quick calculation so we don't have to do it every time
        Object.keys(this._terms).forEach((token) => {
            this._idf[token] = 1 + Math.log10(this._ids.length / (Object.keys(this._terms[token]).length + 1))
        });
    }
    add(documents) {
        var updated = [];
        for (var o of documents) {
            if (this._ids.indexOf(o.id) >= 0) throw Error(`Document id ${o.id} already exists in the index`);
            updated.push(o.id);
            if (this._store) this._documents[o.id] = o.content;
            this._ids.push(o.id);
            var tokens = this.pipeline.run(o.content);
            if (!Array.isArray(tokens)) tokens = [tokens];
            tokens.forEach((token) => {
                if (typeof token === "string") {
                    token = new Token(token);
                }
                var term = token.toString();
                if (!this._terms[term]) this._terms[term] = {};
                if (!this._terms[term][o.id]) this._terms[term][o.id] = {
                    positions: [],
                    total: 0
                };
                if (token instanceof Token) {
                    var position = token.getPosition();
                    if (position) this._terms[term][o.id].positions.push(position);
                }
                this._terms[term][o.id].total++;
                if (!this._tf[term]) this._tf[term] = {};
                this._tf[term][o.id] = Math.sqrt(this._terms[term][o.id].total);
            });
        }
        this.recalculateIDF();
        return updated;
    }

    remove(ids) {
        var updated = [];
        ids.forEach((id) => {
            if (this._documents[id]) {
                updated.push(id);
            }
            delete this._documents[id];
            var inIdPos = this._ids.indexOf(id);
            if (inIdPos >= 0) this._ids.splice(inIdPos, 1);
            for (var o of Object.keys(this._terms)) {
                if (this._terms[o][id]) {
                    delete this._terms[o][id];
                    delete this._tf[o][id];
                    if (Object.keys(this._terms[o]).length === 0) {
                        delete this._terms[o];
                        delete this._tf[o];
                        delete this._idf[o];
                    }
                }
            }
        });
        this.recalculateIDF();
        return updated;
    }

    setPipeline(pipeline) {
        this.pipeline = pipeline;
    }

    analyze(str) {
        return this.pipeline.run(str);
    }
}

class DocumentStore {

    constructor(idx) {
        this.inner = idx;
        this.length = 0;
    }

    size() {
        return this.length;
    }

    updateLength() {
        this.length = this.inner.getFields().map((field) => {

            var o = this.inner.getField(field)._ids.length;
            return o;
        }).reduce((prev, d) => d > prev ? d : prev, 0);
    }
}

class Index extends IdxInterface {

    constructor(options) {
        super(options);
        this._fields = options.fields || {};
        this._ref = options._ref || 'id';
        this.emitter = options.emitter;
        this.storePositions = options.storePositions || false;
        this.storeDocuments = options.storeDocuments || false;
        this._fields[this._ref] = new Field({
            pipeline: {
                run: function (str) { return [str]; }
            }
        });
        this.documentStore = new DocumentStore(this);
        this.pipeline = options.pipeline;
    }

    _load(idxData) {
        var fieldMap = [];
        // Create the fields
        idxData.fields.forEach((field) => {
            fieldMap.push(field.name);
            this.addField(
                field.name,
                field.settings || {}
            );
        });
        Object.entries(idxData.index).forEach(([term, occurences]) => {
            occurences.forEach((record) => {
                var field = fieldMap[record[0]];
                var reconstructed = {};
                Object.entries(record[1].tf).forEach( ([docID, tf]) => {
                    if (!reconstructed[docID]) reconstructed[docID] = {};
                    reconstructed[docID].tf = tf;
                });
                Object.entries(record[1].p).forEach( ([docID, info]) => {
                    if (!reconstructed[docID]) reconstructed[docID] = {};
                    if (info.positions) reconstructed[docID].positions = info.positions
                });
                this.getField(field).setToken(term, reconstructed);
            })
        });
    }
    _legacyLoad(idxData) {
        // The "save" flag that we use as storeDocuments is in an awkward place
        let saveDocs = idxData.documentStore.save || false;

        // Pipeline? Set it in the idx
        if (idxData && idxData.pipeline) {
            this.pipeline = idxData.pipeline;
        }
        // First, we create the fields
        idxData.fields.forEach((field) => {
            this.addField(field.name, {
                storeDocuments: saveDocs
            })
        });

        if (idxData.ref !== "id") {
            this.newRef(idxData.ref);
        }

        // From here, we reimport the TF/IDF for all terms
        var recurseTerm = (field, rootTerm, settings) => {
            var branches = Object.keys(settings);
            for (var o of branches) {
                if (o == "df") continue;
                if (o === "docs") {
                    for (var [docId, records] of Object.entries(settings[o])) {
                        field.setToken(rootTerm, {
                            tf: records.tf
                        });
                    }
                    continue;
                }
                recurseTerm(field, rootTerm + o, settings[o]);
            }
        };
        for (var [field, entries] of Object.entries(idxData.index)) {
            if (!entries.root) continue;
            recurseTerm(this._fields[field], "", entries.root);
        }

    }

    getFields() {
        return Object.keys(this._fields);
    }

    toJSON() {
        var fieldRef = [];
        var fields = [];
        var idxJson = {};

        Object.entries(this._fields).forEach(([fieldName, field]) => {
            fieldRef.push({
                name: fieldName,
                settings: field.toJSON()
            });
            var fieldID = fieldRef.length-1;
            field.allTokens().forEach((term) => {
                if (!idxJson[term.term]) idxJson[term.term] = [];
                idxJson[term.term].push([fieldID, {tf: term.tf, idf: term.idf, p: term.terms}])
            });
        });

        return {
            fields: fieldRef,
            ref: this._ref,
            index: idxJson,
            pipeline: this.pipeline.toJSON(),
            version: '1.0.0'
        }
    }

    getRef() {
        return this._ref;
    }

    update(documents, muteEvent) {
        var docs = {};
        var updatedIds = [];
        // Break down in chunks
        documents.forEach((doc) => {
            // Get keys
            var id = doc[this._ref];
            Object.entries(doc).forEach(([key, content]) => {
                if (this._fields[key]) {
                    updatedIds = union(updatedIds, this._fields[key].update([{
                        id: id,
                        content: content
                    }]));
                }
            })
        });
        if (this.emitter && muteEvent !== false) {
            documents.filter((doc) => updatedIds.indexOf(doc[this._ref]) >= 0).map((doc) => this.emitter.emit('update', doc, this));
        }
        this.documentStore.updateLength();
        return true;
    }
    add(documents, muteEvent) {
        var docs = {};
        var updatedIds = [];
        // Break down in chunks
        documents.forEach((doc) => {
            // Get keys
            var id = doc[this._ref];
            Object.entries(doc).forEach(([key, content]) => {
                if (this._fields[key]) {
                    updatedIds = union(updatedIds, this._fields[key].add([{
                        id: id,
                        content: content
                    }]));
                }
            })
        });
        if (this.emitter && muteEvent !== false) {
            documents.filter((doc) => updatedIds.indexOf(doc[this._ref]) >= 0).map((doc) => this.emitter.emit('add', doc, this));
        }
        this.documentStore.updateLength();
        return true;
    }

    reindex() {
        /* return this.fields().then((field) => {
            let fObj = this.getField(field);
            fObj.add(Object.values(fObj._documents))
        }); */
    }

    remove(docIDs, muteEvent) {
        var updatedIds = Object.values(this._fields).reduce((updatedIds, field) => union(updatedIds, field.remove(docIDs)), []);
        if (this.emitter && muteEvent !== false) {
            updatedIds.forEach((doc) => this.emitter.emit("remove", doc, this));
        }
        this.documentStore.updateLength();
        return true;
    }

    addField(field, options) {
        var fieldOptions = {};
        options = options || {};
        fieldOptions.pipeline = options.pipeline || this.pipeline;
        fieldOptions.storeDocuments = options.storeDocuments || this.storeDocuments;
        fieldOptions.storePositions = true;
        this._fields[field] = new Field(fieldOptions);
        return this;
    }

    getField(field) {
        return this._fields[field];
    }

    removeField(field) {
        delete this._fields[field];
    }

    setRef(field) {
        if (!this._fields[field]) {
            return reject(Error(`Unknown field ${field}`));
        }
        this._ref = field;
        return this.reindex();
    }
    newRef(field) {
        this.removeField(this._ref);
        this._fields[field] = new Field({
            pipeline: {
                run: function (str) { return [str]; }
            }
        });
        this.setRef(field);
    }

    all() {
        return this._fields[this._ref].all();
    }

    analyze(field, str) {
        return this._fields[field].analyze(str);
    }

    terms(query) {
        return this._fields[query.field].terms(query);
    }
}

export { Index, Field, Token };
/* export default function(elasticlunr) {
    elasticlunr.index.register('1.0.0', function(config) {
        return new Idx(elasticlunr);
    });
}; */