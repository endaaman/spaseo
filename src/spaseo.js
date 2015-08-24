(function(){
'use strict';

if (typeof window !== 'undefined') {
  module.exports = require('./client');
} else {
  module.exports = eval('require')('./handler');
}

})();
