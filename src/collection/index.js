// focus node means the point of focus in the fisheye view


const distort = (val, distortionFactor) => {
  return ( ( distortionFactor + 1) * val ) / ( ( distortionFactor * val) + 1 );
};

// The position of a node for a fisheye view is a function of the node's position
// as well as the focus node's position
const fePosition = (node, focusNode, opts) => {
  const nodePos = node.position();
  const focusPos = focusNode.position();

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

  // your extension impl...
  const focusNode = eles[0];
  const focusNodeComplement = focusNode.absoluteComplement();

  const viewportBB = cy.nodes().renderedBoundingBox({includeLabels: false});

  cy.nodes().difference(focusNode).forEach((node) => {
    const focusRPos = focusNode.renderedPosition();
    const nodeRPos = node.renderedPosition();
    const dMaxX = Math.abs(focusRPos.x - viewportBB.x2);
    const dNormX = Math.abs(focusRPos.x - nodeRPos.x);
    const dNormY = Math.abs(focusRPos.y - nodeRPos.y);
    const dMaxY = Math.abs(focusRPos.y - viewportBB.y2);

    const distortedFactorX = distort(dNormX / dMaxX, 1);
    const distortedFactorY = distort(dNormY / dMaxY, 1);

    const newPos =  {
      x: ( distortedFactorX * dMaxX ) + focusRPos.x,
      y: ( distortedFactorY * dMaxY ) + focusRPos.y
    };

    node.position(newPos);
  });
  return this; // chainability
};