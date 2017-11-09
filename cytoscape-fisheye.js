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

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fisheye = __webpack_require__(3);
var assign = __webpack_require__(1);
// n.b. .layoutPositions() handles all these options for you

var defaults = Object.freeze({
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
  ready: function ready() {}, // on layoutready
  stop: function stop() {} // on layoutstop
});

var Layout = function () {
  function Layout(options) {
    _classCallCheck(this, Layout);

    this.options = assign({}, defaults, options);
  }

  _createClass(Layout, [{
    key: 'run',
    value: function run() {
      var layout = this;
      var options = this.options;
      var cy = options.cy;
      var eles = options.eles;
      var nodes = eles.nodes();

      var focusPos = options.focus;
      var fisheyeBB = options.fisheyeBoundingBox || eles.boundingBox();
      var distortionFactor = options.distortionFactor;

      var fisheyePos = function fisheyePos(ele) {
        var fePos = fisheye(focusPos, ele, fisheyeBB, distortionFactor);
        return fePos;
      };

      // .layoutPositions() automatically handles the layout busywork for you
      nodes.filter(function (n) {
        return !n.isParent();
      }).layoutPositions(layout, options, fisheyePos);
    }
  }]);

  return Layout;
}();

module.exports = Layout;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Simple, internal Object.assign() polyfill for options objects etc.

module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
  for (var _len = arguments.length, srcs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    srcs[_key - 1] = arguments[_key];
  }

  srcs.forEach(function (src) {
    Object.keys(src).forEach(function (k) {
      return tgt[k] = src[k];
    });
  });

  return tgt;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(0);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var distort = function distort(val, distortionFactor) {
  return (distortionFactor + 1) * val / (distortionFactor * val + 1);
};

var fePosition = function fePosition(focusPos, node, globalBB, distortion) {
  var nodePos = node.position();
  var dNormX = Math.abs(nodePos.x - focusPos.x);
  var dNormY = Math.abs(nodePos.y - focusPos.y);

  var dMaxX = void 0;
  if (nodePos.x <= focusPos.x) {
    dMaxX = focusPos.x - globalBB.x1;
  } else {
    dMaxX = globalBB.x2 - focusPos.x;
  }

  var dMaxY = void 0;
  if (nodePos.y <= focusPos.y) {
    dMaxY = focusPos.y - globalBB.y1;
  } else {
    dMaxY = globalBB.y2 - focusPos.y;
  }

  var distortedFactorX = distort(dNormX / dMaxX, distortion);
  var distortedFactorY = distort(dNormY / dMaxY, distortion);

  var x = focusPos.x > nodePos.x ? focusPos.x - distortedFactorX * dMaxX : focusPos.x + distortedFactorX * dMaxX;
  var y = focusPos.y > nodePos.y ? focusPos.y - distortedFactorY * dMaxY : focusPos.y + distortedFactorY * dMaxY;

  return {
    x: x,
    y: y
  };
};

