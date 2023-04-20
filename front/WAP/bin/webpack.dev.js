const webpack = require('webpack')
const { merge } = require('webpack-merge')
const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: '192.168.1.2',
    port: 9090,
    open: true,
    compress: true,
    hot: true, 
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
})
