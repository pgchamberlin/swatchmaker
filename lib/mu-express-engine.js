/**
This is ripped from @defunctzombie's comment here:  https://github.com/expressjs/express/issues/1812
*/
var mu = require('mu2');

module.exports = function engine (path, options, callback) {
    try {
        var html = '';
        var stream = mu.compileAndRender(path, options);
        stream.on('data', function(chunk) {
            html += chunk;
        });
        stream.on('end', function() {
            callback(null, html);
        });
    } catch (err) {
        callback(err);
    }
}
