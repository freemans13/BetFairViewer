module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/prop-types': 'off',
    'no-console': 'warn',
  },
};
// to make vscode auto format using eslint rules add this to vscode settings.json:
// "eslint.format.enable": true,
// "editor.codeActionsOnSave": {
//   "source.fixAll.eslint": true
// },
