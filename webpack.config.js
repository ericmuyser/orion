var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'app': ['./src/index.web.js'],
    'index.ios': ['./src/index.ios.js']
  },
  output: {
    path: __dirname,
    publicPath: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
        //exclude: 'node_modules',
        query: {
          cacheDirectory: true,
          plugins: [],
          presets: ['react', 'es2015', 'stage-0', 'react-hmre']
        }
      }
    ]
  },
  plugins: []
};