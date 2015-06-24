(function() {
  var url = require('url');
  var querystring = require('querystring');

  module.exports = function(uglyUrl) {
    var oldUrlObj = url.parse(uglyUrl);
    var queryObj = querystring.parse(oldUrlObj.query);
    var escapedFragment = ''
    if (queryObj['_escaped_fragment_'] != null) {
      if (queryObj._escaped_fragment_) {
        escapedFragment = '#!' + queryObj._escaped_fragment_;
      }
      delete queryObj['_escaped_fragment_'];
    } else {
      return null;
    }
    newUrlObj = {
      protocol: oldUrlObj.protocol,
      slash: oldUrlObj.slash,
      host: oldUrlObj.host,
      port: oldUrlObj.port,
      hostname: oldUrlObj.hostname,
      hash: escapedFragment,
      query: queryObj,
      pathname: oldUrlObj.pathname
    };
    return url.format(newUrlObj);
  };
})();
