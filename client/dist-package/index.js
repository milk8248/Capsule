const {resolve} = require('path');

const BUILD_PATH = './build';

module.exports.default = function absolutePath() {
  return resolve(__dirname, BUILD_PATH)
};
