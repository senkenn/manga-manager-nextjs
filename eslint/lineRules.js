module.exports = {

  /**
   * 連続する空行は１行までとする
   *
   * @see https://eslint.org/docs/rules/no-multiple-empty-lines#disallow-multiple-empty-lines-no-multiple-empty-lines
   */
  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
};
