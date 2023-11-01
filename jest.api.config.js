/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/api/*.test.ts'],
  setupFilesAfterEnv: ["<rootDir>/tests/api/setup.ts"],
  maxWorkers: 1
};