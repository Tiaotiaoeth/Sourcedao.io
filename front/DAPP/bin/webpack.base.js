const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const WebpackBar = require('webpackbar')
const alias = require('./config/alias')
const extensions = require('./config/extensions')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')


const isLocal = process.env.NODE_ENV === 'local'

const commonCssLoader = [
  isLocal ? 'style-loader' : MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          [
            "postcss-preset-env",
            {
              ident: 'postcss',
            },
          ],
        ]
      }
    }
  }
]

const rules = [
  {
    test: /\.(tsx?|jsx?)$/,
    use: [
      {
        loader: "babel-loader",
        options: {
          cacheDirectory: true
        }
      }
    ],
    exclude: '/node_modules/'
  },
  {
    test: /\.less$/,
    use: [
      ...commonCssLoader,
      'less-loader'
    ],
    exclude: '/node_modules/'
  },
  {
    test: /\.css$/,
    use: commonCssLoader,
    exclude: '/node_modules/'
  },
  {
    test: /\.(png|svg|jpg|gif|jpeg|cur)$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 8 * 1024,
        name: '[contenthash:8].[ext]',
        outputPath: 'imgs'
      }
    },
    exclude: '/node_modules/'
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    use: {
      loader: "file-loader",
      options: {
        name: '[contenthash:8].[ext]',
        outputPath: 'fonts'
      }
    },
    exclude: '/node_modules/'
  }
]

module.exports = {
  target: 'web',
  cache: {
    type: isLocal ? 'memory' : 'filesystem',
  },
  entry: './src/main.tsx',
  output: {
    clean: true,
    filename: isLocal ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
    chunkFilename: isLocal ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  resolve: {
    alias,
    extensions,
    modules: [path.resolve(__dirname, '../src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        oneOf: rules
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      favicon: path.resolve(__dirname, '../static/favicon.png'),
      templateContent: ({ htmlWebpackPlugin }) => {
        const templatePath = path.resolve(__dirname, '../src/index.html')
        const template = fs.readFileSync(templatePath, 'utf8')
        let newTemplate = template.replace('</head>', `${htmlWebpackPlugin.tags.headTags}</head>`)
        newTemplate = template.replace('</body>', `${htmlWebpackPlugin.tags.bodyTags}</body>`)
        const regexp = /<!-- vite start -->[\s\S]*?<!-- vite end -->/
        newTemplate = newTemplate.replace(regexp, '')
        return newTemplate
      }
    }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(__dirname, '../dist/static')
      }],
    }),
    new webpack.DefinePlugin({
      'process.env.WEB_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new WebpackBar({
      name: isLocal ? "RUNNING" : "BUILDING",
      color: "#52c41a"
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    }),
    new NodePolyfillPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30 * 1024,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 5,
      automaticNameDelimiter: '~',     
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
    chunkIds: 'named',
  },
  performance: {
    hints:'warning',
    maxEntrypointSize: 1024*300, // 300K
  }
}