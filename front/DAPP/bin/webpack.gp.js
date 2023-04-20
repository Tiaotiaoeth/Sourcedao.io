const path = require('path')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../docs'),
    publicPath: './'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(__dirname, '../docs/static')
      }],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
  }
})