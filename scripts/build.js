const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const rollup = require('rollup');
const terser = require('terser');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

let builds = require('./config').getAllBuilds()

function build() {
  return builds.map(async b => {
    const compiler = await rollup.rollup(b.inputOptions);
    const write = await compiler.write(b.outputOptions);
    process.send({
      message: 'built: ' + b.name,
      type: 'success'
    });
    return write;
  });
}

process.on('unhandledRejection', err => {
  process.send({
    message: err,
    type: 'error'
  });
});

process.send && process.send({
  type: 'message',
  message: 'Build Start.'
});

Promise.all(build()).then(res => {
  process.send({
    message: 'success',
    type: 'end'
  });
  process.exit(-1);
});

process.on('message', m => {
  process.send({
    message: m,
    type: 'success'
  });
});

process.on('warning', m => {
  process.send({
    message: m,
    type: 'warning'
  });
});

process.on('exit', m => {
  process.send({
    message: m,
    type: 'exit'
  });
});