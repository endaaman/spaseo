#!/bin/bash
cwd="$(cd "$(dirname "${BASH_SOURCE:-$0}")"; pwd)"

trap 'kill $(jobs -p)' EXIT
bin/spaseo -v -p 9999 > $cwd/spaseo.log &
nginx -c $cwd/nginx.conf -p $cwd/ &

prefix='[spaseo.js] '
echo $prefix'Welcome to example of spaseo.js'
echo $prefix'Now started servers'
echo $prefix'nginx : http://localhost:8080'
echo $prefix'spaseo: http://localhost:9999'
echo $prefix'See spaseo log'
echo $prefix'$ less +F example/spaseo.log'
echo $prefix'check rendered result'
echo $prefix'$ curl http://localhost:8080'
echo $prefix'$ curl http://localhost:8080?_escaped_fragment_'
echo $prefix'$ curl http://localhost:8080 -A googlebot'
echo $prefix'Check rendered result'
echo $prefix'To stop this type `Ctrl+C`..'

wait `jobs -l %2| awk '{print $2}'`
