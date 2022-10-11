const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../build')
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|mp3|m4a)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
    ]
  }
}