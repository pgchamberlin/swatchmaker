// Only init JS if client cuts the mustard, a la http://responsivenews.co.uk/post/18948466399/cutting-the-mustard
if('querySelector' in document && 'localStorage' in window && 'addEventListener' in window) {

    // If there's already a location hash which isn't a doc page then strip it
    if (!!document.location.hash
        && document.location.hash !== "#why"
        && document.location.hash !== "#how-it-works") {
            document.location.href = "";
        }

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
            refreshFormState();


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

        function rewriteHashLinks() {
            var hashLinks = document.querySelectorAll('.hash');
            for (var i=0; i < hashLinks.length; i++) {
                hashLinks[i].href = '#' + hashLinks[i].href.match(/\/[^\/]+$/)[0].substr(1);
            }
        }

        function refreshFormState() {
            var submit = document.getElementById("input__submit");
            var fileInput = document.getElementById("input__file");
            var fileLabel = document.getElementById("input__file__label");
            var fileWrapper = fileLabel.parentNode;
            var errorClass = "input__file--selected-error";
            var selectedClass = "input__file--selected";

            // is there a file?
            if (fileInput.files.length) {
                // set the file name to be in the label
                fileLabel.innerHTML = fileInput.files[0].name;
                // is the file an image?
                if (fileInput.files[0].type.match(/^image\//) !== null) {
                    console.log("Image");
                    // it is an image, so give it the thumbs up and activate the submit button
                    ClassUtil.replace(fileWrapper, errorClass, selectedClass);
                    submit.disabled = false;
                } else {
                    console.log("Error");
                    // it is not an image, so display an error and ensure the submit button is disabled
                    submit.disabled = true;
                    ClassUtil.replace(fileWrapper, selectedClass, errorClass);
                }
            } else {
                // there is no file selected, so submit should be disabled and file input should be neutral
                console.log("Neutral");
                submit.disabled = true;
                ClassUtil.remove(fileWrapper, selectedClass);
                ClassUtil.remove(fileWrapper, errorClass)
            }
        }

        var form = document.getElementById("form");
        form.addEventListener("submit", handleFormSubmit, false);

        var fileInput = document.getElementById("input__file");
        fileInput.addEventListener("change", handleFileInputChange, false);

        /**
         * For aesthetic reasons we don't show the file input element to the user
         * but instead give it's label focus. This code captures the enter key
         * being pressed when the label is focused and triggers a click on the file input.
         *
         * This works. Mostly. But it's hacky. If anyone reading this has a better solution
         * I'd be grateful :)
         */
        var fileInputLabel = document.getElementById("input__file__label");
        fileInputLabel.addEventListener("keypress", function(e) {
            if (e.keyCode === 13) {
                var event = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                fileInput.dispatchEvent(event);
            }
        });

        rewriteHashLinks();
        refreshFormState();
    };
}
