(function (root, create) {
  if(typeof module === "object" && module.exports) {
    module.exports = create();
  } else {
    root.Swatchmaker = create();
  }
}(this, function() {
    function extractPalette(d, K, space) {
        var data = rgbToSpace(d, space);
        var results = kMeans(data, K, 0.0001);
        var rgbResults = results.map(function(data) {
			return spaceToRgb(data, space);
		});
        return rgbResults;
    }

    function kMeans(points, K, minDiff) {
        var numPoints = points.length / 4;
        var clusters = [];
        var seen = [];
        var idx;
        var found;
        var i;

        while (clusters.length < K) {
            idx = Math.floor(Math.random() * (numPoints - 1)) * 4;
            found = false;
            for (i = 0; i < K; i++) {
                if (!!seen[i] && idx === seen[i]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                seen.push(idx);
                clusters.push([
                    points[idx],     // R
                    points[idx + 1], // G
                    points[idx + 2]  // B
                ]);
            }
        }

        var wc = 0;
        var diff;
        var old;
        var list;
        var centre;
        var newCluster;
        var dist;
        var plists;
        while (true) {

            plists = [];
            for (i = 0; i < K; i++) {
                plists.push([]);
            }

            var i4;
            for (i = 0; i < numPoints; i++) {
                i4 = i * 4;
                var p = [
                    points[i4],
                    points[i4 + 1],
                    points[i4 + 2]
                ];
                var smallestDistance = 10000000;
                var index = 0;
                for (var j = 0; j < K; j++) {
                    var distance = euclidean(p, clusters[j]);
                    if (distance < smallestDistance) {
                        smallestDistance = distance;
                        index = j;
                    }
                }
                plists[index].push(p);
            }

            diff = 0;
            for (i = 0; i < K; i++) {
                old = clusters[i];
                list = plists[i];
                centre = calculateCentre(list, 3);
                newCluster = centre;
                dist = euclidean(old, centre);
                clusters[i] = newCluster;
                diff = diff > dist ? diff : dist;
            }

            if (diff < minDiff) {
                break;
            }
        }

        clusters = clusters.map(function(c) {
            return c.map(function(ci) {
                return Math.floor(ci);
            });
        });

        return clusters;
    }

    function calculateCentre(points, N) {
        var vals = [];
        var plen = 0;
        var i;
        var j;
        var L = points.length;;
        for (i = 0; i < N; i++) {
            vals.push(0);
        }
        for (i = 0; i < L; i++) {
            plen++;
            for (j = 0; j < N; j++) {
                vals[j] += points[i][j];
            }
        }
        for (i = 0; i < N; i++) {
            if (plen !== 0) {
                vals[i] = vals[i] / plen;
            } else {
                vals[i] = 0;
            }
        }

        return vals;
    }

    function euclidean(p1, p2) {
        var s = 0;
        var i;
        var diff;
        for (i = 0; i < 3; i++) {
            diff = p1[i] - p2[i];
            s += Math.pow(diff, 2);
        }

        return Math.sqrt(s);
    }

    function spaceToRgb(data, space) {
        switch (space) {
            case "YUV": return convertData(data, yuvToRgb);
            case "HSL": return convertData(data, hslToRgb);
            default: return data;
        }
    }

    function rgbToSpace(data, space) {
        switch (space) {
            case "YUV": return convertData(data, rgbToYuv);
            case "HSL": return convertData(data, rgbToHSL);
            default: return data;
        }
    }

	function convertData(data, converter) {
		var newData = [];
		var len = data.length;
		var a, b, c, d;
		for (var i = 0; i < len; i += 4) {
			a = data[i];
			b = data[i+1];
			c = data[i+2];
			d = converter(a, b, c);
			newData.push(Math.round(d[0]));
			newData.push(Math.round(d[1]));
			newData.push(Math.round(d[2]));
			if (!!data[i+3]) {
				newData.push(data[i+3]);
			}
		}
		return newData;
	}

    function rgbToYuv(r, g, b) {
        var y = (r * 0.299) + (g * 0.587) + (b * 0.114);
        var u = 0.492 * (b - y);
        var v = 0.877 * (r - y);

        return [ y, u, v ];
    }

    function yuvToRgb(y, u, v) {
        var r = y + (v * 1.140);
        var g = y - (0.395 * u) - (0.581 * v);
        var b = y + (u * 2.032);

        return [ r, g, b ];
    }
/*
    private function getLuminance($r, $g, $b, $method='objective')
    {
        switch (strtolower($method)) {
            case 'perceived_fast':

                return (0.299 * $r) + (0.587 * $g) + (0.114 * $b);
                break;
            case 'perceived_slow':

                return sqrt(pow(0.241 * $r, 2) + pow(0.691 * $g, 2) + pow(0.068 * $b, 2));
                break;
            case 'approximate': // should be the fastest

                return ($r + $r + $g + $g + $g + $b) / 6;
                break;
            case 'objective':
            default:

                return (0.2126 * $r) + (0.7152 * $g) + (0.0722 * $b);
        }
    }

    private function orderByLuminance($colours)
    {
        $luminances = array();
        foreach ($colours as $index => $rgb) {
            $luminances[$index] = $this->getLuminance($rgb[0], $rgb[1], $rgb[2], 'approximate');
        }
        arsort($luminances);
        foreach ($luminances as $index => $value) {
            $sortedColours[] = $colours[$index];
        }

        return $sortedColours;
    }

    private function orderByHue($colours)
    {
        $luminances = array();
        foreach ($colours as $index => $rgb) {
            $luminances[$index] = $this->getHue($rgb[0], $rgb[1], $rgb[2]);
        }
        arsort($luminances);
        foreach ($luminances as $index => $value) {
            $sortedColours[] = $colours[$index];
        }

        return $sortedColours;
    }

    private function rgbToHsl($r, $g, $b)
    {
        $min = min($r, $g, $b);
        $max = max($r, $g, $b);
        $delta = $max - $min;
        $l = ($max + $min) / 2;
        if ($delta == 0) {
            // this is grey (no chroma)
            $h = 0;
            $s = 0;
        } else {
            //Chromatic data...
            if ( $l < 0.5 ) {
                $s = $delta / ( $max + $min );
            } else {
                $s = $delta / ( 2 - $max - $min );
            }
            $rDelta = ((($max - $r) / 6) + ($delta / 2)) / $delta;
            $gDelta = ((($max - $g) / 6) + ($delta / 2)) / $delta;
            $bDelta = ((($max - $b) / 6) + ($delta / 2)) / $delta;
            if ($r == $max) {
                $h = $bDelta - $gDelta;
            } elseif ( $g == $max ) {
                $h = (1 / 3) + $rDelta - $bDelta;
            } elseif ( $b == $max ) {
                $h = (2 / 3) + $gDelta - $rDelta;
            }
            if ( $h < 0 ) {
                $h += 1;
            }
            if ( $h > 1 ) {
                $h -= 1;
            }
        }

        return array($h, $s, $l);
    }

    private function hslToRgb($h, $s, $l)
    {
        if ( $s == 0 ) {
            $r = $l;
            $g = $l;
            $b = $l;
        } else {
            if ( $l < 0.5 ) {
                $v2 = $l * (1 + $s);
            } else {
                $v2 = ($l + $s) - ($s * $l);
            }
            $v1 = 2 * $l - $v2;
            $r = $this->hueToRgb($v1, $v2, $h + (1 / 3));
            $g = $this->hueToRgb($v1, $v2, $h );
            $b = $this->hueToRgb($v1, $v2, $h - (1 / 3));
        }

        return array($r, $g, $b);
    }

    private function rgbToHue($r, $g, $b)
    {
        return atan2(sqrt(3) * ($g - $b), 2 * ($r - $g - $b));
    }

    private function hueToRgb($v1, $v2, $vh)
    {
        if ($vh < 0) {
            $vh += 1;
        }
        if ($vh > 1) {
            $vh -= 1;
        }
        if ((6 * $vh) < 1) {
            return ($v1 + ($v2 - $v1) * 6 * $vh);
        }
        if ((2 * $vh) < 1) {
            return $v2;
        }
        if ((3 * $vh) < 2) {
            return ($v1 + ($v2 - $v1) * ((2 / 3) - $vh) * 6);
        }

        return $v1;
    }
*/

    return {
        extractPalette: extractPalette
    }
}));
