# すぱせお.js - spaseo.js

`spaseo` means `Single Page Application Search Engine Optimization`.

[pronounce](https://raw.githubusercontent.com/endaaman/spaseo/master/misc/spaseo.mp3)

## Installation

```
npm i spaseo -S
```
Available both for server and browser(e.g. Webpack Browserify)


## On browser

```
var spaseo = require(spaseo);
```

### spaseo() => cb
On `spaseo()` called, PhantomJS starts waiting for `cb()` is called. Returned callback tells PhantomJS "HTML is ready to render.".


## On server - API
### spaseo(targetBaseUrl[, timeout[, logging]])

* `targetBaseUrl` should include protcol and host like
  `http://localhost:8080` or `http://example.com`

  NOTICE: spaseo doesn't remove trailing slash

* `timeout`(default:`3000`) Waiting duraion from `var cb = spaseo();` to `cb()`. when provided falsy value, set timeout default.

* `logging`(default:`undefined`) whether to put log.

## On server - CLI
```
./node_modules/spaseo.js/bin/spaseo -u http://example.com -p 9999
```
If globally installed, just run
```
spaseo -u http://example.com -p 9999
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
Then access to `http://localhost:8080`.

Or, my personal homepage [source code(https://github.com/endaaman/enda)](https://github.com/endaaman/enda)

## license
MIT
