ClassUtil.addClass(window.body, "js");

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

    function getOptions() {
        return {
            "K": document.getElementById("input__k").value,
            "space": document.getElementById("input__space").value
        }
    }

    function processImageFile(file, opts) {
        hideResults();
        activateSpinner();
        var reader = new FileReader();
        reader.onload = function(event){
            var img = new Image();
            img.onload = processImage;
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function activateSpinner() {
        var spinner = document.getElementById("spinner");
        ClassUtil.removeClass(spinner, "hidden");
    }

    function deactivateSpinner() {
        var spinner = document.getElementById("spinner");
        ClassUtil.addClass(spinner, "hidden");
    }

    function processImage(e) {
        var opts = getOptions();
        var img = e.target;
        var canvas = document.getElementById("canvas");
        var workspace = document.getElementById("workspace");
        var imgWidth = window.innerWidth ? window.innerWidth : img.width;
        var spinner = document.getElementById("spinner");
        ClassUtil.removeClass(spinner, "hidden");
        writeImageToCanvas(img, workspace, 400);
        var ctx = workspace.getContext("2d");
        var rgbData = ctx.getImageData(0, 0, workspace.width, workspace.height).data;
        var colours = Swatchmaker.extractPalette(workspace, opts.K, opts.space);
        deactivateSpinner();
        renderPalette(colours, canvas);
        writeImageToCanvas(img, canvas, imgWidth);
        showResults();
    }

    function showResults() {
        var results = document.getElementById("results");
        ClassUtil.removeClass(results, "hidden");
    }

    function hideResults() {
        var results = document.getElementById("results");
        ClassUtil.addClass(results, "hidden");
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
