import { prop } from "../../model/tile/TileTypes.mjs";
import { TileTypes } from "../../model/tile/index.mjs";

class BedrockFactory {
  constructor() {
    this.boulderProbability = 0.02;
    this.rockPropability = 0.05;
    this.pebblePropability = 0.05;
  }

  createRock(sourceImage, resultImage, position) {
    if (position.x === 510 && position.y === 510) {
      resultImage.setProp(position, prop.ROCK);
    }

    if (position.x === 513 && position.y === 513) {
      resultImage.setProp(position, prop.ROCK);
    }

    return;

    if (!this.checkForProps(resultImage, position)) {
      return;
    }

    let chance = this.rockPropability;

    if (this.checkForAreaForNextBoulder(resultImage, position)) {
      chance *= 4;
    }

    if (Math.random() < chance) {
      resultImage.setProp(position, prop.ROCK);
    } else if (Math.random() < this.pebblePropability) {
      resultImage.setProp(position, prop.PEBBLE);
    }
  }

  createBoulder(sourceImage, resultImage, position) {
    return;

    if (!this.checkForAreaProps(resultImage, position)) {
      return;
    }

    /*
    if (position.x === 510 && position.y === 510) {
      console.log("setting the boulder");
      resultImage.setProp(position, prop.BOULDER);
      resultImage.setProp(
        { x: position.x + 1, y: position.y },
        prop.BOULDER_SECONDARY
      );
      resultImage.setProp(
        { x: position.x + 1, y: position.y - 1 },
        prop.BOULDER_SECONDARY
      );
      resultImage.setProp(
        { x: position.x, y: position.y - 1 },
        prop.BOULDER_SECONDARY
      );
    }

    */
    if (Math.random() < this.boulderProbability) {
      resultImage.setProp(position, prop.BOULDER_SECONDARY);
      resultImage.setProp({ x: position.x + 1, y: position.y }, prop.BOULDER);
      resultImage.setProp(
        { x: position.x + 1, y: position.y - 1 },
        prop.BOULDER_SECONDARY
      );
      resultImage.setProp(
        { x: position.x, y: position.y - 1 },
        prop.BOULDER_SECONDARY
      );
    }
  }

  checkForProps(resultImage, position) {
    if (resultImage.getProp(position)) {
      resultImage.resetZoom();
      return false;
    }

    if (resultImage.getType(position) !== TileTypes.type.REGULAR) {
      resultImage.resetZoom();
      return false;
    }

    return true;
  }

  checkForAreaProps(resultImage, position) {
    resultImage.zoomTo3(position);

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (resultImage.getProp({ x, y })) {
          resultImage.resetZoom();
          return false;
        }

        if (resultImage.getType({ x, y }) !== TileTypes.type.REGULAR) {
          resultImage.resetZoom();
          return false;
        }
      }
    }

    resultImage.resetZoom();

    return true;
  }

  checkForAreaForNextBoulder(resultImage, position) {
    resultImage.zoomTo3(position);

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const prop = resultImage.getProp({ x, y });
        if (
          prop === TileTypes.prop.BOULDER ||
          prop === TileTypes.prop.BOULDER_SECONDARY
        ) {
          resultImage.resetZoom();
          return true;
        }
      }
    }

    resultImage.resetZoom();

    return false;
  }
}

export default BedrockFactory;
