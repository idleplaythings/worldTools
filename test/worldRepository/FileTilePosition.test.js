const {
  get64Index,
  get512Index,
  getIndex,
  get512Position,
  get64Position,
  getPosition
} = require("../../src/worldRepository/FileTilePosition");

test("WorldSize 1024, corner indexes are correct", () => {
  const worldSize = 1024;
  let position = { x: 1023, y: 1023 };

  const totalSize = worldSize * worldSize * 2 - 2;
  const chunk512Size = 512 * 512 * 2;
  const chunk64Size = 64 * 64 * 2;

  let index = chunk512Size * 2 + chunk64Size * 56 + 63 * 64 * 2;
  //Because y is inverted in list (y descends) this it the second chunk
  expect(get512Index(position, worldSize)).toBe(chunk512Size * 2); // third 512 chunk
  expect(get64Index(position, worldSize)).toBe(
    chunk512Size * 2 + chunk64Size * 56
  ); // 56th 64 chunk
  expect(getIndex(position, worldSize)).toBe(index);

  expect(get512Position(index, worldSize)).toEqual({
    position: { x: 1, y: 1 },
    index: chunk512Size * 2
  });

  expect(get64Position(index, worldSize)).toEqual({
    position: { x: 15, y: 15 },
    index: chunk512Size * 2 + chunk64Size * 56
  });

  expect(getPosition(index, worldSize)).toEqual({
    position,
    index
  });

  position = { x: 1023, y: 0 };
  expect(get512Index(position, worldSize)).toBe(chunk512Size * 3);
  expect(get64Index(position, worldSize)).toBe(
    chunk512Size * 3 + chunk64Size * 63
  );
  expect(getIndex(position, worldSize)).toBe(totalSize);

  position = { x: 3, y: 1023 };
  expect(get512Index(position, worldSize)).toBe(0);
  expect(get64Index(position, worldSize)).toBe(0);
  expect(getIndex(position, worldSize)).toBe(64 * 3 * 2);
});
