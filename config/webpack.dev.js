const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.common.js');
const dotenv = require('dotenv');
const { merge } = require('webpack-merge');

const config = dotenv.config({ path: './.env.dev' });

// common part for production and dev
const { cssLoaders } = require('./util');

// Configure Dev Server
const configureDevServer = () => {
  return {
    contentBase: path.resolve(__dirname, '../sources'),
    open: true,
    port: 1000,
    liveReload: true,
    hot: true,
    publicPath: '/',
    stats: 'errors-only',
    inline: true,
    watchContentBase: true,
  };
};

module.exports = merge(baseConfig, {
  // This option controls if and
  // how source maps are generated
  devtool: 'eval-source-map',

  // Providing the mode configuration option tells
  // webpack to use its built-in optimizations accordingly
  mode: 'development',

  // https://webpack.js.org/configuration/target/#root
  target: 'web',
  devServer: configureDevServer(),
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          'style-loader',
          ...cssLoaders
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    // we create a global variable that
    // we use in pug and we can use in js
    // https://webpack.js.org/plugins/define-plugin/
    // In pug - var DATA = self.htmlWebpackPlugin.options.DATA
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(config.parsed)
    }),
  ]
});