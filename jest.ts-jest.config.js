const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/test/tsconfig.json',
    },
  },
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
