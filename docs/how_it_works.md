## How does it work?

### Image processing

Swatchmaker uses K-means clustering to derive K typical colours from an image. It is a widely used method for grouping or quantizing data of various kinds. For example you could use it to group survey respondents into clusters with similar opinions. In Swatchmaker's case it's grouping pixels into clusters with similar amounts of red, green, and blue in them.

Like many other algorithms used in data analysis it's not actually that complicated to understand or implement. Here's how it works in Swatchmaker's case.

 * Take all the pixels that make up an image.
 * Select K pixels at random. These are the initial cluster centers.
 * Iterate over all the other pixels, grouping each with it's closest K value.
 * Find the center point of each group in vector space. Replace the previous K values with these points.
 * Iterate and refine the center points repeatedly.
 * When the difference between the center points from one iteration to the next is very small then you're done.

Simple, right?

One of the weaknesses of the algorithm is that it can be tricky to predict a good value for K. For Swatchmaker I've defaulted to K=5, but that's arbitrary and you can change it using the advanced options. The fact is that good values for K will vary significantly from image to image. Bear in mind that higher values are more expensive to compute.

For a deeper dive take a look at [Swatchmaker's source code](https://github.com/pgchamberlin/swatchmaker/blob/master/lib/shared/swatchmaker.js), or look up the better, more detailed article about [K-means on Wikipedia](https://en.wikipedia.org/wiki/K-means_clustering).

For most devices Swatchmaker runs it's analysis in the browser using JavaScript. When a device has poor JavaSript capabilities it falls back to a NodeJS server-side version which runs the same code in an isomorphic kind of way.

Swatchmaker is released under an MIT license and is [hosted on Github](https://github.com/pgchamberlin/swatchmaker).
