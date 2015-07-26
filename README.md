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
### npm
Available both for server and browser(use Webpack or Browserify)
```
npm i spaseo.js -S
```

### bower
Only for browser
```
bower i spaseo.js -S
```


## On browser

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
# setting phase
Vue = require 'vue'
spaseo = require 'spaseo.js'
spaseo.wrap (cb)->
    Vue.nextTick ->
        cb()


# implementation
request = require 'superagent'
~~ = Vue.extend
    template: ~~
    data: ->
        items: []
    attached: ->
        cb = spaseo()
        request.get '/api/items'
        .end (err, res)=>
            @items = res.body
            cb()
```

### callback() (<= spaseo())
Just notify the server that html is ready to render.


## API
### spaseo(config)

* `config.port` (default: `9999`)


* `config.baseUrl` (default: `'http://' + request.header.host + prettfiedUrl`)

  This should include protcol and host like `http://localhost:8080` or `http://example.com`. `spaseo.js` simply joins provided `baseUrl` and path(loaded from from HTTP header).

  If not specified, `spaseo.js` checks `host` of HTTP header and joins `protcol`, `host` and `path`(if shebang mode, spaseo store ugly url and replac with it) like `'http://' + request.header.host + path`.

  To omit this option, put `proxy_set_header Host $http_host;` on your `nginx.conf`.

* `config.timeout`(default:`7000`)

  duration of period from `var cb = spaseo();` to `cb()`. If you provide falsy value, uses default.


* `config.cushionDuration`(default:`500`)

  Waiting duration for `spaseo()` called. If `spaseo()` is not called on client, spaseo renders html immediately. Taking this longtime increases reliability of rendering html completely, but minimum response time becomes just `cushionDuration`. Be chariness if you set this option.


* `config.verbose`(default:`undefined`) whether to put log.


## CLI
```
spaseo --port <port> --url <url> --timeout <timeout> --verbose
```
* `--port`(`-p`) for `config.port`
* `--url`(`-u`) for `config.baseUrl`
* `--timeout`(`-t`) for `config.timeout`
* `--verbose`(`-v`) for `config.verbose`
* `--cushion`(`-c`) for `config.cushionDuration`
* `--help`(`-h`) may help you

do
```
./node_modules/spaseo.js/bin/spaseo -v
```
or if globally installed
```
spaseo -p 4545 -u http://example.com
```


## NOTICE
* spaseo doesn't support `https`.
* Don't forget add `<meta name="fragment" content="!">`.
* Url including search query and hash like `http://example.com/#!/path?q=123` may not work.
  See the section "Role of the Search Engine Crawler" of
  https://developers.google.com/webmasters/ajax-crawling/docs/specification.

* Works well with [`pm2`](https://github.com/Unitech/pm2) and [`forever`](https://github.com/foreverjs/forever).

## Example

### Booting spaseo server
Write script starting spaseo server
```
// seo.js
require('spaseo.js')({
    port: 6557,
    timeout: 100000
});
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
