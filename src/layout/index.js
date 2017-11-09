const fisheye = require('./fisheye');
const assign = require('../assign');
// n.b. .layoutPositions() handles all these options for you

const defaults = Object.freeze({
  // fisheye
  focus: {x: 0, y: 0}, // the model position which the fisheye view will be based on
  distortionFactor: 1, // how much nodes are distorted relative to their position from the focus
  fisheyeBoundingBox: undefined, // restrict which nodes will be affected by the fisheye view.  default is the boundingbox of the given elements

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
});

class Layout {
  constructor( options ){
    this.options = assign({}, defaults, options);
  }

  run(){
    let layout = this;
    let options = this.options;
    let cy = options.cy;
    let eles = options.eles;
    let nodes = eles.nodes();

    const focusPos = options.focus;
    const fisheyeBB = options.fisheyeBoundingBox || eles.boundingBox();
    const distortionFactor = options.distortionFactor;

    const fisheyePos = function (ele) {
      const fePos = fisheye(focusPos, ele, fisheyeBB, distortionFactor);
      return fePos;
    };
    
    // .layoutPositions() automatically handles the layout busywork for you
    nodes.filter(n => !n.isParent()).layoutPositions( layout, options, fisheyePos );
  }
}

module.exports = Layout;
