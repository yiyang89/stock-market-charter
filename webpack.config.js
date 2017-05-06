const path = require('path');

module.exports = {
  entry: ['./public/scripts/main.js'],
  output: {
    path: path.resolve(__dirname, 'public/build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test:/\.js$/,
        include: path.resolve(__dirname, 'public'),
        exclude: [/node_modules/,'index.js','/public/build/']
      }
    ]
  }
}
