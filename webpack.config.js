/* global __dirname, require, module*/

const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const pkg = require('./package.json');

let libraryName = pkg.name;

const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let outputFile, mode;

if (env === 'production') {
  mode = 'production';
  outputFile = libraryName + '.min.js';
} else {
  mode = 'development';
  outputFile = libraryName + '.js';
}

const config = {
  devtool: '',
  mode: mode,
  entry: __dirname + '/lib/elasticlunr.js',
  plugins: [
    new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(require('./package.json').version)
     }),
//     new BundleAnalyzerPlugin()
  ],
  output: {
    path: __dirname + '/build',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        enforce: "pre",
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./lib')],
    extensions: ['.json', '.js']
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  }
};

module.exports = config;