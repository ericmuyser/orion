"use strict";

var path = require('path');
var glob = require('glob');
var webpack = require('webpack');

module.exports = {
    title: 'Orion Guide',
    components: function() {
      return glob.sync(path.resolve(__dirname, 'src/UI/Components/**/*.js')).filter(function(module) {
        return /\/[A-Z]\w*\.js$/.test(module);
      });
    },
    updateWebpackConfig: function(webpackConfig, env) {
      // Your source files folder or array of folders, should not include node_modules
      let dir = path.join(__dirname, 'src');
      webpackConfig.module.loaders.push(
        // Babel loader will use your project’s .babelrc
        {
          test: /\.js?$/,
          include: dir,
          loader: 'babel',
           query: {
             presets: ['react', 'es2015', 'stage-0', 'react-hmre']
           },
           plugins: [
               new webpack.HotModuleReplacementPlugin(),
               new webpack.NoErrorsPlugin()
           ]
        }
      );

      webpackConfig.module.loaders.push(
        // Babel loader will use your project’s .babelrc
        {
          test: /\.css$/,
          include: path.join(__dirname, 'src'),
          loaders: [
            'style?sourceMap',
            'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
          ]
        }
      );
      return webpackConfig;
    },
   // Put other configuration options here...
};
