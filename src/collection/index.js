// focus node means the point of focus in the fisheye view


const distortDimension = (dim, opts) => {
  const distortionFactor = opts.distortionFactor;
  return ( ( distortionFactor + 1) * dim ) / ( ( distortionFactor * dim) + 1 );
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


module.exports = function(){
  let eles = this;
  let cy = this.cy();

  if (eles.empty()) { return }

  // your extension impl...
  const focusNode = eles[0];
  const focusNodeComplement = focusNode.absoluteComplement();

  const renderedBB = cy.nodes().renderedBoundingBox({includeLabels: false});
  const dMaxX = Math.abs(focusNode.renderedPosition().x - renderedBB.x2);


  return this; // chainability
};