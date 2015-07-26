# すぱせお.js - spaseo.js

`spaseo` means `Single Page Application Search Engine Optimization`.
[pronounce](http://static.endaaman.me/spaseo.mp3)


## What is すぱせお.js
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
the former provides html with no contents, but the latter with some contents. This is the power of `spaseo.js`


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
```
function(callback) {
    setTimeout(function() {
        callback()
    }, 0);
};
```
This is useful if using a library in which the moment that HTML is fully rendered comes in peculiar callback. An example with Vue.js

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
Just tell the server html is ready to render.


## On server - API
### spaseo(config)

* `config.port` (default: `9999`)

* `config.baseUrl` (default: `'http://' + request.header.host + prettfiedUrl`)

  This should include protcol and host like `http://localhost:8080` or `http://example.com`. `spaseo.js` simply joins provided `baseUrl` and path(loaded from from HTTP header). And, **Please know that `spaseo.js` doesn't remove trailing slash.**

  If not specified, getting request, `spaseo.js` checks `host` of HTTP header and joins `protcol`, `host` and `path` like `'http://' + request.header.host + prettfiedUrl`.

  ** To omit this option, put `proxy_set_header Host $http_host;` on your `nginx.conf`.**

* `config.timeout`(default:`7000`)

  duration of period from `var cb = spaseo();` to `cb()`. When provided falsy value, uses default.


* `config.cushionDuration`(default:`500`)

  Waiting duration for `spaseo()` called. Not called `spaseo()` on client, spaseo renders html immediately. Taking this longtime increases reliability of rendering html completely, but minimum response time becomes just `cushionDuration`. Be chariness if you set this option.


* `config.verbose`(default:`undefined`) whether to put log.


## On server - CLI
```
spaseo --port <port> --url <url> --timeout <timeout> --verbose
```
* `--port` for `config.port`
* `--url` for `config.baseUrl`
* `--timeout` for `config.timeout`
* `--verbose` for `config.verbose`
* `--cushion` for `config.cushionDuration`
* `--help` may help you

do
```
./node_modules/spaseo.js/bin/spaseo -v
```
or if globally installed
```
spaseo -p 4545 -u http://example.com
```



## NOTICE
* Not supprting `https`.
* Don't forget add `<meta name="fragment" content="!">`.
* Can not use url like this `http://example.com/#!/path/to?q1=123&q2=abc`.
  See the section "Role of the Search Engine Crawler" of
  https://developers.google.com/webmasters/ajax-crawling/docs/specification
  To sum it all up, shebang mode may not work(use html5Mode).
* Works well with [`pm2`](https://github.com/Unitech/pm2) or [`forever`](https://github.com/foreverjs/forever).

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

This is usual setting for Single Page App with `spaseo.js`. Getting request with `?_escaped_fragment_` or `User-Agent` including `googlebot` or `yahoo`, passing to `spaseo` server listening `http://localhost:6557`.


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
Then try `curl http://localhost:8080` and `curl http://localhost:8080?_escaped_fragment_` or `curl http://localhost:8080 -A Googlebot`

Enjoy!

## license
MIT
