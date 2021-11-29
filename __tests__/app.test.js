const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("initial testing", () => {
  it("should run and seed test data", () => {
    console.log(typeof seed);
  });
});
