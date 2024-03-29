const webpack = require('webpack')
const { merge } = require('webpack-merge')
const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 3000,
    open: true,
    compress: true,
    hot: true, 
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://app.sourcedao.io',
        pathRewrite: { '^/api': '' },
      },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
})
