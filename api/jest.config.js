// jest.config.js
module.exports = {
  verbose: false,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setup.js'],
  testTimeout: 5000
};