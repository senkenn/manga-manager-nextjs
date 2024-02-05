module.exports = {

  /**
   * コメントの前に空行をいれる
   *
   * @see https://eslint.org/docs/rules/lines-around-comment#require-empty-lines-around-comments-lines-around-comment
   */
  'lines-around-comment': [
    'error',
    {
      beforeBlockComment: true,
      afterBlockComment : false,
      beforeLineComment : true,
      allowClassStart   : false,
    },
  ],

  'jsdoc/require-jsdoc': 'off',

  'jsdoc/tag-lines': [
    'error',
    'always',
    {
      startLines   : 1,
      endLines     : 1,
      applyToEndTag: false,
      tags         : {
        param: {
          lines: 'any',
        },
        returns: {
          lines: 'any',
        },
      },
    },
  ],

  'jsdoc/sort-tags': [
    'error',
    {
      linesBetween: 1,
      tagSequence : [
        { tags: ['description'] },
        { tags: ['param'] },
        { tags: ['returns'] },
        { tags: ['see'] },
        { tags: ['example'] },
      ],
    },
  ],
};
