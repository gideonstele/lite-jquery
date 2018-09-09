const path = require('path');
const cjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const uglify_es = require('rollup-plugin-uglify-es');
const eslint = require('rollup-plugin-eslint').eslint;

const pkg = require('../package.json');
const config = require('./config');
const NODE_ENV = process.env.NODE_ENV;

const builds = {
  'lite.umd': {
    entry: path.resolve(config.src, 'index.umd.js'),
    env: config.env,
    dest: path.resolve(config.dest, 'lite.umd.js'),
    format: 'iife',
    external: config.external
  },
  'lite.cjs': {
    entry: path.resolve(config.src, 'index.js'),
    env: config.env,
    dest: path.resolve(config.dest, 'lite.cjs.js'),
    format: 'cjs',
    external: config.external
  },
  'lite.esm': {
    entry: path.resolve(config.src, 'index.esm.js'),
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
    treeshake: true,
    plugins: [
      replace({
        '__VERSION__': pkg.version
      }),
      eslint(),
      babel({
        externalHelpers: true,
        runtimeHelpers: true
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
      name === 'lite.esm' ? uglify_es() : uglify.uglify()
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
    name: opts.moduleName || 'lite'
  };
  return { inputOptions, outputOptions , name };
}

module.exports = {
  generateAllRollupConfig,
  getAllBuilds: () => Object.keys(builds).map(generateAllRollupConfig)
};
