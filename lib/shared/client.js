// If there's already a location hash which isn't a doc page then strip it and redirect
if (!!document.location.hash
    && document.location.hash !== "#why"
    && document.location.hash !== "#how-it-works") {
    document.location.href = "";
}

// Only init JS if client cuts the mustard, a la http://responsivenews.co.uk/post/18948466399/cutting-the-mustard
if( 'querySelector' in document
    && 'localStorage' in window
    && 'addEventListener' in window
    && (function() {
        var e = document.createElement('canvas');
        return !!(e.getContext && e.getContext('2d'));
    })()) {

	// bootstrap the enhanced experience in time for first paint (hopefully...!)
	ClassUtil.replace(document.body, "nojs", "js");
	ClassUtil.add(document.getElementsByTagName("main")[0], "spa");

	// everything else happens after onload
    window.onload = function() {
        function handleFormSubmit(e) {
            e.preventDefault();
            e.stopPropagation();
            var fileInput = document.getElementById("input__file");
            if (fileInput.files.length) {
                processImageFile(fileInput.files[0]);
            }
        }

        function switchTo(target) {
            document.location.href = "#" + target;
        }

        function getOptions() {
            return {
                "K": document.getElementById("input__k").value,
                "sample": document.getElementById("input__sample").value,
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
            var data = sampleData(opts, ctx.getImageData(0, 0, workspace.width, workspace.height).data);
            var colours = Swatchmaker.extractPalette(data, opts.K, opts.space);
            renderPalette(colours, canvas);
            writeImageToCanvas(img, canvas, imgWidth);
            switchTo("output");
        }

        function sampleData(opts, data) {
            switch (opts.sample) {
                case "BRIGHT":
                    return brightTones(data);
                case "MID":
                    return midTones(data);
                case "DARK":
                    return darkTones(data);
                case "SATURATED":
                    return saturatedTones(data);
                default:
                    return data;
            }
        }

        function getLightnessData(data) {
            var result = {
                lookup: {},
                arr: []
            };
            var len = data.length;
            var sum = 0;
            for (var i = 0; i < len; i += 4) {
                sum = data[i] + data[i+1] + data[i+2];
                result.lookup[sum] = result.lookup[sum] || [];
                result.lookup[sum].push(i);
                if (result.arr.indexOf(sum) === -1) {
                    result.arr.push(sum);
                }
            }
            result.arr.sort(function(a, b) { return b - a });
            return result;
        }

		function getSaturationData(data) {
            var result = {
                lookup: {},
                arr: []
            };
            var len = data.length;
			var min, max, delta, sat, lum;
            for (var i = 0; i < len; i += 4) {
				min = Math.min(data[i], data[i+1], data[i+2]);
				max = Math.max(data[i], data[i+1], data[i+2]);
				delta = max - min;
				lum = (min + max) / 2;
				if (delta === 0) {
					sat = 0;
				} else {
					if (lum < 0.5) {
						sat = delta / (max + min);
					} else {
						sat = delta / (2 - max - min);
					}
				}
				result.lookup[sat] = result.lookup[sat] || [];
				result.lookup[sat].push(i);
				if (result.arr.indexOf(sat) === -1) {
					result.arr.push(sat);
				}
			}
            result.arr.sort(function(a, b) { return b - a });
            return result;
		}

        function getNewImageDataForSample(sample, lookup, imageData) {
            var newImageData = []
            var len = sample.length;
            for (var i = 0; i < len; i++) {
                var len2 = lookup[sample[i]].length;
                for (var j = 0; j < len2; j++) {
                    newImageData.push(imageData[lookup[sample[i]][j]]);
                    newImageData.push(imageData[lookup[sample[i]][j]+1]);
                    newImageData.push(imageData[lookup[sample[i]][j]+2]);
                    newImageData.push(255);
                }
            }
            return newImageData;
        }

        function brightTones(imageData) {
            var newImageData = [];
            var lightnessData = getLightnessData(imageData);
            var brights = lightnessData.arr.slice(0, Math.floor(lightnessData.arr.length / 2));
            return getNewImageDataForSample(brights, lightnessData.lookup, imageData);
        }

        function midTones(imageData) {
            var newImageData = [];
            var lightnessData = getLightnessData(imageData);
            var mids = lightnessData.arr.slice(Math.floor(lightnessData.arr.length / 4), Math.floor((lightnessData.arr.length / 4) * 3));
            return getNewImageDataForSample(mids, lightnessData.lookup, imageData);
        }

        function darkTones(imageData) {
            var newImageData = [];
            var lightnessData = getLightnessData(imageData);
            var darks = lightnessData.arr.slice(Math.floor(lightnessData.arr.length / 2));
            return getNewImageDataForSample(darks, lightnessData.lookup, imageData);
        }

        function saturatedTones(imageData) {
            var newImageData = [];
            var saturationData = getSaturationData(imageData);
            var saturateds = saturationData.arr.slice(0, Math.floor(saturationData.arr.length / 2));
            return getNewImageDataForSample(saturateds, saturationData.lookup, imageData);
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
				swatchValue = document.createElement("span");
				swatchValue.className = "swatch__value";
				swatchValue.style.color = textColorStyleFor(colours[i]);
				swatchValue.innerHTML = rgbToHex(colours[i]);
				swatch.appendChild(swatchValue);
                palette.appendChild(swatch);
            }
        }

		function textColorStyleFor(rgb) {
			var sum = rgb.reduce(function(a, b) {
				return a + b;
			}, 0);
			var g = Math.round((sum > 384 ? sum - 384 : sum + 384) / 3);
			var grey = [ g, g, g ];
			return rgbToHex(grey);
		}

		function rgbToHex(rgb) {
			return "#" + rgb.map(function(e) {
				var h = e.toString(16);
				return h.length == 1 ? "0" + h : h;
			}).join("");
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

            if (fileInput.files.length) {
                fileLabel.innerHTML = fileInput.files[0].name;
                if (fileInput.files[0].type.match(/^image\//) !== null) {
                    ClassUtil.replace(fileWrapper, errorClass, selectedClass);
                    submit.disabled = false;
                } else {
                    submit.disabled = true;
                    ClassUtil.replace(fileWrapper, selectedClass, errorClass);
                }
            } else {
                submit.disabled = true;
                ClassUtil.remove(fileWrapper, selectedClass);
                ClassUtil.remove(fileWrapper, errorClass)
            }
        }

        function attachEvents() {
            var form = document.getElementById("form");
            form.addEventListener("submit", handleFormSubmit, false);

            var fileInput = document.getElementById("input__file");
            fileInput.addEventListener("change", refreshFormState, false);

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
        }

        // initialise the form
        attachEvents();
        rewriteHashLinks();
        refreshFormState();
    };
}
