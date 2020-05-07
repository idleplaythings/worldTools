import { biome } from "../../model/tile/TileTypes.mjs";
import BedrockFactory from "./BedrockFactory.mjs";
import BedrockSoilFactory from "./BedrockSoilFactory.mjs";
import MountainFactory from "./MountainFactory.mjs";

const bedrockFactory = new BedrockFactory();
const bedrockSoilFactory = new BedrockSoilFactory();
const mountainFactory = new MountainFactory();

export const getFactory = (sourceImage, resultImage, position) => {
  const currentBiome = sourceImage.biome.getBiome(position);

  switch (currentBiome) {
    case biome.BEDROCK:
      return bedrockFactory;
    case biome.BEDROCK_SOIL:
      return bedrockSoilFactory;
    case biome.MOUNTAIN:
      return mountainFactory;
    default:
      return null;
  }
};
