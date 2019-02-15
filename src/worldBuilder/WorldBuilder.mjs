import getPixels from "get-pixels";
import path from "path";
import fs from "fs";
import { TileBinarySet, TileTypes } from "../model/tile";
import {
  getSlopeType,
  testTooSteepSlope,
  testIllegalSlope
} from "./SlopeBuilder";
import WorldImage from "./WorldImage";

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
    this.sourceImage = new WorldImage(image);
    const size = this.sourceImage.size;

    this.resultImage = this.sourceImage.cloneEmpty();

    //console.log(this.sourceImage.currentView.shape);

    //this.sourceImage.zoomTo3({ x: 2, y: 2 });
    //console.log(this.sourceImage.currentView.get(1, 1, 0));
    //console.log(this.sourceImage.getHeight({ x: 1, y: 1 }));

    this.smoothIllegalSlopes(this.sourceImage, size);

    for (let y = 0; y < this.sourceImage.size; y++) {
      for (let x = 0; x < this.sourceImage.size; x++) {
        const position = { x, y };
        this.resultImage.setHeight(
          position,
          this.sourceImage.getHeight(position)
        );

        this.resultImage.setType(position, TileTypes.type.REGULAR);

        this.setTileVisual(this.sourceImage, this.resultImage, position);

        if (x > 0 && y > 0 && x < size - 1 && y < size - 1) {
          const slopeName = getSlopeType(position, this.sourceImage);
          if (slopeName) {
            this.resultImage.setType(position, TileTypes.type[slopeName]);
          }
        }
      }
    }

    this.writeToImage(this.resultImage.getData());
  }

  setTileVisual(sourceImage, resultImage, position) {
    if (sourceImage.isWater(position)) {
      resultImage.setVisual(position, TileTypes.visual.WATER);
    } else {
      resultImage.setVisual(position, TileTypes.visual.GRASS);
    }
  }

  smoothIllegalSlopes(source, size) {
    let wrong = false;

    let rounds = 0;

    do {
      console.log(rounds, "done");
      wrong = false;
      for (let y = 0; y < this.sourceImage.size; y++) {
        for (let x = 0; x < this.sourceImage.size; x++) {
          if (x > 0 && y > 0 && x < size - 1 && y < size - 1) {
            const baseHeight = source.getHeight({ x, y });
            source.zoomTo3({ x, y });

            if (testTooSteepSlope(source) || testIllegalSlope(source)) {
              const newHeight = baseHeight - 1;
              if (newHeight < 0) {
                throw new Error(
                  "Trying to set height below zero: base" +
                    baseHeight +
                    " new:" +
                    newHeight +
                    " position: " +
                    x +
                    ", " +
                    y
                );
              }
              /*
              console.log(
                "found illegal, setting new height " +
                  newHeight +
                  " position: " +
                  x +
                  ", " +
                  y
              );
              */

              source.resetZoom();
              source.setHeight({ x, y }, newHeight);
              wrong = true;
            }

            source.resetZoom();
          }
        }
      }
      rounds++;
    } while (wrong);
  }

  writeToImage(data) {
    fs.writeFileSync(
      path.resolve(__dirname, "../../data/" + "result.bin"),
      data
    );
  }
}

export default WorldBuilder;
