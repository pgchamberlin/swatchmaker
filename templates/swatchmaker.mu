<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title></title>
    <meta name="viewport" content="width=device-width">
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    <style type="text/css">{{inline_css}}</style>
</head>
<body>
    <main role="main" id="main">
        <div class="column">
            <div id="masthead" class="masthead">
                <h1 class="heading"><a href="#home" class="heading__link">Swatchmaker</a></h1>
            </div>
            <form method="POST" action="./" id="form">
                <p>Swatchmaker uses k-means clustering to extract a colour palette from an image.</p>
                <div class="input">
                    <label id="input__file__label" for="input__file" class="input__label">Select an image from your computer</label>
                    <input id="input__file" class="input__file" type="file">
                </div>
                <input class="input input__submit" type="submit" value="Extract palette">
            </form>
            <div class="hidden" id="spinner">
                <p><em>Processing your image&hellip;</em></p>
            </div>
            <div id="results" class="hidden results">
                <div class="split-column">
                    <h2>Palette</h2>
                    <div id="palette" class="palette"></div>
                </div>
                <div class="split-column">
                    <h2>Source image</h2>
                    <canvas id="canvas" class="canvas"></canvas>
                </div>
            </div>
            <footer>
                <p><a href="#main">Back to top</a></p>
            </footer>
        </div>
    </main>
    <canvas id="workspace" class="hidden"></canvas>
    <script type="text/javascript">{{inline_js}}</script>
</body>
</html>

