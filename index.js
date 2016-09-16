var express = require('express');
var Promise = require('bluebird');

var fs = Promise.promisifyAll(require('fs'));
var engine = require('./lib/mu-express-engine');

var app = express();
app.engine('mu', engine);
app.set('view engine', 'mu');
app.set('views', __dirname + '/templates');

var files = {
    inline_js: "/dist/swatchmaker.js",
    inline_css: "/dist/swatchmaker.css"
}

app.get('/', function(req, res) {
    Promise.map([ "inline_css", "inline_js" ], function(file) {
        return fs.readFileAsync(__dirname + files[file]);
    }).then(function(data) {
        res.render(
            'swatchmaker.mu',
            {
                inline_css: data[0],
                inline_js: data[1]
            }
        );
    });
});

app.post('/', function (req, res) {

});

app.listen(3000, function () {
  console.log('Swatchmaker listening on port 3000!');
});

