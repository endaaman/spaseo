#!/bin/bash

cwd="$(cd "$(dirname "${BASH_SOURCE:-$0}")"; pwd)"
nginx -c $cwd/nginx.conf -p $cwd/
