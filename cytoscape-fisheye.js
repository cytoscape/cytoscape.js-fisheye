(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeFisheye"] = factory();
	else
		root["cytoscapeFisheye"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const fisheye = __webpack_require__(3);
const assign = __webpack_require__(1);
// n.b. .layoutPositions() handles all these options for you

const defaults = Object.freeze({
  // fisheye
  focus: { x: 0, y: 0 }, // the model position which the fisheye view will be based on
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
  ready: function () {}, // on layoutready
  stop: function () {} // on layoutstop
});

function Layout(options) {
  this.options = assign({}, defaults, options);
}

Layout.prototype.run = function () {
  let layout = this;
  let options = this.options;
  let cy = options.cy;
  let eles = options.eles;
  let nodes = eles.nodes();

  const focusPos = options.focus;
  const fisheyeBB = options.fisheyeBoundingBox || eles.boundingBox();
  const distortionFactor = options.distortionFactor;

  const fisheyePos = function (ele) {
    return fisheye(focusPos, ele, fisheyeBB, distortionFactor);
  };

  // .layoutPositions() automatically handles the layout busywork for you
  nodes.filter(n => !n.isParent()).layoutPositions(layout, options, fisheyePos);
};

Layout.prototype.stop = function () {
  return this; // chaining
};

Layout.prototype.destroy = function () {
  return this; // chaining
};

module.exports = Layout;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// Simple, internal Object.assign() polyfill for options objects etc.

module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt, ...srcs) {
  srcs.forEach(src => {
    Object.keys(src).forEach(k => tgt[k] = src[k]);
  });

  return tgt;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const impl = __webpack_require__(0);

// registers the extension on a cytoscape lib ref
let register = function (cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('layout', 'fisheye', impl); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

const distort = (val, distortionFactor) => {
  return (distortionFactor + 1) * val / (distortionFactor * val + 1);
};

const fePosition = (focusPos, node, globalBB, distortion) => {
  const nodePos = node.position();
  let dNormX = Math.abs(nodePos.x - focusPos.x);
  let dNormY = Math.abs(nodePos.y - focusPos.y);

  let dMaxX;
  if (nodePos.x <= focusPos.x) {
    dMaxX = focusPos.x - globalBB.x1;
  } else {
    dMaxX = globalBB.x2 - focusPos.x;
  }

  let dMaxY;
  if (nodePos.y <= focusPos.y) {
    dMaxY = focusPos.y - globalBB.y1;
  } else {
    dMaxY = globalBB.y2 - focusPos.y;
  }

  const distortedFactorX = distort(dNormX / dMaxX, distortion);
  const distortedFactorY = distort(dNormY / dMaxY, distortion);

  let x = focusPos.x > nodePos.x ? focusPos.x - distortedFactorX * dMaxX : focusPos.x + distortedFactorX * dMaxX;
  let y = focusPos.y > nodePos.y ? focusPos.y - distortedFactorY * dMaxY : focusPos.y + distortedFactorY * dMaxY;

  return {
    x: x,
    y: y
  };
};

module.exports = fePosition;

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjZTVjMmQ3NWFhMmVjY2MwZjdiNiIsIndlYnBhY2s6Ly8vLi9zcmMvbGF5b3V0L2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9sYXlvdXQvZmlzaGV5ZS5qcyJdLCJuYW1lcyI6WyJmaXNoZXllIiwicmVxdWlyZSIsImFzc2lnbiIsImRlZmF1bHRzIiwiT2JqZWN0IiwiZnJlZXplIiwiZm9jdXMiLCJ4IiwieSIsImRpc3RvcnRpb25GYWN0b3IiLCJmaXNoZXllQm91bmRpbmdCb3giLCJ1bmRlZmluZWQiLCJhbmltYXRlIiwiYW5pbWF0aW9uRHVyYXRpb24iLCJhbmltYXRpb25FYXNpbmciLCJwYW4iLCJ6b29tIiwiZml0IiwicGFkZGluZyIsImJvdW5kaW5nQm94Iiwic3BhY2luZ0ZhY3RvciIsInJlYWR5Iiwic3RvcCIsIkxheW91dCIsIm9wdGlvbnMiLCJwcm90b3R5cGUiLCJydW4iLCJsYXlvdXQiLCJjeSIsImVsZXMiLCJub2RlcyIsImZvY3VzUG9zIiwiZmlzaGV5ZUJCIiwiZmlzaGV5ZVBvcyIsImVsZSIsImZpbHRlciIsIm4iLCJpc1BhcmVudCIsImxheW91dFBvc2l0aW9ucyIsImRlc3Ryb3kiLCJtb2R1bGUiLCJleHBvcnRzIiwiYmluZCIsInRndCIsInNyY3MiLCJmb3JFYWNoIiwic3JjIiwia2V5cyIsImsiLCJpbXBsIiwicmVnaXN0ZXIiLCJjeXRvc2NhcGUiLCJkaXN0b3J0IiwidmFsIiwiZmVQb3NpdGlvbiIsIm5vZGUiLCJnbG9iYWxCQiIsImRpc3RvcnRpb24iLCJub2RlUG9zIiwicG9zaXRpb24iLCJkTm9ybVgiLCJNYXRoIiwiYWJzIiwiZE5vcm1ZIiwiZE1heFgiLCJ4MSIsIngyIiwiZE1h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QUEvRzs7QUFFQSxTQUFPO0FBQ0w1RCxPQUFHQSxDQURFO0FBRUxDLE9BQUdBO0FBRkUsR0FBUDtBQUtELENBOUJEOztBQWlDQWdDLE9BQU9DLE9BQVAsR0FBaUJhLFVBQWpCLEMiLCJmaWxlIjoiY3l0b3NjYXBlLWZpc2hleWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJjeXRvc2NhcGVGaXNoZXllXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImN5dG9zY2FwZUZpc2hleWVcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjZTVjMmQ3NWFhMmVjY2MwZjdiNiIsImNvbnN0IGZpc2hleWUgPSByZXF1aXJlKCcuL2Zpc2hleWUnKTtcbmNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJy4uL2Fzc2lnbicpO1xuLy8gbi5iLiAubGF5b3V0UG9zaXRpb25zKCkgaGFuZGxlcyBhbGwgdGhlc2Ugb3B0aW9ucyBmb3IgeW91XG5cbmNvbnN0IGRlZmF1bHRzID0gT2JqZWN0LmZyZWV6ZSh7XG4gIC8vIGZpc2hleWVcbiAgZm9jdXM6IHt4OiAwLCB5OiAwfSwgLy8gdGhlIG1vZGVsIHBvc2l0aW9uIHdoaWNoIHRoZSBmaXNoZXllIHZpZXcgd2lsbCBiZSBiYXNlZCBvblxuICBkaXN0b3J0aW9uRmFjdG9yOiAxLCAvLyBob3cgbXVjaCBub2RlcyBhcmUgZGlzdG9ydGVkIHJlbGF0aXZlIHRvIHRoZWlyIHBvc2l0aW9uIGZyb20gdGhlIGZvY3VzXG4gIGZpc2hleWVCb3VuZGluZ0JveDogdW5kZWZpbmVkLCAvLyByZXN0cmljdCB3aGljaCBub2RlcyB3aWxsIGJlIGFmZmVjdGVkIGJ5IHRoZSBmaXNoZXllIHZpZXcuICBkZWZhdWx0IGlzIHRoZSBib3VuZGluZ2JveCBvZiB0aGUgZ2l2ZW4gZWxlbWVudHNcblxuICAvLyBhbmltYXRpb25cbiAgYW5pbWF0ZTogdW5kZWZpbmVkLCAvLyB3aGV0aGVyIG9yIG5vdCB0byBhbmltYXRlIHRoZSBsYXlvdXRcbiAgYW5pbWF0aW9uRHVyYXRpb246IHVuZGVmaW5lZCwgLy8gZHVyYXRpb24gb2YgYW5pbWF0aW9uIGluIG1zLCBpZiBlbmFibGVkXG4gIGFuaW1hdGlvbkVhc2luZzogdW5kZWZpbmVkLCAvLyBlYXNpbmcgb2YgYW5pbWF0aW9uLCBpZiBlbmFibGVkXG5cbiAgLy8gdmlld3BvcnRcbiAgcGFuOiB1bmRlZmluZWQsIC8vIHBhbiB0aGUgZ3JhcGggdG8gdGhlIHByb3ZpZGVkIHBvc2l0aW9uLCBnaXZlbiBhcyB7IHgsIHkgfVxuICB6b29tOiB1bmRlZmluZWQsIC8vIHpvb20gbGV2ZWwgYXMgYSBwb3NpdGl2ZSBudW1iZXIgdG8gc2V0IGFmdGVyIGFuaW1hdGlvblxuICBmaXQ6IHVuZGVmaW5lZCwgLy8gZml0IHRoZSB2aWV3cG9ydCB0byB0aGUgcmVwb3NpdGlvbmVkIG5vZGVzLCBvdmVycmlkZXMgcGFuIGFuZCB6b29tXG5cbiAgLy8gbW9kaWZpY2F0aW9uc1xuICBwYWRkaW5nOiB1bmRlZmluZWQsIC8vIHBhZGRpbmcgYXJvdW5kIGxheW91dFxuICBib3VuZGluZ0JveDogdW5kZWZpbmVkLCAvLyBjb25zdHJhaW4gbGF5b3V0IGJvdW5kczsgeyB4MSwgeTEsIHgyLCB5MiB9IG9yIHsgeDEsIHkxLCB3LCBoIH1cbiAgc3BhY2luZ0ZhY3RvcjogdW5kZWZpbmVkLCAvLyBhIHBvc2l0aXZlIHZhbHVlIHdoaWNoIGFkanVzdHMgc3BhY2luZyBiZXR3ZWVuIG5vZGVzICg+MSBtZWFucyBncmVhdGVyIHRoYW4gdXN1YWwgc3BhY2luZylcblxuICAvLyBsYXlvdXQgZXZlbnQgY2FsbGJhY2tzXG4gIHJlYWR5OiBmdW5jdGlvbigpe30sIC8vIG9uIGxheW91dHJlYWR5XG4gIHN0b3A6IGZ1bmN0aW9uKCl7fSAvLyBvbiBsYXlvdXRzdG9wXG59KTtcblxuZnVuY3Rpb24gTGF5b3V0ICggb3B0aW9ucyApIHtcbiAgdGhpcy5vcHRpb25zID0gYXNzaWduKCB7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xufVxuXG5MYXlvdXQucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCl7XG4gIGxldCBsYXlvdXQgPSB0aGlzO1xuICBsZXQgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgbGV0IGN5ID0gb3B0aW9ucy5jeTtcbiAgbGV0IGVsZXMgPSBvcHRpb25zLmVsZXM7XG4gIGxldCBub2RlcyA9IGVsZXMubm9kZXMoKTtcblxuICBjb25zdCBmb2N1c1BvcyA9IG9wdGlvbnMuZm9jdXM7XG4gIGNvbnN0IGZpc2hleWVCQiA9IG9wdGlvbnMuZmlzaGV5ZUJvdW5kaW5nQm94IHx8IGVsZXMuYm91bmRpbmdCb3goKTtcbiAgY29uc3QgZGlzdG9ydGlvbkZhY3RvciA9IG9wdGlvbnMuZGlzdG9ydGlvbkZhY3RvcjtcblxuICBjb25zdCBmaXNoZXllUG9zID0gZnVuY3Rpb24gKGVsZSkge1xuICAgIHJldHVybiBmaXNoZXllKGZvY3VzUG9zLCBlbGUsIGZpc2hleWVCQiwgZGlzdG9ydGlvbkZhY3Rvcik7XG4gIH07XG4gIFxuICAvLyAubGF5b3V0UG9zaXRpb25zKCkgYXV0b21hdGljYWxseSBoYW5kbGVzIHRoZSBsYXlvdXQgYnVzeXdvcmsgZm9yIHlvdVxuICBub2Rlcy5maWx0ZXIobiA9PiAhbi5pc1BhcmVudCgpKS5sYXlvdXRQb3NpdGlvbnMoIGxheW91dCwgb3B0aW9ucywgZmlzaGV5ZVBvcyApO1xufTtcblxuTGF5b3V0LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHRoaXM7IC8vIGNoYWluaW5nXG59O1xuXG5MYXlvdXQucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gdGhpczsgLy8gY2hhaW5pbmdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5b3V0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xheW91dC9pbmRleC5qcyIsIi8vIFNpbXBsZSwgaW50ZXJuYWwgT2JqZWN0LmFzc2lnbigpIHBvbHlmaWxsIGZvciBvcHRpb25zIG9iamVjdHMgZXRjLlxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gIT0gbnVsbCA/IE9iamVjdC5hc3NpZ24uYmluZCggT2JqZWN0ICkgOiBmdW5jdGlvbiggdGd0LCAuLi5zcmNzICl7XG4gIHNyY3MuZm9yRWFjaCggc3JjID0+IHtcbiAgICBPYmplY3Qua2V5cyggc3JjICkuZm9yRWFjaCggayA9PiB0Z3Rba10gPSBzcmNba10gKTtcbiAgfSApO1xuXG4gIHJldHVybiB0Z3Q7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Fzc2lnbi5qcyIsImNvbnN0IGltcGwgPSByZXF1aXJlKCcuL2xheW91dCcpO1xuXG4vLyByZWdpc3RlcnMgdGhlIGV4dGVuc2lvbiBvbiBhIGN5dG9zY2FwZSBsaWIgcmVmXG5sZXQgcmVnaXN0ZXIgPSBmdW5jdGlvbiggY3l0b3NjYXBlICl7XG4gIGlmKCAhY3l0b3NjYXBlICl7IHJldHVybjsgfSAvLyBjYW4ndCByZWdpc3RlciBpZiBjeXRvc2NhcGUgdW5zcGVjaWZpZWRcblxuICBjeXRvc2NhcGUoICdsYXlvdXQnLCAnZmlzaGV5ZScsIGltcGwgKTsgLy8gcmVnaXN0ZXIgd2l0aCBjeXRvc2NhcGUuanNcbn07XG5cbmlmKCB0eXBlb2YgY3l0b3NjYXBlICE9PSAndW5kZWZpbmVkJyApeyAvLyBleHBvc2UgdG8gZ2xvYmFsIGN5dG9zY2FwZSAoaS5lLiB3aW5kb3cuY3l0b3NjYXBlKVxuICByZWdpc3RlciggY3l0b3NjYXBlICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVnaXN0ZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJjb25zdCBkaXN0b3J0ID0gKHZhbCwgZGlzdG9ydGlvbkZhY3RvcikgPT4ge1xuICByZXR1cm4gKCAoIGRpc3RvcnRpb25GYWN0b3IgKyAxKSAqIHZhbCApIC8gKCAoIGRpc3RvcnRpb25GYWN0b3IgKiB2YWwpICsgMSApO1xufTtcblxuXG5jb25zdCBmZVBvc2l0aW9uID0gKGZvY3VzUG9zLCBub2RlLCBnbG9iYWxCQiwgZGlzdG9ydGlvbikgPT4ge1xuICBjb25zdCBub2RlUG9zID0gbm9kZS5wb3NpdGlvbigpO1xuICBsZXQgZE5vcm1YID0gTWF0aC5hYnMoKG5vZGVQb3MueCAtIGZvY3VzUG9zLngpKTtcbiAgbGV0IGROb3JtWSA9IE1hdGguYWJzKChub2RlUG9zLnkgLSBmb2N1c1Bvcy55KSk7XG5cbiAgbGV0IGRNYXhYO1xuICBpZiAobm9kZVBvcy54IDw9IGZvY3VzUG9zLngpIHtcbiAgICBkTWF4WCA9IGZvY3VzUG9zLnggLSBnbG9iYWxCQi54MTtcbiAgfSBlbHNlIHtcbiAgICBkTWF4WCA9IGdsb2JhbEJCLngyIC0gZm9jdXNQb3MueDtcbiAgfVxuXG4gIGxldCBkTWF4WTtcbiAgaWYgKG5vZGVQb3MueSA8PSBmb2N1c1Bvcy55KSB7XG4gICAgZE1heFkgPSBmb2N1c1Bvcy55IC0gZ2xvYmFsQkIueTE7XG4gIH0gZWxzZSB7XG4gICAgZE1heFkgPSBnbG9iYWxCQi55MiAtIGZvY3VzUG9zLnk7XG4gIH1cblxuICBjb25zdCBkaXN0b3J0ZWRGYWN0b3JYID0gZGlzdG9ydChkTm9ybVggLyBkTWF4WCwgZGlzdG9ydGlvbik7XG4gIGNvbnN0IGRpc3RvcnRlZEZhY3RvclkgPSBkaXN0b3J0KGROb3JtWSAvIGRNYXhZLCBkaXN0b3J0aW9uKTtcblxuICBsZXQgeCA9IGZvY3VzUG9zLnggPiBub2RlUG9zLnggPyBmb2N1c1Bvcy54IC0gKCBkaXN0b3J0ZWRGYWN0b3JYICogZE1heFggKSA6IGZvY3VzUG9zLnggKyAoIGRpc3RvcnRlZEZhY3RvclggKiBkTWF4WCApO1xuICBsZXQgeSA9IGZvY3VzUG9zLnkgPiBub2RlUG9zLnkgPyBmb2N1c1Bvcy55IC0gKCBkaXN0b3J0ZWRGYWN0b3JZICogZE1heFkgKSA6IGZvY3VzUG9zLnkgKyAoIGRpc3RvcnRlZEZhY3RvclkgKiBkTWF4WSApO1xuXG4gIHJldHVybiB7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH07XG5cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmZVBvc2l0aW9uO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9sYXlvdXQvZmlzaGV5ZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=