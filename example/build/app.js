const path = require('path');
const Koa = require('koa');
const staticMiddleware = require('koa-static');
const bodyParser = require('koa-bodyparser')
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-koa-middleware');
const webpackHotMiddleware = require('webpack-hot-koa-middleware')
const app = new Koa();

const devWebpackConfig = require('./webpack.dev');
const examplePath = path.resolve(__dirname, '../dist');
const distPath = path.resolve(__dirname, '../../dist');
const testPath = path.resolve(__dirname, '../../test');

const complier = webpack(devWebpackConfig);

app.use(bodyParser());
app.use(staticMiddleware(examplePath));
app.use(staticMiddleware(distPath));
app.use(staticMiddleware(testPath));

app.use(webpackDevMiddleware(complier, {
  hot: true,
  compress: true,
  noInfo: false,
  quiet: false,
  aggregateTimeout: 300,
  publicPath: '/',
  open: 'http://localhost:3000/demo-1.html',
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
