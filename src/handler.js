(function(){
'use strict';

var pjson = require('../package.json');
var prettify = require('./prettify');
var evalPage = require('./evalPage');

function isString(s) {
  return typeof s === 'string' || s instanceof String
}


module.exports = function(c) {
  if (!c) {
    c = {};
  }
  var config = {};
  config.baseUrl = c.baseUrl || null;
  config.timeoutDuration = parseInt(c.timeoutDuration) || 10000;
  config.cushionDuration = parseInt(c.cushionDuration) || 1000;
  config.verbose = !!c.verbose;

  function $log(line) {
    if (config.verbose) console.log(line);
  }

  function end(response, body, type) {
    if (!type) {
      type = 'text/html';
    }
    response.setHeader('Content-Type', type);
    response.writeHead(200, {});
    response.write(body);
    response.end();
  }

  function buildError(message) {
    var m
    if (Array.isArray(message)) {
      m = message.join('');
    } else {
      m = message
    }
    return JSON.stringify({
      name: pjson.name,
      version: pjson.version,
      config: config,
      message: m
    });
  }

  function getPortOfHost(request) {
    var ret = /:(.*)/.exec(request.headers.host);
    if (ret) {
      return parseInt(ret[1]);
    } else {
      return null;
    }
  }

  return function(request, response) {
    var serverPort = parseInt(this._connectionKey.split(':')[2]);
    var usingUnixSocket = !!(serverPort && serverPort < 0);

    if (!config.baseUrl && !usingUnixSocket) {
      var requestedPort = getPortOfHost(request);

      if (requestedPort && requestedPort > 0 && requestedPort === serverPort) {
        end(response, buildError([
          'Missing host to open using PhantomJS. ',
          'Fill `baseUrl` option or set correct host of HTTP header. ',
          'If you are using nginx proxy, ',
          '`proxy_set_header Host $http_host` will may help you.'
        ]), 'application/json');
        $log('Got Request without `Host:` of HTTP header or `baseUrl` option.');
        return ;
      }
    }

    var targetBaseUrl = config.baseUrl || 'http://' + request.headers.host;
    var rawUrl = targetBaseUrl + request.url;
    var prettifiedUrl = prettify(rawUrl);
    var targetUrl = prettifiedUrl || rawUrl;

    evalPage(targetUrl, config, function(html) {
      end(response, html);
    });
  };
}

})();
