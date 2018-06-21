const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = {
  context: path.resolve(__dirname, '../'),
  entry: {
    'demo-1': path.resolve(__dirname, '../src/demo-1')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.json', '.css',],
  },
  module: {
    rules: [
      /* javascript start */
      {
        test: /\.(js)$/,
        enforce: 'pre',
        include: [path.resolve(__dirname, '../examples')],
        use: {
          loader: 'eslint-loader',
          options: {
            configFile: path.resolve(__dirname, '../.eslintrc.js')
          }
        }
      },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, '../examples')],
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [
              ["env", {
                "modules": false,
                "targets": {
                  "browsers": ["last 10 Chrome versions", "iOS >= 7", "Android >= 4.0"]
                }
              }],
              "stage-2"
            ],
            "plugins": [
              "lodash",
              "transform-runtime",
              "syntax-dynamic-import",
              "transform-decorators-legacy",
              "transform-decorators"
            ]
          }
        }
      },
      /* javascript end */
      /* source start */
      {
        test: /\.(png|jpe?g|gif|svg)/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'images/[name]-[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'media/[name]-[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'fonts/[name]-[hash:7].[ext]'
          }
        }
      }
      /* source end */
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/demo-1.html'),
      filename: 'demo-1.html',
      chunksSortMode: 'dependency'
    })
  ]
};

module.exports = baseConfig;
