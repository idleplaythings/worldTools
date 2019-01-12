const numberOfEntries = 2;

const chunk512Size = 512 * 512 * numberOfEntries;
const chunk64Size = 64 * 64 * numberOfEntries;
const chunk1Size = numberOfEntries;

const get512Index = (position, worldSize) => {
  if (position.x >= worldSize || position.y >= worldSize) {
    throw new Error("Position is out of bounds for this world");
  }

  const invertedPosition = {
    x: position.x,
    y: worldSize - 1 - position.y
  };

  const x512 = Math.floor(invertedPosition.x / 512);
  const y512 = Math.floor(invertedPosition.y / 512);
  const index512 =
    x512 * (worldSize / 512) * chunk512Size + y512 * chunk512Size;
  return index512;
};

const get64Index = (position, worldSize) => {
  if (position.x >= worldSize || position.y >= worldSize) {
    throw new Error("Position is out of bounds for this world");
  }

  const invertedPosition = {
    x: position.x,
    y: worldSize - 1 - position.y
  };

  const size = 512;
  const x64 = Math.floor((invertedPosition.x % size) / 64);
  const y64 = Math.floor((invertedPosition.y % size) / 64);
  const index64 =
    get512Index(position, worldSize) +
    (x64 * (size / 64) * chunk64Size + y64 * chunk64Size);
  return index64;
};

const getIndex = (position, worldSize) => {
  if (position.x >= worldSize || position.y >= worldSize) {
    throw new Error("Position is out of bounds for this world");
  }

  const invertedPosition = {
    x: position.x,
    y: worldSize - 1 - position.y
  };

  const size = 64;
  const x = invertedPosition.x % size;
  const y = invertedPosition.y % size;
  const index =
    get64Index(position, worldSize) + (x * size * chunk1Size + y * chunk1Size);

  return index;
};

get512Position = (index, worldSize) => {
  const chunk512Number = Math.floor(index / chunk512Size);

  const index512 = chunk512Number * chunk512Size;
  const chunks512perRow = worldSize / 512;
  const position = {
    x: Math.floor(chunk512Number / chunks512perRow),
    y: chunks512perRow - 1 - (chunk512Number % chunks512perRow)
  };

  return { position, index: index512 };
};

get64Position = (index, worldSize) => {
  const { position: position512, index: index512 } = get512Position(
    index,
    worldSize
  );

  index = index - index512;

  const chunk64Number = Math.floor(index / chunk64Size);

  const index64 = chunk64Number * chunk64Size;
  const chunks64perRow = 512 / 64;
  const position = {
    x: Math.floor(chunk64Number / chunks64perRow),
    y: chunks64perRow - 1 + (chunk64Number % chunks64perRow)
  };

  return {
    position: {
      x: position512.x * chunks64perRow + position.x,
      y: position512.y * chunks64perRow + position.y
    },
    index: index64 + index512
  };
};

getPosition = (index, worldSize) => {
  const { position: position64, index: index64 } = get64Position(
    index,
    worldSize
  );

  index = index - index64;

  const chunk1Number = Math.floor(index / chunk1Size);

  const index1 = chunk1Number * chunk1Size;
  const chunks1perRow = 64;
  const position = {
    x: Math.floor(chunk1Number / chunks1perRow),
    y: chunks1perRow - 1 + (chunk1Number % chunks1perRow)
  };

  return {
    position: {
      x: position64.x * chunks1perRow + position.x,
      y: position64.y * chunks1perRow + position.y
    },
    index: index1 + index64
  };
};

class FileTilePosition {
  constructor(position, index, index64, index512, worldSize) {
    this.position = position;
    this.index = index;
    this.index64 = index64;
    this.index512 = index512;
    this.worldSize = worldSize;
  }
}

module.exports = {
  get64Index,
  get512Index,
  getIndex,
  get512Position,
  get64Position,
  getPosition
};
