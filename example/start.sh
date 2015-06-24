#!/bin/bash

nohup bin/spaseo -v -p 9999 > example/spaseo.log 2>&1&
echo $! > example/spaseo.pid

cwd="$(cd "$(dirname "${BASH_SOURCE:-$0}")"; pwd)"
echo 'access to http://localhost:8080'
nginx -c $cwd/nginx.conf -p $cwd/

kill -9 `cat example/spaseo.pid` 2>&1&
rm example/spaseo.pid
