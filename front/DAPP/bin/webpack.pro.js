const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
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