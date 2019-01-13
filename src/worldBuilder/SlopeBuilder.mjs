import ndarray from "ndarray";

const createNDArray = list =>
  ndarray(new Int8Array([0, 1, 0, -1, 0, -1, 0, 0, 0]), [3, 3]);

/*
//1 means tile must be higher than middle. 0 means don't care, -1 tile must NOT be higher
const slopeTypes2 = {
  SLOPE_SOUTH: createNDArray([0, 1, 0, -1, 0, -1, 0, 0, 0]),
  SLOPE_WEST: createNDArray([0, -1, 0, 0, 0, 1, 0, -1, 0]),
  SLOPE_EAST: createNDArray([0, -1, 0, 1, 0, 0, 0, -1, 0]),
  SLOPE_NORTH: createNDArray([0, 0, 0, -1, 0, -1, 0, 1, 0]),
  SLOPE_NORTHWEST_INVERTED: createNDArray([0, 0, 0, 0, 0, 1, 0, 1, 1]),
  SLOPE_NORTHEAST_INVERTED: createNDArray([0, 0, 0, 1, 0, 0, 1, 1, 0]),
  SLOPE_SOUTHWEST_INVERTED: createNDArray([0, 1, 1, 0, 0, 1, 0, 0, 0]),
  SLOPE_SOUTHEAST_INVERTED: createNDArray([1, 1, 0, 1, 0, 0, 0, 0, 0]),
  SLOPE_NORTHWEST: createNDArray([0, 0, 0, 0, 0, -1, 0, -1, 1]),
  SLOPE_NORTHEAST: createNDArray([0, 0, 0, -1, 0, 0, 1, -1, 0]),
  SLOPE_SOUTHWEST: createNDArray([0, -1, 1, 0, 0, -1, 0, 0, 0]),
  SLOPE_SOUTHEAST: createNDArray([1, -1, 0, -1, 0, 0, 0, 0, 0])
};
*/

//1: height is same or more, -1 height is lower, 0 does not matter
const slopeTypes = {
  SLOPE_SOUTH: createNDArray([0, 1, 0, 1, 1, 1, 0, -1, 0]),
  SLOPE_WEST: createNDArray([0, 1, 0, -1, 1, 1, 0, 1, 0]),
  SLOPE_EAST: createNDArray([0, 1, 0, 1, 1, -1, 0, 1, 0]),
  SLOPE_NORTH: createNDArray([0, -1, 0, 1, 1, 1, 0, 1, 0]),
  SLOPE_NORTHWEST_INVERTED: createNDArray([-1, 1, 0, 1, 1, 0, 0, 0, 0]),
  SLOPE_NORTHEAST_INVERTED: createNDArray([0, 1, -1, 1, 1, 1, 0, 1, 0]),
  SLOPE_SOUTHWEST_INVERTED: createNDArray([0, 1, 0, 1, 1, 1, -1, 1, 0]),
  SLOPE_SOUTHEAST_INVERTED: createNDArray([0, 1, 0, 1, 1, 1, 0, 1, -1]),
  SLOPE_NORTHWEST: createNDArray([-1, -1, 0, -1, 1, 1, 0, 1, 1]),
  SLOPE_NORTHEAST: createNDArray([0, -1, -1, 1, 1, -1, 1, 1, 0]),
  SLOPE_SOUTHWEST: createNDArray([0, 1, 1, -1, 1, 1, -1, -1, 0]),
  SLOPE_SOUTHEAST: createNDArray([1, 1, 0, 1, 1, -1, 0, -1, -1])
};

//1 means higher than base
const illegalSlopes = {
  DIAGONAL_OPPOSITES: createNDArray([-1, 0, -1, 0, 0, 0, -1, 0, -1]),
  OPPOSITES_W_E: createNDArray([0, 0, 0, -1, 0, -1, 0, 0, 0]),
  OPPOSITES_N_S: createNDArray([0, -1, 0, 0, 0, 0, 0, -1, 0])
};

const testIllegalSlope = (tileSet, slopeName) => {
  const baseHeight = tileSet.getHeight(1, 1);
  const slope = illegalSlopes[slopeName];

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (slope.get(x, y) === -1 && tileSet.getHeight(x, y) >= baseHeight) {
        return false;
      }
    }
  }

  return true;
};

const testSlope = (tileSet, slope) => {
  const baseHeight = tileSet.getHeight(1, 1);

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const height = tileSet.getHeight({ x, y });
      if (slope.get(x, y) === -1 && height >= baseHeight) {
        return false;
      }

      if (slope.get(x, y) === 1 && height < baseHeight) {
        return false;
      }
    }
  }

  return true;
};

const isIllegalHeight = (position, tileSet) => {
  tileSet.zoomTo3(position);

  const baseHeight = tileSet.getHeight(1, 1);

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const height = tileSet.getHeight({ x, y });
      if (height > baseHeight + 1 || height < baseHeight - 1) {
        tileSet.resetZoom();
        return true;
      }
    }
  }

  tileSet.resetZoom();
};

const isIllegalSlope = (position, tileSet) => {
  tileSet.zoomTo3(position);
  const result = Object.keys(illegalSlopes).some(slopeName =>
    testIllegalSlope(tileSet, slopeName)
  );
  tileSet.resetZoom();
  return result;
};

const getSlopeType = (position, tileSet) => {
  tileSet.zoomTo3(position);
  Object.keys(slopeTypes).forEach(slopeName => {
    const slope = slopeTypes[slopeName];
    if (testSlope(tileList, slope)) {
      tileSet.resetZoom();
      return slopeName;
    }
  });

  tileSet.resetZoom();
  return null;
};

export { isIllegalHeight, isIllegalSlope, getSlopeType };
