const webpack = require('webpack')
const path = require('path')
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = Object.assign({}, common, {
  mode: 'production',
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, '../build')
  },
  plugins: [
    new CleanWebpackPlugin({ currentAssets: [] }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './webpack.prod.html')
    }),
    new webpack.DefinePlugin({ process: { env: JSON.stringify('prod') } }),
  ]
})

if (process.argv.includes('--wx')) {
  config.module.rules.forEach(i => i.use.forEach(i => i.loader === 'file-loader' ? i.options.publicPath = 'static' : null))
  config.plugins = config.plugins.filter(i => i instanceof HtmlWebpackPlugin ? false : true)
}

module.exports = config