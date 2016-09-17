var express = require('express');
var Promise = require('bluebird');
var getPixels = require('get-pixels');
var multer = require('multer');

var Swatchmaker = require('./lib/shared/swatchmaker');

var fs = Promise.promisifyAll(require('fs'));
var engine = require('./lib/mu-express-engine');

var app = express();
app.engine('mu', engine);
app.set('view engine', 'mu');
app.set('views', __dirname + '/templates');

var files = {
    swatchmaker_js: "/dist/swatchmaker.js",
    client_js: "/dist/client.js",
    inline_css: "/dist/swatchmaker.css"
}

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

function render(res, palette, image) {
    Promise.map([ "inline_css", "swatchmaker_js", "client_js" ], function(file) {
        return fs.readFileAsync(__dirname + files[file]);
    }).then(function(data) {
        res.render(
            'swatchmaker.mu',
            {
                inline_css: data[0],
                inline_js: data[1] + data[2],
                palette: palette,
                source_image: image
            }
        );
    });
}

app.get('/', function(req, res) {
    render(res);
});

app.post('/', upload.single('image'), function (req, res) {
    getPixels(req.file.buffer, req.file.mimetype, function(err, pixels) {
        var d = pixels.data;
        console.log(d[0], d.byteOffset, d.byteLength);
    });
});

app.listen(3000, function () {
  console.log('Swatchmaker listening on port 3000!');
});

