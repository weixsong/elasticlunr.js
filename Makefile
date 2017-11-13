
SRC = lib/elasticlunr.js \
	lib/utils.js \
	lib/event_emitter.js \
	lib/tokenizer.js \
	lib/pipeline.js \
	lib/index.js \
	lib/document_store.js \
	lib/stemmer.js \
	lib/stop_word_filter.js \
	lib/trimmer.js \
	lib/inverted_index.js \
	lib/configuration.js \
	lib/sorted_set.js

YEAR = $(shell date +%Y)
VERSION = $(shell cat VERSION)

SERVER_PORT ?= 3000
TEST_PORT ?= 32423

DOXX ?= ./node_modules/.bin/doxx
NODE ?= /usr/bin/node
NPM ?= /usr/bin/npm
PHANTOMJS ?= ./node_modules/.bin/phantomjs
UGLIFYJS ?= ./node_modules/.bin/uglifyjs

all: node_modules elasticlunr.js elasticlunr.npm.js elasticlunr.min.js docs bower.json package.json component.json example

elasticlunr.js: $(SRC)
	cat build/wrapper_start $^ build/wrapper_end | \
	sed "s/@YEAR/${YEAR}/" | \
	sed "s/@VERSION/${VERSION}/" > $@
	cp $@ ./release/
	cp $@ ./example/

elasticlunr.min.js: $(SRC)
	cat build/wrapper_start $^ build/wrapper_end | \
	sed "s/@YEAR/${YEAR}/" | \
	sed "s/@VERSION/${VERSION}/" | \
	${UGLIFYJS} --compress --mangle --comments > $@
	cp $@ ./release/
	cp $@ ./example/

elasticlunr.npm.js: elasticlunr.js
	sed -e 's/^\/\/ only used this to make elasticlunr.js.*/\/\/Removed global lunr definition for npm version/' \
		-e '/^\/\/ this is a trick to define a global/d' \
		-e 's/^lunr *= *elasticlunr;/var lunr = elasticlunr;/' elasticlunr.js > $@
	cp $@ ./release

%.json: build/%.json.template
	cat $< | sed "s/@VERSION/${VERSION}/" > $@

size: elasticlunr.min.js
	@gzip -c elasticlunr.min.js | wc -c

server:
	${NODE} server.js ${SERVER_PORT}

test: node_modules
	@./test/runner.sh ${TEST_PORT}

docs: node_modules
	${DOXX} --source lib --target docs

clean:
	rm -f elasticlunr.js
	rm -f elasticlunr.min.js
	rm -f *.json
	rm -f example/example_index.json
	rm -rf docs/*

clean_modules:
	rm -rf node_modules

reset:
	git checkout elasticlunr.* *.json docs/index.html example/example_index.json

example: elasticlunr.min.js
	${NODE} example/index_builder.js

node_modules: package.json
	${NPM} -s install

.PHONY: test clean docs reset example
