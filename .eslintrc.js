module.exports = {
  extends: [
    "@mapbox/eslint-config-mapbox/import",
    "@mapbox/eslint-config-mapbox/promise"
  ],
  env: {
    browser: true,
    es6: true,
    node: true
  },
  plugins: ["html", "xss"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },
  rules: {
    "arrow-parens": ["error", "as-needed"],
    "no-var": "error",
    "prefer-const": "error",
    "array-bracket-spacing": ["error", "never"],
    "brace-style": ["error", "1tbs"],
    "comma-spacing": [
      "error",
      {
        before: false,
        after: true
      }
    ],
    "computed-property-spacing": ["error", "never"],
    curly: ["error", "multi-line"],
    "eol-last": "error",
    eqeqeq: ["error", "smart"],
    indent: [
      "error",
      2,
      {
        SwitchCase: 1
      }
    ],
    "no-console": "off",
    "no-confusing-arrow": [
      "error",
      {
        allowParens: false
      }
    ],
    "no-extend-native": "error",
    "no-mixed-spaces-and-tabs": "error",
    "no-spaced-func": "error",
    "no-trailing-spaces": "error",
    "no-unused-vars": "error",
    "no-use-before-define": ["error", "nofunc"],
    "object-curly-spacing": ["error", "always"],
    quotes: [
      "error",
      "double",
      { avoidEscape: true, allowTemplateLiterals: true }
    ],
    semi: ["error", "always"],
    "space-infix-ops": "error",
    "spaced-comment": ["error", "always"],
    "xss/no-mixed-html": "error",
    "xss/no-location-href-assign": "error",
    "keyword-spacing": [
      "error",
      {
        before: true,
        after: true
      }
    ],
    strict: "error"
  }
};
