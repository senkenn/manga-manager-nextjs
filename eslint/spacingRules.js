module.exports = {
  '@typescript-eslint/type-annotation-spacing': [
    'error',
    {
      before   : false,
      after    : true,
      overrides: {
        arrow: { before: true, after: true },
      },
    },
  ],

  /**
   * コメントの最初にはスペースを入れる
   *
   * @see https://eslint.org/docs/rules/spaced-comment#requires-or-disallows-a-whitespace-space-or-tab-beginning-a-comment-spaced-comment
   */
  'spaced-comment': ['error', 'always', { block: { exceptions: ['*'] } }],

  /**
   * ブレースの内側にはスペースを入れる
   *
   * @see https://eslint.org/docs/latest/rules/object-curly-spacing
   */
  'object-curly-spacing': ['error', 'always'],

  /**
   * no space inside parentheses
   *
   * @see https://eslint.org/docs/latest/rules/space-in-parens
   */
  'space-in-parens': ['error', 'never'],

  /**
   * オブジェクト要素のキーとバリューの間にスペースをいれるか
   *
   * @see https://eslint.org/docs/rules/key-spacing#enforce-consistent-spacing-between-keys-and-values-in-object-literal-properties-key-spacing
   */
  'key-spacing': [
    'error',
    {
      beforeColon: false,
      afterColon : true,
      align      : 'colon',
    },
  ],

  /**
   * キーワードの前後にスペースを入れるか
   *
   * @see https://eslint.org/docs/rules/keyword-spacing#enforce-consistent-spacing-before-and-after-keywords-keyword-spacing
   */
  'keyword-spacing': [
    'error',
    {
      before   : true,
      after    : true,
      overrides: {},
    },
  ],

  /**
   * Enforce consistent spacing before and after commas
   */
  'comma-spacing': ['error', { before: false, after: true }],

  'no-multi-spaces': 'error',

  'space-infix-ops': 'error',
};
