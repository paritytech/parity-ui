module.exports = (eslintrc => {
  eslintrc.globals.chrome = true;
  return eslintrc;
})(require('../.eslintrc.json'))