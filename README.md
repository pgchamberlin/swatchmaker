# Swatchmaker

Palette extraction using K-means clustering

### Installation

It should be very straightforward to get Swatchmaker working locally following these steps.

 * Clone this repo
 * Install dependencies
 * Do a local build
 * Launch the server

Here are the commands:

```
npm install
./node_modules/gulp/bin/gulp.js
node index.js
```

You should see the message `Swatchmaker listening on port 3000!`, and the app should be working a [`http://localhost:3000`](http://localhost:3000).

### Dev mode

By default the app will use the `/dist` assets, which are minified and uglified. This makes it hard to develop, so I've made it possible to put the app into dev mode using the query string `?dev`. This uses the raw assets instead.

### Different ports

To launch Swatchmaker on a port other than `3000` pass the port as an environment variable:

```
PORT=3210 node index.js
```

### More information

Take a look in the ``/docs``` directory for more information.
