import WorldBuilder from "../src/worldBuilder/WorldBuilder.mjs";

const worldBuilder = new WorldBuilder(512);

worldBuilder.create("boxAndCross1024.png");

/*
const fs = require("fs");

const size = 32768;
const numberOfEntries = 2;

const buffer = new Uint8Array(size * size * numberOfEntries);

for (let x = 0; x < size; x++) {
  for (let y = 0; y < size; y++) {
    const index = x * size * numberOfEntries + y * numberOfEntries;
    buffer[index] = Math.floor(Math.random() * 255);
    buffer[index + 1] = Math.floor(Math.random() * 255);
  }
}

fs.writeFile("test.bin", buffer, err => {
  // throws an error, you could also catch it here
  if (err) throw err;

  // success case, the file was saved
  console.log("SAved!");
});
*/
