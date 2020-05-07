import BedrockFactory from "./BedrockFactory.mjs";

class MountainFactory extends BedrockFactory {
  constructor() {
    super();
    this.boulderProbability = 0.5;
    this.rockPropability = 0.5;
  }
}

export default MountainFactory;
