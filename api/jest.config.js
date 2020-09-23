// jest.config.js
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./test/setup.js"],
  testTimeout: 500000,
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  moduleDirectories: ["src", "node_modules"],
  moduleFileExtensions: ["js", "json"],
};
