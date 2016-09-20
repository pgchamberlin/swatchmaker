// Only init JS if client cuts the mustard, a la http://responsivenews.co.uk/post/18948466399/cutting-the-mustard
if('querySelector' in document && 'localStorage' in window && 'addEventListener' in window) {

    // If there's already a location hash then then strip it
    if (!!document.location.hash) document.location.href = "";

    // Set up JS experience immediately (this hides things that are there to help with the non-JS experience only)
    ClassUtil.replace(document.body, "nojs", "js");
    ClassUtil.add(document.getElementsByTagName("main")[0], "spa");

    // Bootstrap everything else when the onload event fires
    window.onload = function() {
        function handleFormSubmit(e) {
            e.preventDefault();
            e.stopPropagation();
            var fileInput = document.getElementById("input__file");
            if (fileInput.files.length) {
                processImageFile(fileInput.files[0]);
            }
        }

        function handleFileInputChange(e) {
            var input = e.target;
            if (input.files.length) {
                var inputLabel = document.getElementById("input__file__label");
                inputLabel.innerHTML = e.target.files[0].name;
                var input = inputLabel.parentNode;
                input.className = !input.className.match(/input__file--selected/) ? input.className.trim() + " input__file--selected" : input.className;
            }
        }

        function switchTo(target) {
            document.location.href = "#" + target;
        }

        function getOptions() {
            return {
                "K": document.getElementById("input__k").value,
                "space": document.getElementById("input__space").value
            }
        }

        function processImageFile(file, opts) {
            switchTo("working");
            var reader = new FileReader();
            reader.onload = function(event){
                var img = new Image();
                img.onload = processImage;
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }

        function processImage(e) {
            var opts = getOptions();
            var img = e.target;
            var canvas = document.getElementById("canvas");
            var workspace = document.getElementById("workspace");
            var imgWidth = window.innerWidth ? window.innerWidth : img.width;
            writeImageToCanvas(img, workspace, 300);
            var ctx = workspace.getContext("2d");
            var rgbData = ctx.getImageData(0, 0, workspace.width, workspace.height).data;
            var colours = Swatchmaker.extractPalette(rgbData, opts.K, opts.space);
            renderPalette(colours, canvas);
            writeImageToCanvas(img, canvas, imgWidth);
            switchTo("output");
        }

        function isLandscape(img) {
            return img.width > img.height;
        }

        function renderPalette(colours, canvas) {
            var swatch;
            var i;
            var palette = document.getElementById("palette");
            palette.innerHTML = "";
            for (i = 0; i < colours.length; i += 1) {
                swatch = document.createElement("span");
                swatch.className = "swatch";
                swatch.style.backgroundColor = "rgb(" + colours[i][0] + ", " + colours[i][1] + ", " + colours[i][2] + ")";
                palette.appendChild(swatch);
            }
        }

        function writeImageToCanvas(img, canvas, dimensions) {
            var ctx = canvas.getContext("2d");
            var lscape = img.width > img.height;
            canvas.width = lscape ? dimensions : (img.width / img.height) * dimensions;
            canvas.height = lscape ? (img.height / img.width) * dimensions : dimensions;
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        }

        var form = document.getElementById("form");
        var fileInput = document.getElementById("input__file");
        form.addEventListener("submit", handleFormSubmit, false);
        fileInput.addEventListener("change", handleFileInputChange, false);
    };
}
