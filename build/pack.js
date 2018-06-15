
const fs = require('fs');
const rollup = require('rollup');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

const builds = require('./build').getAllBuilds();

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

process.send && process.send({
  type: 'message',
  message: 'Build DISTs Start.'
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
})
