<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Swatchmaker &#124; Colour palette extraction by K-means clustering</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    <style type="text/css">{{{inline_css}}}</style>
</head>
<body class="nojs">
    <div id="masthead" class="masthead">
        <h1 class="heading"><a class="heading__link" href="#">
        <svg class="logo" viewBox="0 0 86 94" xmlns="http://www.w3.org/2000/svg">
            <polygon points="43,1 85,22 85,64 43,85 1,64 1,22" class="logo__stroke"></polygon>
            <polygon points="43,6 81,25 43,43 5,25" class="logo__facet1"></polygon>
            <polygon points="81,25 81,61 43,80 43,43" class="logo__facet2"></polygon>
            <polygon points="5,25 43,43 43,80 5,61" class="logo__facet3"></polygon>
        </svg>
        </span>Swatchmaker</a></h1>
    </div>
    <main role="main" id="main">
        <div id="output" class="{{#results_not_included}}jsonly{{/results_not_included}}">
            <p><a href="#home" class="link-back jsonly">Return</a></p>
            <h2>Results</h2>
            <div id="results" class="results">
                <div class="split-column">
                    <h3>Palette</h3>
                    <div id="palette" class="palette">{{{palette}}}</div>
					{{#export}}
                    <h3>Export</h3>
                    <div id="export" class="export">{{{export}}}</div>
					{{/export}}
                </div>
                <div class="split-column">
                    <h3>Source image</h3>
                    {{{image}}}
                    <canvas id="canvas" class="canvas"></canvas>
                </div>
            </div>
            <hr>
            <p><a href="#home" class="link-back jsonly">Return</a></p>
        </div>
        <div class="jsonly spinner" id="working">
            <svg class="spinner__svg" viewBox="0 0 86 86" xmlns="http://www.w3.org/2000/svg">
                <polygon points="43,1 85,22 85,64 43,85 1,64 1,22" class="spinner__stroke"></polygon>
                <polygon points="43,6 81,25 43,43 5,25" class="spinner__facet1"></polygon>
                <polygon points="81,25 81,61 43,80 43,43" class="spinner__facet2"></polygon>
                <polygon points="5,25 43,43 43,80 5,61" class="spinner__facet3"></polygon>
            </svg>
            <p class="spinner__text">Processing</p>
        </div>
        <div id="how-it-works" class="jsonly">
            <p><a href="#home" class="link-back">Return</a></p>
            {{{how_it_works}}}
            <hr>
            <p><a href="#home" class="link-back">Return</a></p>
        </div>
        <div id="why" class="jsonly">
            <p><a href="#home" class="link-back">Return</a></p>
            {{{why}}}
            <hr>
            <p><a href="#home" class="link-back">Return</a></p>
        </div>
        <div id="home">
            <h2>Extract colours from images</h2>
            <p>Swatchmaker uses K-means clustering to analyze an image and derive a representative palette of colours.</p>
            <p class="nojsonly">To use Swatchmaker on your device we need to upload any images you submit to a server for analysis. The server will not store the images.</p>
            <p class="nojsonly"><em>Please note that large images may take a long time to upload and may incur bandwidth costs.</em></p>
            <h2>Try it out</h2>
            <form method="POST" action="#" id="form" enctype="multipart/form-data">
                <ol>
                    <li>
                        <div class="input cta">
                            <label tabindex=0 id="input__file__label" for="input__file">Select an image from your device</label>
                            <input tabindex=-1 id="input__file" class="input__file" name="image" type="file" accept="image/*">
                        </div>
                    </li>
                    <li class="jsonly">
                        <fieldset>
                            <legend>Configure</legend>
                            <div class="input-wrapper">
                                <label for="input__k">Palette size (K)</label>
                                <input id="input__k" type="number" name="K" value=3 max=10>
                            </div>
                            <div class="input-wrapper">
                                <label for="input__space">Colour space</label>
                                <select id="input__space" name="space">
                                    <option value="YUV" selected>YUV</option>
                                    <option value="RGB">RGB</option>
                                </select>
                            </div>
                            <div class="input-wrapper">
                                <label for="input__sample">Sample</label>
                                <select id="input__sample" name="sample">
                                    <option value="ALL" selected>All tones</option>
                                    <option value="BRIGHT">Bright tones</option>
                                    <option value="MID">Mid tones</option>
                                    <option value="DARK">Dark tones</option>
                                    <option value="SATURATED">Saturated tones</option>
                                </select>
                            </div>
                        </fieldset>
                        <fieldset class="canfilter">
                            <legend>Canvas filters</legend>
                            <label for="brightness">Brightness</label><input id="brightness" name="brightness" type="number" min=0 max=200 value=100>
                            <label for="contrast">Contrast</label><input id="contrast" name="contrast" type="number" min=0 max=200 value=100>
                            <label for="saturation">Saturation</label><input id="saturation" name="saturation" type="number" min=0 max=200 value=100>
                        </fieldset>
                    </li>
                    <li>
                        <p><input id="input__submit" class="cta" type="submit" value="Extract palette"></p>
                    </li>
                </ol>
            </form>
            <nav class="jsonly" role="navigation">
                <h2>More information</h2>
                <ul>
                    <li><a class="hash" href="./how-it-works">How it works</a></li>
                    <li><a class="hash" href="./why">Why?</a></li>
                </ul>
            </h2>
        </div>
    </main>
    <canvas id="workspace" class="hidden"></canvas>
    <script type="text/javascript">{{{inline_js}}}</script>
</body>
</html>
