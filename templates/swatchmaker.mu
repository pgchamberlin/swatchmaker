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
        <h1 class="heading">
        <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon class="f1" points="43,3 83,23 43,43 3,23" />
            <polygon class="f2" points="83,23 83,63 43,83 43,43" />
            <polygon class="f3" points="3,23 43,43 43,83 3,63" />
        </svg>
        </span>Swatchmaker</h1>
    </div>
    <main role="main" id="main">
        <div id="output" class="{{#results_not_included}}jsonly{{/results_not_included}}">
            <h2>Results</h2>
            <div id="results" class="results">
                <div class="split-column">
                    <p>Your palette</p>
                    <div id="palette" class="palette">{{{palette}}}</div>
                </div>
                <div class="split-column">
                    <p>Source image</p>
                    {{{image}}}
                    <canvas id="canvas" class="canvas"></canvas>
                </div>
            </div>
            <p class="jsonly"><a href="#home">Process another image</a>.</p>
        </div>
        <div class="jsonly" id="working">
            <div class="spinner">
                <svg height="86" width="86" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="43,1 85,22 85,64 43,85 1,64 1,22" class="s"></polygon>
                    <polygon points="43,4 82,23 43,43 4,23" fill="mediumseagreen"></polygon>
                    <polygon points="4,23 43,43 43,82 4,62" fill="indianred"></polygon>
                    <polygon points="82,23 82,62 43,82 43,43" fill="deepskyblue"></polygon>
                </svg>
                <p class="s-text">Processing</p>
            </div>
        </div>
        <div id="how-it-works">
            <h2>How does it work?</h2>
            <p>For most devices Swatchmaker runs it's analysis in the browser using JavaScript. When a device has poor JavaSript capabilities it falls back to a NodeJS server-side version which runs the same, isomorphic, Swatchmaker K-means clustering code.</p>
            <p>All the Swatchmaker code is released under an MIT license and is <a href="https://github.com/pgchamberlin/swatchmaker">hosted on Github</a>.</p>
        </div>
        <div id="home">
            <h2>Extract colours from images</h2>
            <p>Swatchmaker uses k-means clustering to analyze an image and derive a representative palette of colours.</p>
            <p class="nojsonly">To use Swatchmaker on your device we need to upload your images to a server for analysis. <a href="#privacy">View privacy statement</a></p>
            <p class="nojsonly"><em>Please note that large images may take a long time to upload and may incur bandwidth costs.</em></p>
            <h2>Try it out</h2>
            <form method="POST" action="./" id="form" enctype="multipart/form-data">
                <div class="input input--cta">
                    <label id="input__file__label" for="input__file" class="input__label">Select an image from your device.</label>
                    <input id="input__file" class="input__file" name="image" type="file" accept="image/*">
                </div>
                <fieldset class="jsonly">
                    <legend>Advanced options</legend>
                    <div>
                        <label for="input__k" class="input__label">Palette size (K)&#58;</label>
                        <input id="input__k" class="input input__k" type="number" name="K" value=5 max=10>
                    </div>
                    <div>
                        <label for="input__space" class="input__label">Colour space&#58;</label>
                        <select class="input" id="input__space" name="space">
                            <option value="RGB" selected>RGB</option>
                            <option value="YUV">YUV</option>
                            <option value="HSL">HSL</option>
                        </select>
                    </div>
                </fieldset>
                <input class="input input__submit" type="submit" value="Extract palette">
            </form>
        </div>
    </main>
    <footer>
        <h2>More information</h2>
        <ul>
            <li><a href="#how-it-works">How it works</a></li>
        </ul>
    </footer>
    <canvas id="workspace" class="hidden"></canvas>
    <script type="text/javascript">{{{inline_js}}}</script>
</body>
</html>
