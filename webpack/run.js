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
      fs.writeFileSync(webpackConfig.output.path + '/game.json', `{
        "deviceOrientation": "portrait"
      }`)
      fs.writeFileSync(webpackConfig.output.path + '/project.config.json', `{
        "description": "项目配置文件，详见文档：https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html",
        "setting": {
          "urlCheck": false,
          "es6": true,
          "postcss": true,
          "minified": true,
          "newFeature": true,
          "coverView": true,
          "lazyloadPlaceholderEnable": false,
          "preloadBackgroundData": false,
          "autoAudits": false,
          "uglifyFileName": false,
          "uploadWithSourceMap": true,
          "enhance": true,
          "showShadowRootInWxmlPanel": true,
          "packNpmManually": false,
          "packNpmRelationList": [],
          "minifyWXSS": true,
          "useStaticServer": true,
          "showES6CompileOption": false,
          "checkInvalidKey": true,
          "babelSetting": {
            "ignore": [],
            "disablePlugins": [],
            "outputPath": ""
          },
          "disableUseStrict": false,
          "useCompilerPlugins": false
        },
        "compileType": "game",
        "libVersion": "2.20.1",
        "appid": "wx30b492036b9a2679",
        "projectname": "quickstart",
        "condition": {},
        "packOptions": {
          "ignore": [],
          "include": []
        },
        "editorSetting": {
          "tabIndent": "insertSpaces",
          "tabSize": 2
        }
      }`)
    }
  })
}