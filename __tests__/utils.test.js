const { removeApostrophe } = require("../utils/utils");

describe("removeApostrope", () => {
  test("should remove apostrophe and replace with '", () => {
    const input = "Ed's Input";
    const expected = "Ed''s Input";
    const actual = removeApostrophe(input);
    expect(actual).toBe(expected);
  });
});
