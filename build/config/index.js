const path = require('path');
const NODE_ENV = process.env.NODE_ENV || 'production';

module.exports = {
  src: path.resolve(__dirname, '../../src'),
  dest: path.resolve(__dirname, '../../dist'),
  external: [],
  env: NODE_ENV
}
