import TileBinarySet from "../model/tile/TileBinarySet.mjs";

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
}

export default WorldImage;
