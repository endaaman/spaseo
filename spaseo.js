if ((typeof window !== 'undefined' && window !== null)) {
    module.exports = require('./client');
} else if ((typeof global !== 'undefined' && global !== null)) {
    module.exports = require('./server');
}
