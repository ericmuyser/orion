var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'app': ['./App/Game/index.web.js'],
    'index.ios': ['./App/Game/index.ios.js']
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
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src'),
        loaders: [
          'style?sourceMap',
          'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ]
      }
    ]
  },
  plugins: []
};
