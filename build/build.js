const path = require('path');
const cjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const eslint = require('rollup-plugin-eslint');

const pkg = require('../package.json');
const config = require('./config');

const builds = {
  'lite.umd': {
    entry: path.resolve(config.src, 'index.umd.js'),
    env: config.env,
    dest: path.resolve(config.dest, 'lite.umd.js'),
    format: 'iife',
    external: config.external
  },
  'lite.esm': {
    entry: path.resolve(config.src, 'index.js'),
    env: config.env,
    dest: path.resolve(config.dest, 'lite.esm.js'),
    format: 'es',
    external: config.external
  },
};

function generateAllRollupConfig(name) {
  const opts = builds[name];
  const config = {
    external: opts.external,
    plugins: [
      replace({
        '__VERSION__': pkg.version
      }),
      eslint(),
      babel({
        externalHelpers: true
      }),
      resolve({
        jsnext: true,
        browser: true,
        extensions: ['.js', '.json'],
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
      cjs({}),
      uglify()
    ]
  };
  if (NODE_ENV) {
    config.plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }));
  }
  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  });
  const inputOptions = {
    input: opts.entry,
    ...config
  };
  const outputOptions = {
    file: opts.dest,
    format: opts.format,
    banner: opts.banner,
    name: opts.moduleName || 'Ideacome'
  };
  return { inputOptions, outputOptions , name };
}

module.exports = {
  generateAllRollupConfig,
  getAllBuilds: () => Object.keys(builds).map(genConfig)
};
