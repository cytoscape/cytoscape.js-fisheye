// focus node means the point of focus in the fisheye view


const distort = (val, distortionFactor) => {
  return ( ( distortionFactor + 1) * val ) / ( ( distortionFactor * val) + 1 );
};

// The position of a node for a fisheye view is a function of the node's position
// as well as the focus node's position
// node - specific node to calculate the fisheye position
// focusNode - the node that is the focus of the fisheye view
// globalBB - the bounding box for the fisheye view 
const fePosition = (node, focusNode, globalBB, opts) => {
  const focusRPos = focusNode.renderedPosition();
  const nodeRPos = node.renderedPosition();

  let dNormX = Math.abs((nodeRPos.x - focusRPos.x));
  let dNormY = Math.abs((nodeRPos.y - focusRPos.y));

  let dMaxX;
  if (nodeRPos.x <= focusRPos.x) {
    dMaxX = focusRPos.x - globalBB.x1;
  } else {
    dMaxX = globalBB.x2 - focusRPos.x;
  }

  let dMaxY;
  if (nodeRPos.y <= focusRPos.y) {
    dMaxY = focusRPos.y - globalBB.y1;
  } else {
    dMaxY = globalBB.y2 - focusRPos.y;
  }

  const distortedFactorX = distort(dNormX / dMaxX, 1);
  const distortedFactorY = distort(dNormY / dMaxY, 1);

  let x = focusRPos.x > nodeRPos.x ? focusRPos.x - ( distortedFactorX * dMaxX ) : focusRPos.x + ( distortedFactorX * dMaxX );
  let y = focusRPos.y > nodeRPos.y ? focusRPos.y - ( distortedFactorY * dMaxY ) : focusRPos.y + ( distortedFactorY * dMaxY );

  return {
    x: x,
    y: y
  };
};

const feSize = (node, focusNode, opts) => {
  const nodeSize = node.layoutDimenions({
    nodeDimensionsIncludeLabels: false
  });
  const nodePos = node.position();

  const focusPos = focusNode.position();
};

const maxDetail = (node, focusNode, opts) => {
  const nodeFisheyeSize = feSize(node, focusNode, opts);
  const maxDetail = opts.maxNodeDetail;

};

const visualWorth = (node, focusNode, opts) => {
  const nodePos = node.position();
  const focusPos = focusNode.position();

};


module.exports = function (opts) {
  let eles = this;
  let cy = this.cy();

  if (eles.empty()) { return }

  const focusNode = eles[0];
  const fishEyeBB = cy.nodes().renderedBoundingBox({includeLabels: false});

  cy.nodes().difference(focusNode).forEach((node) => {

    const newPos = fePosition(node, focusNode, fishEyeBB, opts);
    if (opts && opts.animate) {
      node.animate({
        renderedPosition: newPos,
      });
    } else {
      node.renderedPosition(newPos);
    }
  });
  return this; // chainability
};