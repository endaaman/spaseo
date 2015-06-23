#!/bin/bash
node_modules/forever/bin/forever start example/seo-server.js

bash example/start-nginx.sh

node_modules/forever/bin/forever stop example/seo-server.js
