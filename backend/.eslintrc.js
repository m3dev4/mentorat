module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint: recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    semi: ['error', 'always'],
    quotes: ['error', 'double', { avoidEscape: true }],
    indent: ['error', 2],
    'comma-dangle': ['error', 'always-multiline'],
    'arrow-parens': ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'max-len': ['warn', { code: 100 }],
  },
};
