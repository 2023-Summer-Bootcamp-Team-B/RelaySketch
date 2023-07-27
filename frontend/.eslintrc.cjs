module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "plugin:react/jsx-runtime",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb",
    "airbnb-typescript",
    "prettier",
  ],
  overrides: [
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: "latest",
    sourceType: "module",
    jest: "jest.config.cjs",
  },
  plugins: ["react", "@typescript-eslint", "testing-library", "react-hooks"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "testing-library/await-async-query": "error",
    "testing-library/no-await-sync-query": "error",
    "testing-library/no-debugging-utils": "warn",
    "testing-library/no-dom-import": "off",
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "@typescript-eslint/no-var-requires": 0,
    "no-console": "off",
    "no-alert": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "func-names": "off",
    "react/jsx-props-no-spreading": "off",
    "react/function-component-definition": [
      2,
      { namedComponents: ["arrow-function", "function-declaration"] },
    ],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", ["parent", "sibling"], "index"],
        pathGroups: [
          {
            pattern: "angular",
            group: "external",
            position: "before",
          },
        ],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        "newlines-between": "always",
      },
    ],
  },
  root: true,
};
