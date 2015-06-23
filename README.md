# すぱせお - spaseo

`spaseo` means `Single Page Application Search Engine Optimization`.


## Installation

```
npm i spaseo -S
```
For server and browser(`require` available environment e.g. Webpack Browserify)

or

```
bower i spaseo -S
```
just for browser.


## client
* add `<script>` tag and `window.spaseo` is available
* `var spaseo = require(spaso);`

### spaseo() => cb
Returns callback. Calling callback, spaseo tells PhantomJs on server "HTML IS REDEAY TO RENDER!"


## server
### spaseo(targetBaseUrl[, timeout[, logging]])

* `targetBaseUrl` should include protcol and host like
  `http://localhost:8080` or `http://example.com`

  NOTE: spaseo doesn't remove trailing slash

* `timeout`(default:`3000`) Waiting period from `var cb = spaseo();` to `cb()`. when provided falsy value, set timeout default.

* `logging`(default:`undefined`) whether to put log.

## Usage
Work well with `forever`.
```
# seo-server.js
require('spaseo')('http://example.com').listen(9999);
```

```
# start on your shell
$ forever start seo-server.js
```


```
# nginx.conf
location / {
    if ($args ~ _escaped_fragment_) {
        proxy_pass http://localhost:9999;
    }
    index /index.html;
    try_files $uri /index.html = 404;
}
```

## NOTE

* Don't forget add `<meta name="fragment" content="!">`.


* Can not use url like this `http://example.com/#!/path/to?q1=123&q2=abc`.
  See the section "Role of the Search Engine Crawler" of
  https://developers.google.com/webmasters/ajax-crawling/docs/specification

  To sum it all up, shebang mode may not work(use html5Mode).


## example
Clone this repo and run
```
npm run example
```
and open `http://localhost:8080`.


## license
MIT
