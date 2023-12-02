module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'indent': 'off',
    'max-len': 'off',
    'no-void': 'off',
    'no-console': 'off',
    'no-restricted-syntax': 'off',
    'no-useless-constructor': 'off',
    'no-use-before-define': 'off',
    'no-shadow': 'off',
    'object-curly-newline': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-shadow': 'error',

    '@typescript-eslint/indent': [
      "error",
      2,
      {
        "ignoredNodes": [
          "FunctionExpression > .params[decorators.length > 0]",
          "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
          "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key"
        ]
      },
    ],
  },
};
