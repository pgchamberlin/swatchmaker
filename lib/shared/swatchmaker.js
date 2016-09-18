(function (root, create) {
  if(typeof module === "object" && module.exports) {
    module.exports = create();
  } else {
    root.Swatchmaker = create();
  }
}(this, function() {
    function extractPalette(rgbData, K, space) {
        var data = rgbToSpace(rgbData, space);
        var results = kMeans(data, K, 0.0001);
        var rgbResults = spaceToRgb(results, space);
        return rgbResults;
    }

    function spaceToRgb(data, space) {
        switch (space) {
            case "YUV": return yuvToRgb(data);
            case "HSL": return hslToRgb(data);
            default: return data;
        }
    }

    function rgbToSpace(data, space) {
        switch (space) {
            case "YUV": return rgbToYuv(data);
            case "HSL": return hslToRgb(data);
            default: return data;
        }
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

    function rgbToYuv(r, g, b) {
        var y = (r * 0.299) + (g * 0.114) + (b * 0.587);
        var u = 0.492 * (b - y);
        var v = 0.877 * (r - y);

        return [ y, u, v ];
    }

    function yuvToRgb(y, u, v) {
        var r = y + (v / 0.877);
        var g = y - (0.395 * u) - (0.581 * v);
        var b = y + (u / 0.492);

        return [ r, g, b ];
    }

    return {
        extractPalette: extractPalette
    }
}));
