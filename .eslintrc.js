// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    ecmaFeatures: {
      ecmaVersion: 7
    }
  },
  env: {
    browser: true
  },
  extends: [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    "standard"
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    "generator-star-spacing": "off",
    "space-before-function-paren": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    semi: ["warn", "always"],
    eqeqeq: ["warn"],
    "eol-last": ["off"],
    "no-multiple-empty-lines": ["off"],
    "one-var": ["off"],
    indent: ["off"],
    "no-proto": ["off"],
    "wrap-iife": ["off"],
    "import/first": ["off"],
    "comma-style": ["off"],
    "yoda": ["off"],
    "no-cond-assign": ["off"],
    "space-before-blocks": ["off"],
    "padded-blocks": ["off"],
    "operator-linebreak": ["off"],
    "no-useless-escape": ["warn"],
    "no-mixed-operators": ["off"]
  }
};
