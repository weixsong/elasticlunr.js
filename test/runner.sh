#!/usr/bin/env bash

NODE=/usr/local/bin/node
PHANTOMJS=./node_modules/.bin/phantomjs
SERVER_PORT=${1:-54545}

echo "Starting test server at http://localhost:$SERVER_PORT"
$PHANTOMJS ./test/env/runner.js "http://localhost:$SERVER_PORT/test"
