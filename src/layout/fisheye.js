const distort = (val, distortionFactor) => {
  return ( ( distortionFactor + 1) * val ) / ( ( distortionFactor * val) + 1 );
};


const fePosition = (focusPos, node, globalBB, distortion) => {
  const nodePos = node.position();
  let dNormX = Math.abs((nodePos.x - focusPos.x));
  let dNormY = Math.abs((nodePos.y - focusPos.y));

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

  let x = focusPos.x > nodePos.x ? focusPos.x - ( distortedFactorX * dMaxX ) : focusPos.x + ( distortedFactorX * dMaxX );
  let y = focusPos.y > nodePos.y ? focusPos.y - ( distortedFactorY * dMaxY ) : focusPos.y + ( distortedFactorY * dMaxY );

  return {
    x: x,
    y: y
  };

};


module.exports = fePosition;