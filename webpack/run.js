const webpack = require('webpack')
const fs = require('fs')
const path = require('path')

if (process.argv.includes('--dev')) {
  const webpackConfig = require('./webpack.dev')
  const compiler = webpack(webpackConfig)

  const serverConfig = { port: 8000, open: true }
  if (process.argv.filter(i => i.includes('port'))[0]) serverConfig.port = process.argv.filter(i => i.includes('port'))[0].split('=')[1]

  const WebpackDevServer = require('webpack-dev-server')
  const app = new WebpackDevServer(serverConfig, compiler)
  app.start().then(err => {
    if (err) throw err
  })
}

if (process.argv.includes('--prod')) {
  const webpackConfig = require('./webpack.prod')

  webpack(webpackConfig, (err, stats) => {
    if (err) throw err
    console.log(stats.toString({ colors: true, modules: true, children: true, chunks: true, chunkModules: true }))

    if (process.argv.includes('--wx')) {
      fs.copyFileSync(path.join(__dirname, '../static/wx-config/game.json') ,webpackConfig.output.path + '/game.json')
      fs.copyFileSync(path.join(__dirname, '../static/wx-config/project.config.json') ,webpackConfig.output.path + '/project.config.json')
    }
  })
}