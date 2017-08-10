cytoscape-fisheye
================================================================================


## Description

Fisheye view functionality for Cytoscape.js.  

Based on the paper:
```
Sarkar M, Brown MH. Graphical fisheye views. Communications
of the ACM 1994;37(12):73–84.
```

## Dependencies

 * Cytoscape.js ^3.0.0


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-fisheye`,
 * via bower: `bower install cytoscape-fisheye`, or
 * via direct download in the repository (probably from a tag).

Import the library as appropriate for your project:

ES import:

```js
import cytoscape from 'cytoscape';
import fisheye from 'cytoscape-fisheye';

cytoscape.use( fisheye );
```

CommonJS require:

```js
let cytoscape = require('cytoscape');
let fisheye = require('cytoscape-fisheye');

cytoscape.use( fisheye ); // register extension
```

AMD:

```js
require(['cytoscape', 'cytoscape-fisheye'], function( cytoscape, fisheye ){
  fisheye( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.


## API

The fisheye layout positions nodes relative to a ```focus``` position.

```js
const options = {
  // fisheye
  focus: {x: 0, y: 0}, // the model position which the fisheye view will be based on
  distortionFactor: 1, // how much nodes are distorted relative to their position from the focus
  fisheyeBoundingBox: undefined, // restrict which nodes will be affected by the fisheye view.  Default is the boundingbox of the given elements

  // animation
  animate: undefined, // whether or not to animate the layout
  animationDuration: undefined, // duration of animation in ms, if enabled
  animationEasing: undefined, // easing of animation, if enabled

  // viewport
  pan: undefined, // pan the graph to the provided position, given as { x, y }
  zoom: undefined, // zoom level as a positive number to set after animation
  fit: undefined, // fit the viewport to the repositioned nodes, overrides pan and zoom

  // modifications
  padding: undefined, // padding around layout
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  spacingFactor: undefined, // a positive value which adjusts spacing between nodes (>1 means greater than usual spacing)

  // layout event callbacks
  ready: function(){}, // on layoutready
  stop: function(){} // on layoutstop
};
```
## Build targets

* `npm run test` : Run Mocha tests in `./test`
* `npm run build` : Build `./src/**` into `cytoscape-fisheye.js`
* `npm run watch` : Automatically build on changes with live reloading (N.b. you must already have an HTTP server running)
* `npm run dev` : Automatically build on changes with live reloading with webpack dev server
* `npm run lint` : Run eslint on the source

N.b. all builds use babel, so modern ES features can be used in the `src`.


## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Build the extension : `npm run build`
1. Commit the build : `git commit -am "Build for release"`
1. Bump the version number and tag: `npm version major|minor|patch`
1. Push to origin: `git push && git push --tags`
1. Publish to npm: `npm publish .`
1. If publishing to bower for the first time, you'll need to run `bower register cytoscape-fisheye https://github.com/d2fong&#x2F;cytoscape.js-fisheye.git`
