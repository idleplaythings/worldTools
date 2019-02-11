import ndarray from "ndarray";

const createNDArray = list => ndarray(new Int8Array(list), [3, 3]);

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

const testSlope = (tileSet, slope) => {
  const baseHeight = tileSet.isWater({ x: 1, y: 1 })
    ? 0
    : tileSet.getHeight({ x: 1, y: 1 });

  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const height = tileSet.isWater({ x, y })
        ? 0
        : tileSet.getHeight({ x, y });

      const slopeGuide = slope.get(y, x);

      if (slopeGuide === -1 && height >= baseHeight) {
        return false;
      }

      if (slopeGuide === 1 && height < baseHeight) {
        return false;
      }
    }
  }

  return true;
};

/*
const testIllegalSlope = (tileSet, slopeName) => {
  const baseHeight = tileSet.getHeight({ x: 1, y: 1 });
  const slope = illegalSlopes[slopeName];

  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (slope.get(y, x) === -1 && tileSet.getHeight({ x, y }) >= baseHeight) {
        return false;
      }
    }
  }

  return true;
};

const isIllegalHeight = (position, tileSet) => {
  tileSet.zoomTo3(position);

  const baseHeight = tileSet.getHeight({ x: 1, y: 1 });

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
*/

const getSlopeType = (position, tileSet) => {
  tileSet.zoomTo3(position);
  const result = Object.keys(slopeTypes).find(slopeName => {
    const slope = slopeTypes[slopeName];
    return testSlope(tileSet, slope);
  });

  tileSet.resetZoom();
  return result;
};

export { getSlopeType };
