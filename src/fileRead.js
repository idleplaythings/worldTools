const { WorldReader } = require("./worldRepository/WorldReader.js");
const { getIndex } = require("./worldRepository/FileTilePosition");

const { performance } = require("perf_hooks");

/*
console.log(WorldReader);

const positionStart = performance.now();
const index = getIndex({ x: 4321, y: 20301 }, 32768);
console.log(index, performance.now() - positionStart);
*/

const worldReader = new WorldReader(32768, 2);
/*
(async () => {
  const start = performance.now();

  const result = await worldReader.readBatch({ x: 12330, y: 20113 }, 1);
  console.log(performance.now() - start);
})();
*/

let amount = 100;
(async () => {
  while (amount--) {
    const start = performance.now();

    const result = await worldReader.readBatch({ x: 12330, y: 20113 }, 512);
    console.log(performance.now() - start);
  }
})();
