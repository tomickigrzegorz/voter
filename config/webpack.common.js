const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const config = dotenv.config({ path: './.env.prod' });

module.exports = {
  entry: {
    home: [
      './sources/script.js',
      './sources/style.scss'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: '[name].[fullhash].js',
    publicPath: './',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.parsed.WYBORNIK_TITLE,
      template: 'sources/index.html'
    })
  ]
};