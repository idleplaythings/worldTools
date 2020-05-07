import getPixels from "get-pixels";
import path from "path";
import fs from "fs";
import { TileBinarySet, TileTypes } from "../model/tile/index.mjs";
import {
  getSlopeType,
  testTooSteepSlope,
  testIllegalSlope,
} from "./SlopeBuilder.mjs";
import WorldImages from "./WorldImages.mjs";
import { getFactory } from "./factory/index.mjs";

const __dirname = path
  .dirname(decodeURI(new URL(import.meta.url).pathname))
  .replace(/^\/([A-Z]):\//, "$1:/");

const loadImage = (filePath) =>
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
    this.worldImages = null;
    console.log(__dirname);
  }

  async create(filePath) {
    const height = await loadImage(`${filePath}_height.png`);
    const biome = await loadImage(`${filePath}_biome.png`);
    this.worldImages = new WorldImages(height, biome);
    const size = this.worldImages.getSize();

    this.resultImage = this.worldImages.cloneEmpty();

    //console.log(this.sourceImage.currentView.shape);

    //this.sourceImage.zoomTo3({ x: 2, y: 2 });
    //console.log(this.sourceImage.currentView.get(1, 1, 0));
    //console.log(this.sourceImage.getHeight({ x: 1, y: 1 }));

    this.smoothIllegalSlopes(this.worldImages.height, size);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const position = { x, y };
        this.resultImage.setHeight(
          position,
          this.worldImages.height.getHeight(position)
        );

        this.resultImage.setType(position, TileTypes.type.REGULAR);

        this.setTileVisual(this.worldImages, this.resultImage, position);

        if (this.worldImages.height.isWater(position)) {
          this.resultImage.setType(position, TileTypes.type.WATER);
        } else if (this.worldImages.height.isDeepWater(position)) {
          this.resultImage.setType(position, TileTypes.type.WATER_DEEP);
        } else {
          this.resultImage.setType(position, TileTypes.type.REGULAR);
        }

        if (x > 0 && y > 0 && x < size - 1 && y < size - 1) {
          if (getSlopeType(position, this.worldImages.height)) {
            this.resultImage.setType(position, TileTypes.type.SLOPE);
          }
        }
      }
    }

    this.boulderPass();
    this.rockPass();

    this.writeToImage(this.resultImage.getData());
  }

  pass(functionName) {
    const size = this.worldImages.getSize();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const position = { x, y };
        const type = this.resultImage.getType(position);

        if (type !== TileTypes.type.REGULAR) {
          continue;
        }

        const factory = getFactory(
          this.worldImages,
          this.resultImage,
          position
        );
        if (!factory) {
          return;
        }

        factory[functionName](this.worldImages, this.resultImage, position);
      }
    }
  }

  boulderPass() {
    this.pass("createBoulder");
  }

  rockPass() {
    this.pass("createRock");
  }

  setTileVisual(sourceImage, resultImage, position) {
    if (sourceImage.biome.isWater(position)) {
      resultImage.setVisual(position, TileTypes.visual.UNDERWATER);
    } else if (sourceImage.biome.isDeepWater(position)) {
      resultImage.setVisual(position, TileTypes.visual.UNDERWATER_DEEP);
    } else if (sourceImage.biome.isBedrockSoil(position)) {
      resultImage.setVisual(position, TileTypes.visual.BEDROCK_SOIL);
    } else {
      resultImage.setVisual(position, TileTypes.visual.BEDROCK);
    }
  }

  smoothIllegalSlopes(source, size) {
    let wrong = false;

    let rounds = 0;

    do {
      console.log(rounds, "done");
      wrong = false;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
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
