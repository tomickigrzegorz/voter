const baseConfig = require('./webpack.common.js');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// common part for production and dev
const { cssLoaders } = require('./util');

// configure Optimization
const configureOptimization = {
  minimize: true,
  minimizer: [new TerserPlugin()],
};

// configure MiniCssExtract
const configureMiniCssExtract = [
  {
    filename: '[name].[fullhash].css',
  },
];

// configure Copy
const configureCopy = () => {
  return {
    patterns: [
      {
        from: 'sources/images.json',
      },
    ],
  };
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
          ...cssLoaders,
        ],
      },
    ],
  },
  plugins: [
    // when we run the production build then
    // the docs folder is cleared
    new CleanWebpackPlugin({
      dry: false,
      verbose: true,
    }),

    // we copy all necessary graphic files
    // and assets to build folder
    new CopyWebpackPlugin(configureCopy()),

    // we extract scss files from js and create
    // separate files for individual pages
    new MiniCssExtractPlugin(...configureMiniCssExtract),
  ],
  optimization: { ...configureOptimization },
  performance: {
    // https://webpack.js.org/configuration/performance/#performancehints
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
