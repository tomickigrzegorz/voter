const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const config = dotenv.config();

module.exports = {
  entry: {
    home: ['./sources/script.js', './sources/style.scss'],
  },
  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: '[name].[fullhash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.parsed.VOTER_TITLE,
      template: 'sources/index.html',
    }),
    // we create a global variable that
    // we use in pug and we can use in js
    // https://webpack.js.org/plugins/define-plugin/
    // In pug - var DATA = self.htmlWebpackPlugin.options.DATA
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(config.parsed),
    }),
  ],
};
