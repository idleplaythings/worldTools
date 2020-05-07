import BedrockFactory from "./BedrockFactory.mjs";

class BedrockSoilFactory extends BedrockFactory {
  constructor() {
    super();
    this.boulderProbability = 0.02;
  }
}

export default BedrockSoilFactory;
