module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
  },
  extends: 'standard',
  plugins: [
    'import',
    'html'
  ],
  env: { // 定义预定义的全局变量,比如browser: true，这样你在代码中可以放心使用宿主环境给你提供的全局变量。
    browser: true, // browser global variables.
    node: true, // Node.js global variables and Node.js scoping.
    worker: true, // web workers global variables.
    mocha: true, // adds all of the Mocha testing global variables.
    phantomjs: true, // PhantomJS global variables.
    serviceworker: true, // Service Worker global variables.
    es6: true
  },
  rules: {
    semi: 'off',
    'space-before-function-paren': ['off'],
    'comma-dangle': ['off']
  },
  globals: {
    '$': true,
    'io': true,
    'ActiveXObject': true,
  }
}
