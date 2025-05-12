import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { jest: eslintPluginJest, prettier: eslintPluginPrettier },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'prettier/prettier': ['error', {
        printWidth: 100,
        singleQuote: true,
        trailingComma: 'all',
        semi: true,
        tabWidth: 2,
      }],
    },
    settings: {
      jest: {
        version: 29,
      },
    },
    ignores: [
      'dist/**',
      'node_modules/**',
      '.eslintrc.js',
      'jest.config.js',
      'test/**',
    ],
  },
);
