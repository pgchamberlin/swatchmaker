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
<body>
    <div class="column">
        <div id="masthead" class="masthead">
            <h1 class="heading"><a href="#home" class="heading__link">Swatchmaker</a></h1>
        </div>
        <main role="main" id="main">
            <form method="POST" action="./" id="form" enctype="multipart/form-data">
                <p>Swatchmaker uses k-means clustering to extract a colour palette from an image.</p>
                <div class="input">
                    <label id="input__file__label" for="input__file" class="input__label">Select an image from your computer</label>
                    <input id="input__file" class="input__file" name="image" type="file" accept="image/*">
                </div>
                <fieldset>
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
                <button>Advanced options</button>
            </form>
            <div class="hidden" id="spinner">
                <p><em>Processing your image&hellip;</em></p>
            </div>
            <div id="results" class="hidden results">
                <div class="split-column">
                    <h2>Palette</h2>
                    <div id="palette" class="palette">{{{palette}}}</div>
                    <button>View details</button>
                </div>
                <div class="split-column">
                    <h2>Source image</h2>
                    {{{image}}}
                    <canvas id="canvas" class="canvas"></canvas>
                </div>
            </div>
        </main>
        <footer>
            <p><a href="#main">Back to top</a></p>
        </footer>
    </div>
    <canvas id="workspace" class="hidden"></canvas>
    <script type="text/javascript">{{{inline_js}}}</script>
</body>
</html>
