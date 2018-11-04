const chalk = require('chalk');
const child_process = require('child_process');
const path = require('path');
const dayjs = require('dayjs');

const pack = child_process.fork(path.resolve(__dirname, './pack.js'), [], {
  env: {
    NODE_ENV: process.env.NODE_ENV
  }
});

const timeLine = () => chalk.blue(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}]`)

const callback = (data, proc) => {
  switch (data.type) {
    case 'success':
      console.log(timeLine(), '🚀 🚀 🚀 ', chalk.bold.green(data.message));
      break;
    case 'message':
      console.log(timeLine(), ' 🎲 🎲 🎲 ', chalk.bold.blue(data.message));
      break;
    case 'warning':
      console.log(timeLine(), ' ❗️ ❗️ ❗️ ', chalk.bold.yellow(JSON.stringify(data.message)));
      break;
    case 'end':
    case 'exit':
      console.log(timeLine(), ' 🎁 🎁 🎁 ', chalk.green(data.message));
      process.exit();
      break;
    default:
      console.log(timeLine(), '          ', chalk.blue(data.message));
  }
};

console.log( timeLine(), chalk.green('Complier Running....') );
pack.on('message', data => callback(data, pack));
pack.on('exit', () => {
  process.exit();
})
