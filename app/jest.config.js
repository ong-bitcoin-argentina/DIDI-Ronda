// jest.config.js
module.exports = {
  presets: ["react-native"],
  testEnvironment: "node",
  testTimeout: 5000,
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  moduleDirectories: ["src", "node_modules"],
  moduleFileExtensions: ["js", "json"],
};
