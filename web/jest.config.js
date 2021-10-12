module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testURL: 'http://localhost:3001/',
  moduleNameMapper: {
    '~/(.*)$': '<rootDir>/src/$1'
  }
}
