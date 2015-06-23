if ((typeof window !== 'undefined' && window !== null)) {
    module.exports = require('./client');
} else if ((typeof global !== 'undefined' && global !== null)) {
    require('coffee-script/register');
    module.exports = require('./server');
}
