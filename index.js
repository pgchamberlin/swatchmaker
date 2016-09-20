var express = require('express');
var compression = require('compression');
var Promise = require('bluebird');
var getPixels = require('get-pixels');
var multer = require('multer');
var btoa = require('btoa');
var Jimp = require('jimp');
var fs = Promise.promisifyAll(require('fs'));

var Swatchmaker = require('./lib/shared/swatchmaker');
var engine = require('./lib/mu-express-engine');

/**
    Set up static asset paths depending on environment
*/
var prodFiles = {
    swatchmaker_js: "/dist/swatchmaker.js",
    classutil_js: "/dist/class-util.js",
    client_js: "/dist/client.js",
    inline_css: "/dist/swatchmaker.css",
    views_path: "/dist",
    mustache_html: "swatchmaker.mu"
}
var devFiles = {
    swatchmaker_js: "/lib/shared/swatchmaker.js",
    classutil_js: "/lib/shared/class-util.js",
    client_js: "/lib/shared/client.js",
    inline_css: "/css/swatchmaker.css",
    views_path: "/templates",
    mustache_html: "swatchmaker.mu"
}
var files;
/**
*/

var app = express();
app.use(compression());
app.engine('mu', engine);
app.set('view engine', 'mu');

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

function setStaticPaths(req) {
    files = req.query.dev !== undefined ? devFiles : prodFiles;
    app.set('views', __dirname + files.views_path);
}

function getImageMarkup(image) {
    return !!image ? '<img width="100%" src="' + image + '" alt="Image processed" />' : "";
}

function getPaletteMarkup(palette) {
    if (!palette) return "";
    var markup = "";
    palette.forEach(function(swatch) {
        markup += '<span class="swatch" style="background-color: rgb(' + swatch[0] + ',' + swatch[1] + ',' + swatch[2] + ');"></span>';
    });
    return markup;
}

function render(req, res, palette, image) {
    setStaticPaths(req);
    Promise.map([ "inline_css", "swatchmaker_js", "classutil_js", "client_js" ], function(file) {
        return fs.readFileAsync(__dirname + files[file]);
    }).then(function(data) {
        res.render(
            files.mustache_html,
            {
                inline_css: data[0],
                inline_js: data[1] + data[2] + data[3],
                results_not_included: (!palette || !image),
                palette: getPaletteMarkup(palette),
                image: getImageMarkup(image)
            }
        );
    });
}

/**
 TODO: factor this out. Should be able to cover this with Jimp resize.
*/
function getResizedPixelsData(pixels, maxSide) {
    var width = pixels.shape[0];
    var height = pixels.shape[1];
    var channels = pixels.shape[2];
    var buffer = pixels.data.slice(pixels.data.byteOffset, pixels.data.byteOffset + pixels.data.byteLength);
    var data = new Uint8ClampedArray(buffer);
    var numPixels = Math.floor(data.length / channels);
    var ratio = width > height ? height / width : width / height;
    var desiredNumPixels = Math.floor(maxSide * (maxSide * ratio));
    var pixelRatio = Math.floor(numPixels / desiredNumPixels);
    var inc = pixelRatio * channels;
    var str = "";
    for (var i = 0; i < data.length; i+=inc) {
        str += data.slice(i, i+channels) + ",";
    }
    return new Uint8ClampedArray(str.slice(0, -1).split(","));
}

app.get('/', function(req, res) {
    render(req, res);
});

app.post('/', upload.single('image'), function (req, res) {
    getPixels(req.file.buffer, req.file.mimetype, function(err, pixels) {
        var data = getResizedPixelsData(pixels, 300); var timer = new Date().getTime();
        var palette = Swatchmaker.extractPalette(data, 5, "RGB");
        var time = new Date().getTime() - timer;
        Jimp.read(req.file.buffer).then(function(image) {
            image.scaleToFit(400, 400);
            image.getBase64(Jimp.AUTO, function(err, b64) {
                render(req, res, palette, b64);
            });
        });
    });
});

app.listen(3000, function () {
  console.log('Swatchmaker listening on port 3000!');
});
