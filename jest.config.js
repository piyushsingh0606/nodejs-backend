module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 30000,
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.js',
    '!app/models/index.js',
    '!app/config/db.config.js'
  ]
};
