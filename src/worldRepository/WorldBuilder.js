const getPixels = require("get-pixels");
const path = require("path");

const loadImage = filePath =>
  new Promise((resolve, reject) =>
    getPixels(path.resolve(__dirname, filePath), (err, pixels) => {
      if (err) {
        console.log("erro!", err);
        reject(err);
        return;
      }
      resolve(pixels);
    })
  );

class WorldBuilder {
  constructor() {}

  async create(filePath) {
    const image = await loadImage("../../data/" + filePath);
    const size = image.shape[0];
    console.log(size);
  }

  writeToImage() {
    var img =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0" +
      "NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO" +
      "3gAAAABJRU5ErkJggg==";
    // strip off the data: url prefix to get just the base64-encoded bytes
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, "base64");
    fs.writeFile("image.png", buf);
  }
}

module.exports.WorldBuilder = WorldBuilder;