module.exports = fePosition;

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA5MjdmMTcyMjgxN2VjZDA2YjQzNSIsIndlYnBhY2s6Ly8vLi9zcmMvbGF5b3V0L2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9sYXlvdXQvZmlzaGV5ZS5qcyJdLCJuYW1lcyI6WyJmaXNoZXllIiwicmVxdWlyZSIsImFzc2lnbiIsImRlZmF1bHRzIiwiT2JqZWN0IiwiZnJlZXplIiwiZm9jdXMiLCJ4IiwieSIsImRpc3RvcnRpb25GYWN0b3IiLCJmaXNoZXllQm91bmRpbmdCb3giLCJ1bmRlZmluZWQiLCJhbmltYXRlIiwiYW5pbWF0aW9uRHVyYXRpb24iLCJhbmltYXRpb25FYXNpbmciLCJwYW4iLCJ6b29tIiwiZml0IiwicGFkZGluZyIsImJvdW5kaW5nQm94Iiwic3BhY2luZ0ZhY3RvciIsInJlYWR5Iiwic3RvcCIsIkxheW91dCIsIm9wdGlvbnMiLCJsYXlvdXQiLCJjeSIsImVsZXMiLCJub2RlcyIsImZvY3VzUG9zIiwiZmlzaGV5ZUJCIiwiZmlzaGV5ZVBvcyIsImVsZSIsImZlUG9zIiwiZmlsdGVyIiwibiIsImlzUGFyZW50IiwibGF5b3V0UG9zaXRpb25zIiwibW9kdWxlIiwiZXhwb3J0cyIsImJpbmQiLCJ0Z3QiLCJzcmNzIiwiZm9yRWFjaCIsImtleXMiLCJzcmMiLCJrIiwiaW1wbCIsInJlZ2lzdGVyIiwiY3l0b3NjYXBlIiwiZGlzdG9ydCIsInZhbCIsImZlUG9zaXRpb24iLCJub2RlIiwiZ2xvYmFsQkIiLCJkaXN0b3J0aW9uIiwibm9kZVBvcyIsInBvc2l0aW9uIiwiZE5vcm1YIiwiTWF0aCIsImFicyIsImROb3JtWSIsImRNYXhYIiwieDEiLCJ4MiIsImRNYXhZIiwieTEiLCJ5MiIsImRpc3Rv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QWlCYSxVQUFqQixDIiwiZmlsZSI6ImN5dG9zY2FwZS1maXNoZXllLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiY3l0b3NjYXBlRmlzaGV5ZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJjeXRvc2NhcGVGaXNoZXllXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOTI3ZjE3MjI4MTdlY2QwNmI0MzUiLCJjb25zdCBmaXNoZXllID0gcmVxdWlyZSgnLi9maXNoZXllJyk7XG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCcuLi9hc3NpZ24nKTtcbi8vIG4uYi4gLmxheW91dFBvc2l0aW9ucygpIGhhbmRsZXMgYWxsIHRoZXNlIG9wdGlvbnMgZm9yIHlvdVxuXG5jb25zdCBkZWZhdWx0cyA9IE9iamVjdC5mcmVlemUoe1xuICAvLyBmaXNoZXllXG4gIGZvY3VzOiB7eDogMCwgeTogMH0sIC8vIHRoZSBtb2RlbCBwb3NpdGlvbiB3aGljaCB0aGUgZmlzaGV5ZSB2aWV3IHdpbGwgYmUgYmFzZWQgb25cbiAgZGlzdG9ydGlvbkZhY3RvcjogMSwgLy8gaG93IG11Y2ggbm9kZXMgYXJlIGRpc3RvcnRlZCByZWxhdGl2ZSB0byB0aGVpciBwb3NpdGlvbiBmcm9tIHRoZSBmb2N1c1xuICBmaXNoZXllQm91bmRpbmdCb3g6IHVuZGVmaW5lZCwgLy8gcmVzdHJpY3Qgd2hpY2ggbm9kZXMgd2lsbCBiZSBhZmZlY3RlZCBieSB0aGUgZmlzaGV5ZSB2aWV3LiAgZGVmYXVsdCBpcyB0aGUgYm91bmRpbmdib3ggb2YgdGhlIGdpdmVuIGVsZW1lbnRzXG5cbiAgLy8gYW5pbWF0aW9uXG4gIGFuaW1hdGU6IHVuZGVmaW5lZCwgLy8gd2hldGhlciBvciBub3QgdG8gYW5pbWF0ZSB0aGUgbGF5b3V0XG4gIGFuaW1hdGlvbkR1cmF0aW9uOiB1bmRlZmluZWQsIC8vIGR1cmF0aW9uIG9mIGFuaW1hdGlvbiBpbiBtcywgaWYgZW5hYmxlZFxuICBhbmltYXRpb25FYXNpbmc6IHVuZGVmaW5lZCwgLy8gZWFzaW5nIG9mIGFuaW1hdGlvbiwgaWYgZW5hYmxlZFxuXG4gIC8vIHZpZXdwb3J0XG4gIHBhbjogdW5kZWZpbmVkLCAvLyBwYW4gdGhlIGdyYXBoIHRvIHRoZSBwcm92aWRlZCBwb3NpdGlvbiwgZ2l2ZW4gYXMgeyB4LCB5IH1cbiAgem9vbTogdW5kZWZpbmVkLCAvLyB6b29tIGxldmVsIGFzIGEgcG9zaXRpdmUgbnVtYmVyIHRvIHNldCBhZnRlciBhbmltYXRpb25cbiAgZml0OiB1bmRlZmluZWQsIC8vIGZpdCB0aGUgdmlld3BvcnQgdG8gdGhlIHJlcG9zaXRpb25lZCBub2Rlcywgb3ZlcnJpZGVzIHBhbiBhbmQgem9vbVxuXG4gIC8vIG1vZGlmaWNhdGlvbnNcbiAgcGFkZGluZzogdW5kZWZpbmVkLCAvLyBwYWRkaW5nIGFyb3VuZCBsYXlvdXRcbiAgYm91bmRpbmdCb3g6IHVuZGVmaW5lZCwgLy8gY29uc3RyYWluIGxheW91dCBib3VuZHM7IHsgeDEsIHkxLCB4MiwgeTIgfSBvciB7IHgxLCB5MSwgdywgaCB9XG4gIHNwYWNpbmdGYWN0b3I6IHVuZGVmaW5lZCwgLy8gYSBwb3NpdGl2ZSB2YWx1ZSB3aGljaCBhZGp1c3RzIHNwYWNpbmcgYmV0d2VlbiBub2RlcyAoPjEgbWVhbnMgZ3JlYXRlciB0aGFuIHVzdWFsIHNwYWNpbmcpXG5cbiAgLy8gbGF5b3V0IGV2ZW50IGNhbGxiYWNrc1xuICByZWFkeTogZnVuY3Rpb24oKXt9LCAvLyBvbiBsYXlvdXRyZWFkeVxuICBzdG9wOiBmdW5jdGlvbigpe30gLy8gb24gbGF5b3V0c3RvcFxufSk7XG5cbmNsYXNzIExheW91dCB7XG4gIGNvbnN0cnVjdG9yKCBvcHRpb25zICl7XG4gICAgdGhpcy5vcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gIH1cblxuICBydW4oKXtcbiAgICBsZXQgbGF5b3V0ID0gdGhpcztcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICBsZXQgY3kgPSBvcHRpb25zLmN5O1xuICAgIGxldCBlbGVzID0gb3B0aW9ucy5lbGVzO1xuICAgIGxldCBub2RlcyA9IGVsZXMubm9kZXMoKTtcblxuICAgIGNvbnN0IGZvY3VzUG9zID0gb3B0aW9ucy5mb2N1cztcbiAgICBjb25zdCBmaXNoZXllQkIgPSBvcHRpb25zLmZpc2hleWVCb3VuZGluZ0JveCB8fCBlbGVzLmJvdW5kaW5nQm94KCk7XG4gICAgY29uc3QgZGlzdG9ydGlvbkZhY3RvciA9IG9wdGlvbnMuZGlzdG9ydGlvbkZhY3RvcjtcblxuICAgIGNvbnN0IGZpc2hleWVQb3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICBjb25zdCBmZVBvcyA9IGZpc2hleWUoZm9jdXNQb3MsIGVsZSwgZmlzaGV5ZUJCLCBkaXN0b3J0aW9uRmFjdG9yKTtcbiAgICAgIHJldHVybiBmZVBvcztcbiAgICB9O1xuICAgIFxuICAgIC8vIC5sYXlvdXRQb3NpdGlvbnMoKSBhdXRvbWF0aWNhbGx5IGhhbmRsZXMgdGhlIGxheW91dCBidXN5d29yayBmb3IgeW91XG4gICAgbm9kZXMuZmlsdGVyKG4gPT4gIW4uaXNQYXJlbnQoKSkubGF5b3V0UG9zaXRpb25zKCBsYXlvdXQsIG9wdGlvbnMsIGZpc2hleWVQb3MgKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9sYXlvdXQvaW5kZXguanMiLCIvLyBTaW1wbGUsIGludGVybmFsIE9iamVjdC5hc3NpZ24oKSBwb2x5ZmlsbCBmb3Igb3B0aW9ucyBvYmplY3RzIGV0Yy5cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduICE9IG51bGwgPyBPYmplY3QuYXNzaWduLmJpbmQoIE9iamVjdCApIDogZnVuY3Rpb24oIHRndCwgLi4uc3JjcyApe1xuICBzcmNzLmZvckVhY2goIHNyYyA9PiB7XG4gICAgT2JqZWN0LmtleXMoIHNyYyApLmZvckVhY2goIGsgPT4gdGd0W2tdID0gc3JjW2tdICk7XG4gIH0gKTtcblxuICByZXR1cm4gdGd0O1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hc3NpZ24uanMiLCJjb25zdCBpbXBsID0gcmVxdWlyZSgnLi9sYXlvdXQnKTtcblxuLy8gcmVnaXN0ZXJzIHRoZSBleHRlbnNpb24gb24gYSBjeXRvc2NhcGUgbGliIHJlZlxubGV0IHJlZ2lzdGVyID0gZnVuY3Rpb24oIGN5dG9zY2FwZSApe1xuICBpZiggIWN5dG9zY2FwZSApeyByZXR1cm47IH0gLy8gY2FuJ3QgcmVnaXN0ZXIgaWYgY3l0b3NjYXBlIHVuc3BlY2lmaWVkXG5cbiAgY3l0b3NjYXBlKCAnbGF5b3V0JywgJ2Zpc2hleWUnLCBpbXBsICk7IC8vIHJlZ2lzdGVyIHdpdGggY3l0b3NjYXBlLmpzXG59O1xuXG5pZiggdHlwZW9mIGN5dG9zY2FwZSAhPT0gJ3VuZGVmaW5lZCcgKXsgLy8gZXhwb3NlIHRvIGdsb2JhbCBjeXRvc2NhcGUgKGkuZS4gd2luZG93LmN5dG9zY2FwZSlcbiAgcmVnaXN0ZXIoIGN5dG9zY2FwZSApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiY29uc3QgZGlzdG9ydCA9ICh2YWwsIGRpc3RvcnRpb25GYWN0b3IpID0+IHtcbiAgcmV0dXJuICggKCBkaXN0b3J0aW9uRmFjdG9yICsgMSkgKiB2YWwgKSAvICggKCBkaXN0b3J0aW9uRmFjdG9yICogdmFsKSArIDEgKTtcbn07XG5cblxuY29uc3QgZmVQb3NpdGlvbiA9IChmb2N1c1Bvcywgbm9kZSwgZ2xvYmFsQkIsIGRpc3RvcnRpb24pID0+IHtcbiAgY29uc3Qgbm9kZVBvcyA9IG5vZGUucG9zaXRpb24oKTtcbiAgbGV0IGROb3JtWCA9IE1hdGguYWJzKChub2RlUG9zLnggLSBmb2N1c1Bvcy54KSk7XG4gIGxldCBkTm9ybVkgPSBNYXRoLmFicygobm9kZVBvcy55IC0gZm9jdXNQb3MueSkpO1xuXG4gIGxldCBkTWF4WDtcbiAgaWYgKG5vZGVQb3MueCA8PSBmb2N1c1Bvcy54KSB7XG4gICAgZE1heFggPSBmb2N1c1Bvcy54IC0gZ2xvYmFsQkIueDE7XG4gIH0gZWxzZSB7XG4gICAgZE1heFggPSBnbG9iYWxCQi54MiAtIGZvY3VzUG9zLng7XG4gIH1cblxuICBsZXQgZE1heFk7XG4gIGlmIChub2RlUG9zLnkgPD0gZm9jdXNQb3MueSkge1xuICAgIGRNYXhZID0gZm9jdXNQb3MueSAtIGdsb2JhbEJCLnkxO1xuICB9IGVsc2Uge1xuICAgIGRNYXhZID0gZ2xvYmFsQkIueTIgLSBmb2N1c1Bvcy55O1xuICB9XG5cbiAgY29uc3QgZGlzdG9ydGVkRmFjdG9yWCA9IGRpc3RvcnQoZE5vcm1YIC8gZE1heFgsIGRpc3RvcnRpb24pO1xuICBjb25zdCBkaXN0b3J0ZWRGYWN0b3JZID0gZGlzdG9ydChkTm9ybVkgLyBkTWF4WSwgZGlzdG9ydGlvbik7XG5cbiAgbGV0IHggPSBmb2N1c1Bvcy54ID4gbm9kZVBvcy54ID8gZm9jdXNQb3MueCAtICggZGlzdG9ydGVkRmFjdG9yWCAqIGRNYXhYICkgOiBmb2N1c1Bvcy54ICsgKCBkaXN0b3J0ZWRGYWN0b3JYICogZE1heFggKTtcbiAgbGV0IHkgPSBmb2N1c1Bvcy55ID4gbm9kZVBvcy55ID8gZm9jdXNQb3MueSAtICggZGlzdG9ydGVkRmFjdG9yWSAqIGRNYXhZICkgOiBmb2N1c1Bvcy55ICsgKCBkaXN0b3J0ZWRGYWN0b3JZICogZE1heFkgKTtcblxuICByZXR1cm4ge1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9O1xuXG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZmVQb3NpdGlvbjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGF5b3V0L2Zpc2hleWUuanMiXSwic291cmNlUm9vdCI6IiJ9