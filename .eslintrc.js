// __dirname 以下から全 `.gitignore` を探して `ignorePatterns` で使えるように変換する
const { readGitignoreFiles } = require('eslint-gitignore');
const spacingRules = require('./eslint/spacingRules');
const lineRules = require('./eslint/lineRules.js');
const commentRules = require('./eslint/commentRules.js');

const gitignore = readGitignoreFiles({ cwd: __dirname });

module.exports = {
  env: {
    es2021: true,
    node  : true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@next/next/recommended',
    'plugin:jsdoc/recommended',
  ],
  parser       : '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType : 'module',
  },
  plugins       : ['@typescript-eslint', 'simple-import-sort', 'import', 'jsdoc'],
  ignorePatterns: gitignore,
  rules         : {
    indent           : ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes           : ['error', 'single'],
    semi             : ['error', 'always'],
    ...spacingRules,
    ...lineRules,
    ...commentRules,

    /**
     * Type定義のメンバの分割はセミコロンにする
     *
     * @see https://typescript-eslint.io/rules/member-delimiter-style/
     */
    '@typescript-eslint/member-delimiter-style': 'error',

    /**
     * 関数の返却型を明示する
     *
     * @description
     * allowExpressions: true の場合、宣言の一部である関数だけチェック。
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
     *
     */
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
      },
    ],

    /**
     * Disallow renaming import, export, and destructured assignments to the same name
     *
     * @see https://eslint.org/docs/latest/rules/no-useless-rename
     */
    'no-useless-rename': 'error',

    // "import React from 'react'"なしでもエラーが出ないようにする
    'react/react-in-jsx-scope': 'off',

    /**
     * ヨーダ記法を使用しない
     *
     * @description
     * exceptRange: 範囲を示す時はヨーダ記法を使用していい
     *
     * @see https://eslint.org/docs/rules/yoda#require-or-disallow-yoda-conditions-yoda
     */
    yoda: ['error', 'never', { exceptRange: true }],

    /**
     * 命名規則
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/naming-convention.md
     */
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format  : ['PascalCase'],
        custom  : {
          regex: '^I[A-Z]',
          match: true,
        },
      },
      {
        selector: 'class',
        format  : ['PascalCase'],
      },
      {
        selector: 'typeAlias',
        format  : ['PascalCase'],
      },
      {
        selector: 'function',
        format  : ['camelCase'],
      },
      {
        selector: 'method',
        format  : ['camelCase'],
      },
      {
        selector: 'variable',
        format  : ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'parameterProperty',
        format  : ['camelCase'],
      },
      {
        selector         : 'property',
        format           : ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector          : 'parameter',
        format            : ['camelCase'],
        trailingUnderscore: 'allow',
      },
      {
        selector: 'typeParameter',
        format  : ['PascalCase'],
        prefix  : ['T', 'U', 'K', 'P', 'E'],
      },
    ],

    /**
     * switchのcase句でブロックを利用せずに変数や関数を定義するするのを禁止
     *
     * @see https://eslint.org/docs/rules/no-case-declarations#disallow-lexical-declarations-in-casedefault-clauses-no-case-declarations
     */
    'no-case-declarations': 'error',

    /**
     * Sort Import
     */
    'simple-import-sort/imports' : 'error',
    'simple-import-sort/exports' : 'error',
    'import/first'               : 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates'       : 'error',

    /**
     * Enforce consistent use of trailing commas in object and array literals
     * Use a trailing comma whenever the object or array literal spans multiple lines
     *
     * @example
     * ok
     * const foo = { a, b }
     * const foo = {
     *   a,
     *   b,
     * }
     *
     * bad
     * const foo = { a, b, }
     * const foo = {
     *   a,
     *   b
     * }
     */
    'comma-dangle': ['error', 'always-multiline'],

    /**
     * Disallow the use of the 'any' type
     */
    '@typescript-eslint/no-explicit-any': 'error',
  },
  overrides: [
    {
      files: '*.js',
      rules: {
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-var-requires'  : 'off',
      },
    },
    {
      files: ['*.tsx'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'function',
            format  : ['camelCase', 'PascalCase'],
          },
        ],
      },
    },
    {
      files: ['*.test.ts', '*.test.tsx'],
      rules: {

        /**
         * Allow the use of 'any' in test code
         */
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
