import TileBinarySet from "../model/tile/TileBinarySet.mjs";
import { biome } from "../model/tile/TileTypes.mjs";

class WorldImage extends TileBinarySet {
  getColor(position) {
    const r = this.currentView.get(position.x, position.y, 0);
    const g = this.currentView.get(position.x, position.y, 1);
    const b = this.currentView.get(position.x, position.y, 2);
    const a = this.currentView.get(position.x, position.y, 3);
    return { r, g, b, a };
  }

  isWater(position) {
    const color = this.getColor(position);

    return color.g === 132 && color.b === 214;
  }

  isDeepWater(position) {
    const color = this.getColor(position);

    return color.g === 85 && color.b === 139;
  }

  isBedrockSoil(position) {
    const color = this.getColor(position);
    return color.r === 25 && color.g === 41 && color.b === 0;
  }

  getBiome(position) {
    const color = this.getColor(position);

    if (color.r === 25 && color.g === 41 && color.b === 0) {
      return biome.BEDROCK_SOIL;
    } else if (color.r === 46 && color.g === 46 && color.b === 46) {
      return biome.BEDROCK;
    } else if (color.r === 139 && color.g === 154 && color.b === 174) {
      return biome.MOUNTAIN;
    } else {
      return biome.NO_BIOME;
    }
  }
}

export default WorldImage;
