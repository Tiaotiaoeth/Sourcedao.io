const { merge } = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const pro = require('./webpack.pro')

module.exports = merge(pro, {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerPort: 8888, // 运行后的端口号
    }),
  ]
})