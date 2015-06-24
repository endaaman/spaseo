# すぱせお.js - spaseo.js

`spaseo` means `Single Page Application Search Engine Optimization`.
[pronounce](https://raw.githubusercontent.com/endaaman/spaseo/master/misc/spaseo.mp3)


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

the former provides html with no contents, but the latter with some contents. This is power of `spaseo.js`



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

```
var spaseo = require(spaseo);
```

### spaseo() => cb
On `spaseo()` called, PhantomJS starts waiting for `cb()`. Returned callback tells `spaseo` of server "HTML is ready to render".


## On server - API
### spaseo([port[, targetBaseUrl[, timeout[, logging]]]])

* `port`(default: `9999`)

* `targetBaseUrl`(default: `'http://' + request.header.host + prettfiedUrl`)

  This should include protcol and host like `http://localhost:8080` or `http://example.com`. `spaseo.js` simply joins provided `targetBaseUrl` and path of HTTP header. (**`spaseo.js` doesn't remove trailing slash**)

  If not specified, getting request, `spaseo.js` checks `host` of HTTP header and joins `protcol`, `host` and `path` like `'http://' + request.header.host + prettfiedUrl`, then open the page using PhantomJS.

  ** To omit this option, put `proxy_set_header Host $http_host;` on your `nginx.conf`.**

* `timeout`(default:`7000`)

  duration of period from `var cb = spaseo();` to `cb()`. When provided falsy value, uses default.

* `logging`(default:`undefined`) whether to put log.


## On server - CLI
```
./node_modules/spaseo.js/bin/spaseo --url http://example.com --port 4545 --verbose
```

If globally installed, can run
```
spaseo -p 4545
```


## NOTICE

* Don't forget add `<meta name="fragment" content="!">`.
* Can not use url like this `http://example.com/#!/path/to?q1=123&q2=abc`.
  See the section "Role of the Search Engine Crawler" of
  https://developers.google.com/webmasters/ajax-crawling/docs/specification
  To sum it all up, shebang mode may not work(use html5Mode).

* Works well with [`pm2`](https://github.com/Unitech/pm2) or [`forever`](https://github.com/foreverjs/forever).


## example
See [example](https://github.com/endaaman/spaseo.js/tree/master/example). To try this, clone this repo and run
```
npm run example
```
Then try `curl http://localhost:8080` and `curl http://localhost:8080?_escaped_fragment_`.

Or, my personal homepage([endaaman.me](http://endaaman.me)) uses `spaseo.js`. source code available on [here](https://github.com/endaaman/enda)

## license
MIT
