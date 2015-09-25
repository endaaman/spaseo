var pjson = require('../package.json');
var prettify = require('./prettify');
var evalPage = require('./evalPage');
var u = require('./util');

function isString(s) {
  return typeof s === 'string' || s instanceof String
}

module.exports = function(c) {
  if (!c) {
    c = {};
  }
  var config= {};
  config.baseUrl = c.baseUrl || null;
  config.timeoutDuration = parseInt(c.timeoutDuration) || 10000;
  config.cushionDuration = parseInt(c.cushionDuration) || 1000;
  config.verbose = !!c.verbose;
  // set config
  require('./config')(config);

  var $log = u.$log;

  function end(response, data) {
    if (!data.type) {
      data.type = 'text/html';
    }
    if (!data.status) {
      data.status = 200;
    }
    if (!data.body) {
      data.body = '';
      data.status = 204;
    }
    response.setHeader('Content-Type', data.type);
    response.writeHead(data.status, {});
    response.write(data.body);
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
        end(response, {
          body: buildError([
            'Missing host to open using PhantomJS. ',
            'Fill `baseUrl` option or set correct host of HTTP header. ',
            'If you are using nginx proxy, ',
            '`proxy_set_header Host $http_host` will may help you.'
          ]),
          type: 'application/json'
        });
        $log('Got Request without `Host:` of HTTP header or `baseUrl` option.');
        return ;
      }
    }

    var targetBaseUrl = config.baseUrl || 'http://' + request.headers.host;
    var rawUrl = targetBaseUrl + request.url;
    var prettifiedUrl = prettify(rawUrl);
    var targetUrl = prettifiedUrl || rawUrl;

    evalPage(targetUrl, function(html, status) {
      end(response, {
        body: html,
        status: status
      });
    });
  };
}
