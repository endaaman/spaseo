if (typeof window !== 'undefined') {
    module.exports = require('./client');
} else {
    // run away from Webpack module detection system
    module.exports = eval('require')('./server');
}
