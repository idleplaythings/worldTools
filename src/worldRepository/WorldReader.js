const fs = require("fs");
const fileHandle = fs.openSync("test.bin", "r");

const getPositionIndex = (position, worldSize, numberOfEntries) =>
  position.y * worldSize * numberOfEntries + position.x + numberOfEntries;

const read = (index, bytesToRead = numberOfEntries) => {
  return new Promise((resolve, reject) => {
    const buffer = new Uint8Array(bytesToRead);

    fs.read(
      fileHandle,
      buffer,
      0,
      bytesToRead,
      index,
      (error, bytesRead, buffer) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        }

        resolve(buffer);
      }
    );
  });
};

class WorldReader {
  constructor(worldSize, numberOfEntries) {
    this.worldSize = worldSize;
    this.numberOfEntries = numberOfEntries;
  }

  async readTile(position) {
    const index = getPositionIndex(
      position,
      this.worldSize,
      this.numberOfEntries
    );
    try {
      const result = await read(index, 1 * this.numberOfEntries);
      return result;
    } catch (e) {
      console.log("error!", e);
    }
  }

  async readBatch(position, size) {
    try {
      const promises = [];

      for (let y = 0; y < size; y++) {
        const index = getPositionIndex(
          {
            x: position.x,
            y: position.y + y
          },
          this.worldSize,
          this.numberOfEntries
        );

        promises.push(read(index, size * this.numberOfEntries));
      }

      return Promise.all(promises);
    } catch (e) {
      console.log("error!", e);
    }
  }
}

module.exports.WorldReader = WorldReader;
