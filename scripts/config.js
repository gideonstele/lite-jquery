const pkg = require('../package.json');
const version = process.env.VERSION || pkg.version

const path = require('path');
const cjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const uglify_es = require('rollup-plugin-uglify-es');
const eslint = require('rollup-plugin-eslint').eslint;

const banner = `/*!
 * Lite-Query v${version}
 * (c) 2017-${new Date().getFullYear()} Gideon Asaph
 * Released under the MIT License.
 */`;
const base = {
  src: path.resolve(__dirname, '../src'),
  dest: path.resolve(__dirname, '../dist'),
  external: [],
  env: NODE_ENV
};

const builds = {
  'lite.umd': {
    entry: path.resolve(base.src, 'index.umd.js'),
    env: base.env,
    dest: path.resolve(base.dest, 'lite.umd.js'),
    format: 'iife',
    external: base.external
  },
  'lite.cjs': {
    entry: path.resolve(base.src, 'index.js'),
    env: base.env,
    dest: path.resolve(base.dest, 'lite.cjs.js'),
    format: 'cjs',
    external: base.external
  },
  'lite.esm': {
    entry: path.resolve(base.src, 'index.esm.js'),
    env: base.env,
    dest: path.resolve(base.dest, 'lite.esm.js'),
    format: 'es',
    external: base.external
  }
}

function generateAllRollupConfig(name) {
  const opts = builds[name];
  const config = {
    external: opts.external,
    treeshake: true,
    plugins: [
      replace({
        '__VERSION__': version
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
  if (process.env.NODE_ENV) {
    config.plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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