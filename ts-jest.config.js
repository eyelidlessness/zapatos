const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
