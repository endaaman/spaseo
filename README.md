# すぱせお.js - spaseo.js

`spaseo` means `Single Page Application Search Engine Optimization`.
[pronounce](http://static.endaaman.me/spaseo.mp3)


## What is spaseo.js
`spaseo.js` solves SEO problem of single page apps by prerendering HTML using PhantomJS.

Just try
```
curl http://endaaman.me
```
and
```
curl http://endaaman.me?_escaped_fragment_
```
or
```
curl http://endaaman.me -A Googlebot
```
the former provides html with no contents, but the latters does with some contents. This is the power of `spaseo.js`


## Installation

```
npm i spaseo.js -S
```

## Browser

### spaseo() => callback
Called, this tell the server to wait for `callback`.

### spaseo.wrap(wrapper)
Default is
```js
function(callback) {
    setTimeout(function() {
        callback()
    }, 0);
};
```
This is useful if using a library in which the moment that HTML is fully rendered comes in peculiar callback. An example with Vue.js below.

```coffee
Vue = require 'vue'
spaseo = require 'spaseo.js'
spaseo.wrap (cb)->
    Vue.nextTick ->
        cb()

request = require 'superagent'
new Vue
    data:
        items: []
    created: ->
        cb = spaseo()
        request.get '/api/items'
        .end (err, res)=>
            @$set 'items', res.body
            cb()
```

### callback() (<= spaseo())
Just notify the server that html is ready to render.


## API
### spaseo(config)

returns handler for built-in `http` module.

* `config.baseUrl` (default: `'http://' + request.headers.host`)

  This should include protocol and host like `http://localhost:8080` or `http://example.com`. `spaseo.js` makes an url by simply joining `baseUrl` and path(loaded from from HTTP header) to target url, opens the url using PhantomJS, and renders the generated full HTML.

  If `config.baseUrl` is not specified, `spaseo.js` checks `Host` of HTTP header and set `baseUrl` by joining it with `protcol`.

  To omit this option, put `proxy_set_header Host $http_host;` on your `nginx.conf`.

* `config.timeoutDuration`(default:`10000`)

  duration of period from `var cb = spaseo();` to `cb()`. If you provide falsy value, uses default.


* `config.cushionDuration`(default:`1000`)

  Waiting duration for `spaseo()` called. If `spaseo()` is not called on client, spaseo renders html immediately(in the `page.evaluate` of PhantomJS). Taking this longtime increases reliability of rendering html completely, but minimum response time becomes just `cushionDuration`.
  Be chariness if you set this option.


* `config.verbose`(default:`undefined`) whether to put log.



## CLI
You can quickly boot `spaseo.js` server.

```
spaseo --port <port> --url <url> --timeout <timeout> --verbose
```
* `--port`(`-p`) port to listen to
* `--socket`(`-s`) unix domain socket do listen to
* `--url`(`-u`) for `config.baseUrl`
* `--timeout`(`-t`) for `config.timeout`
* `--cushion`(`-c`) for `config.cushionDuration`
* `--verbose`(`-v`) for `config.verbose`
* `--help`(`-h`) may help you

`spaseo.js` places `--port` above `--socket`.



## NOTICE
* Url including search query and hash like `http://example.com/#!/path?q=123` may not work.
  See the section "Role of the Search Engine Crawler" of
  https://developers.google.com/webmasters/ajax-crawling/docs/specification.

## Example

### Prepare spaseo server
Write script starting spaseo server

```js
// seo.js

var http = require('http');

var handler = require('../spaseo')({
  timeoutDuration: 15000,
  cushionDuration: 3000
});

http
.createServer(handler)
.listen(6557);
```

and run

```
pm2 start seo.js
```
or
```
forver start seo.js
```

### Write nginx.conf
```
upstream spaseo {
    server localhost:6557;
}
server {
    listen 80;
    server_name example.com;
    proxy_set_header Host $http_host;
    location / {
        index /index.html;
        try_files $uri @fallback;
        expires 15m;
    }
    location @fallback {
        if ($args ~ _escaped_fragment_) {
            proxy_pass http://spaseo;
        }
        if ($http_user_agent ~* "googlebot|yahoo") {
            proxy_pass http://spaseo;
        }
        try_files /index.html = 404;
    }
}
```

This is usual setting for a single page app with `spaseo.js`. Getting request with `?_escaped_fragment_` or `User-Agent` including `googlebot` or `yahoo`, pass to `spaseo` server listening on `http://localhost:6557`.


### Now SEO is ready
checking
```
curl http://example.com?_escaped_fragment_
```
or
```
curl http://example.com -A Googlebot
```

### Quick hands on
Clone this repo and run
```
npm run example
```
Then do `curl http://localhost:8080`, `curl http://localhost:8080?_escaped_fragment_` and `curl http://localhost:8080 -A Googlebot`

## license
MIT
