import getPixels from "get-pixels";
import path from "path";
import fs from "fs";
import { TileBinarySet, TileTypes } from "../model/tile";
import { getSlopeType } from "./SlopeBuilder";

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

    this.resultImage = this.sourceImage.cloneEmpty();

    //console.log(this.sourceImage.currentView.shape);

    //this.sourceImage.zoomTo3({ x: 2, y: 2 });
    //console.log(this.sourceImage.currentView.get(1, 1, 0));
    //console.log(this.sourceImage.getHeight({ x: 1, y: 1 }));

    console.log(this.sourceImage.currentView.data);

    for (let y = 0; y < this.sourceImage.size; y++) {
      for (let x = 0; x < this.sourceImage.size; x++) {
        this.resultImage.setHeight(
          { x, y },
          this.sourceImage.getHeight({ x, y })
        );

        this.resultImage.setType({ x, y }, TileTypes.type.REGULAR);
        this.resultImage.setVisual({ x, y }, TileTypes.visual.GRASS);

        if (x > 0 && y > 0 && x < size - 1 && y < size - 1) {
          const slopeName = getSlopeType({ x, y }, this.sourceImage);
          if (slopeName) {
            console.log("slope", slopeName);
            this.resultImage.setType({ x, y }, TileTypes.type[slopeName]);
          }
        }
      }
    }

    this.writeToImage(this.resultImage.getData());
  }

  writeToImage(data) {
    fs.writeFileSync(
      path.resolve(__dirname, "../../data/" + "result.bin"),
      data
    );
  }
}

export default WorldBuilder;
