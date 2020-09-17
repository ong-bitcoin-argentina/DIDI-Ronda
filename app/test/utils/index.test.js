const { generate } = require("../../helpers/tokenGenerator");

describe("token generation tests", () => {
  test("it generates a token", () => {
    const token = generate();
    expect(token).toBeTruthy();
  });

  test("the length is more than 6 in 100 iterations", () => {
    const tokens = [];
    for (let i = 0; i < 100; i += 1) {
      const t = generate();
      tokens.push(t);
    }
    const properTokens = tokens.filter(t => t.toString().length > 6);
    expect(properTokens.length).toBe(100);
  });
});
