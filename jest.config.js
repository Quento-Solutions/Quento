module.exports = {
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
      // this line is optional and the tilde shortcut
      // will not be used in this tutorial
      '^~/(.*)$': '<rootDir>/$1'
    },
    transform: {
      '^.+\\.ts?$': 'ts-jest',
      '.*\\.(vue)$': 'vue-jest'
    },
    moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  
    collectCoverageFrom: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'lib/**/*.ts',
      'plugins/**/*.ts',
      'store/**/*.ts'
    ]
  };