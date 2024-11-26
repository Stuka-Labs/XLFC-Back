/* eslint-disable max-len */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.dev.json"],
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*",
    "/generated/**/*",
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    quotes: ["error", "double"],
    "import/no-unresolved": 0,
    indent: ["error", 2],
    "object-curly-spacing": "off",
    "valid-jsdoc": "off",
    "quote-props": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off",
    "operator-linebreak": "off",
    "max-len": "off",
    "comma-dangle": "off",
    "no-explicity-any": "off",
    "@typescript-eslint/no-explicity-any": "off",
  },
};
