module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: [
    'airbnb-base'
  ],
  rules: {
    'semi': [2, 'always'],
    'comma-dangle': [2, 'never'],
    'no-console': 0,
    'linebreak-style': 0,
    'array-callback-return': 0
  }
};
