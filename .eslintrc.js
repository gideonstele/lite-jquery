// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: require.resolve('babel-eslint'),
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true
  },
  extends: [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard',
    'prettier'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'prettier/prettier': 'warn',
    // allow async-await
    'generator-star-spacing': 'off',
    'space-before-function-paren': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: ['warn', 'always'],
    eqeqeq: ['warn'],
    'eol-last': ['off'],
    'no-multiple-empty-lines': ['off'],
    'one-var': ['off'],
    'no-proto': ['off'],
    'wrap-iife': ['off'],
    'import/first': ['off'],
    'comma-style': ['off'],
    'yoda': ['off'],
    'no-cond-assign': ['off'],
    'space-before-blocks': ['off'],
    'padded-blocks': ['off'],
    'operator-linebreak': ['off'],
    'no-useless-escape': ['warn'],
    'no-mixed-operators': ['off']
  }
};
