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

  const dMaxX = Math.abs((focusRPos.x - globalBB.x2));
  const dMaxY = Math.abs((focusRPos.y - globalBB.y2));

  let dNormX;
  if (nodeRPos.x >= focusRPos.x) {
    dNormX = nodeRPos.x - focusRPos.x;
  } else {
    dNormX = focusRPos.x - nodeRPos.x;
  }

  let dNormY;
  if (nodeRPos.y >= focusRPos.y) {
    dNormY = nodeRPos.y - focusRPos.y;
  } else {
    dNormY = focusRPos.y - nodeRPos.y;
  }

  const distortedFactorX = distort(dNormX / dMaxX, 1);
  const distortedFactorY = distort(dNormY / dMaxY, 1);

  return {
    x: ( distortedFactorX * dMaxX ) + focusRPos.x,
    y: ( distortedFactorY * dMaxY ) + focusRPos.y
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