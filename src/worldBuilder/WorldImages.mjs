import WorldImage from "./WorldImage.mjs";

class WorldImages {
  constructor(height, biome) {
    this.height = new WorldImage(height);
    this.biome = new WorldImage(biome);
  }

  getSize() {
    return this.height.size;
  }

  cloneEmpty() {
    return this.height.cloneEmpty();
  }
}

export default WorldImages;
