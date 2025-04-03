module.exports = {
  testMatch: [
    '<rootDir>/@(src|test)/**/*(*.)@(spec|test).ts?(x)',
    '<rootDir>/@(src|test)/**/__tests__/**/*.ts?(x)',
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.dev.json',
    }],
  },
  coverageProvider: 'v8',
  collectCoverage: true,
  coverageReporters: [
    'json',
    'lcov',
    'clover',
    'cobertura',
    'text',
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/imports/',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  watchPathIgnorePatterns: [
    '/node_modules/',
  ],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-reports',
      },
    ],
  ],
  preset: 'ts-jest',
  resetMocks: true,
};
