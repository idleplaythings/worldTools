import getPixels from "get-pixels";
import path from "path";
import { TileBinarySet } from "../model/tile";
import { getSlopeType, isIllegalHeight } from "./SlopeBuilder";

const __dirname = path
  .dirname(decodeURI(new URL(import.meta.url).pathname))
  .replace(/^\/([A-Z]):\//, "$1:/");

const loadImage = filePath =>
  new Promise((resolve, reject) =>
    getPixels(
      path.resolve(__dirname, "../../data/" + filePath),
      (err, pixels) => {
        if (err) {
          console.log("erro!", err);
          reject(err);
          return;
        }
        resolve(pixels);
      }
    )
  );

class WorldBuilder {
  constructor() {
    this.sourceImage = null;
    console.log(__dirname);
  }

  async create(filePath) {
    const image = await loadImage(filePath);
    this.sourceImage = new TileBinarySet(image);
    const size = this.sourceImage.size;

    console.log(this.sourceImage.currentView.shape);

    for (let x = 0; x < this.sourceImage.size; x++) {
      for (let y = 0; y < this.sourceImage.size; y++) {
        if (
          x > 0 &&
          y > 0 &&
          x < size &&
          y < size &&
          isIllegalHeight({ x, y }, this.sourceImage)
        ) {
          console.log("illegal height", x, y);
        }
      }
    }
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

export default WorldBuilder;
