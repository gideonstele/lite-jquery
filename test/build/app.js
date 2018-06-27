const path = require('path');
const Koa = require('koa');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser')
const webpack = require('webpack');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware')
const app = new Koa();

const devWebpackConfig = require('./webpack.dev');
const distPath = path.resolve(__dirname, '../../dist');
const testPath = path.resolve(__dirname, '../../test');

const complier = webpack(devWebpackConfig);

app.use(bodyParser());
app.use(static(distPath));
app.use(static(testPath));

// app.use(async (ctx) => {
//   ctx.body = 'hello world';
// });

app.use(webpackDevMiddleware(complier, {
  hot: true,
  compress: true,
  noInfo: false,
  quiet: false,
  aggregateTimeout: 300,
  publicPath: "/",
  open: 'http://localhost:3000/test-unit.html',
  stats: {
    colors: true
  }
}));
app.use(webpackHotMiddleware(complier, {
  noInfo: false,
}));

app.listen(3000, () => {
  console.log('3000 Starting...');
});

module.exports = app;
