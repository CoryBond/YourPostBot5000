var path    = require('path');
var webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, 'src/build');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: APP_DIR + '/js/TemplateCanvas.jsx',
  output: {
    path: BUILD_DIR,
    publicPath: '/build',
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  },
  devServer: {
    contentBase: APP_DIR,
    inline: true,
    stats: 'errors-only'
  }
};

module.exports = config;