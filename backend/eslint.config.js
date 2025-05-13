export default [
    {
      ignores: [
        "node_modules/**",
        "dist/**",
        "build/**",
        "coverage/**",
        ".env"
      ],
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        globals: {
          process: "readonly"
        }
      },
      files: ["**/*.js"],
      rules: {
        "no-console": "warn",
        "no-unused-vars": "warn",
        "no-undef": "error",
        "semi": ["error", "always"],
        "quotes": ["error", "double", { "avoidEscape": true }],
        "indent": ["error", 2],
        "comma-dangle": ["error", "always-multiline"],
        "arrow-parens": ["error", "always"],
        "no-var": "error",
        "prefer-const": "error",
        "object-curly-spacing": ["error", "always"],
        "array-bracket-spacing": ["error", "never"],
        "max-len": ["warn", { "code": 100 }]
      }
    }
  ];