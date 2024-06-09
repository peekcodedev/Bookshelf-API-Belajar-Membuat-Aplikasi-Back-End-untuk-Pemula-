import globals from 'globals';
import js from '@eslint/js';
import airbnb from 'eslint-config-airbnb-base';

export default [
  js.configs.recommended,
  airbnb,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // Tambahkan aturan khusus jika diperlukan
    },
  },
];