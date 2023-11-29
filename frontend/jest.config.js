module.exports = {
  preset: 'react-native',
  clearMocks: true,
  verbose: true,
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  globals: {
    __DEV__: true,
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  transformIgnorePatterns: [
    '/node_modules/(?!(react-native|react-redux|@fortawesome/react-native-fontawesome|@react-native|react-native-swiper)/)',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node', 'android.js', 'ios.js', 'd.ts'],
  moduleDirectories: ['<rootDir>/node_modules'],
  // setupFiles: ['<rootDir>/jest.setup.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/**/*.{js,jsx}'],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '(.*).config.js',
  ],
};