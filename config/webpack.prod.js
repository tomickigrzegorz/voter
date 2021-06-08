const webpack = require('webpack');
const baseConfig = require('./webpack.common.js');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const dotenv = require('dotenv');

const config = dotenv.config({ path: './.env.prod' });

// common part for production and dev
const { cssLoaders } = require('./util');

// configure Optimization
const configureOptimization = () => {
  return {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
}

// configure MiniCssExtract
const configureMiniCssExtract = () => {
  return {
    filename: '[name].[fullhash].css'
  }
}

// configure Copy
const configureCopy = () => {
  return {
    patterns: [
      {
        from: 'sources/images.json'
      },
    ]
  }
};

module.exports = merge(baseConfig, {
  mode: 'production',
  target: 'browserslist',
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // set path for images
              // this setting is compatible with windows
              // changes the path to the file, in our case svg
              publicPath: '../../',
            },
          },
          ...cssLoaders
        ],
      },
    ],
  },
  optimization: configureOptimization(),
  plugins: [
    // when we run the production build then 
    // the docs folder is cleared
    new CleanWebpackPlugin({
      dry: false,
      verbose: true
    }),

    // we copy all necessary graphic files
    // and assets to build folder
    new CopyWebpackPlugin(
      configureCopy()
    ),

    // we extract scss files from js and create
    // separate files for individual pages
    new MiniCssExtractPlugin(
      configureMiniCssExtract()
    ),

    // we create a global variable that
    // we use in pug and we can use in js
    // https://webpack.js.org/plugins/define-plugin/
    // In pug - var DATA = self.htmlWebpackPlugin.options.DATA
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(config.parsed)
    }),
  ]
});