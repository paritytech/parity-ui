var rucksack = require('rucksack-css');
var webpack = require('webpack');
var path = require('path');
var WebpackErrorNotificationPlugin = require('webpack-error-notification');
var WebpackCopyOnDonePlugin = require('webpack-copy-on-done-plugin');

var ENV = process.env.NODE_ENV || 'development';
var isProd = ENV === 'production';

var outputBase = isProd ? 'build' : 'dev';
var env = isProd ? 'prod' : 'dev';

module.exports = {
  debug: !isProd,
  cache: !isProd,
  devtool: isProd ? '#source-map' : '#cheap-module-eval-source-map',
  context: path.join(__dirname, 'chrome'),
  entry: {
    app: './extension/app.js',
    background: './extension/background.js'
  },
  output: {
    path: path.join(__dirname, outputBase),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.js$/,
        include: [/dapps-react-components/, /parity-signer/],
        loader: 'babel'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        include: /src/,
        loaders: [
          'style',
          'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss'
        ]
      },
      {
        test: /\.css$/,
        exclude: /src/,
        loader: 'style!css'
      },
      {
        test: /\.(png|jpg|)$/,
        loader: 'file-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(woff(2)|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ],
    noParse: [
      /node_modules\/sinon/
    ]
  },
  resolve: {
    root: path.join(__dirname, 'node_modules'),
    fallback: path.join(__dirname, 'node_modules'),
    extensions: ['', '.js', '.jsx'],
    unsafeCache: true
  },
  resolveLoaders: {
    root: path.join(__dirname, 'node_modules'),
    fallback: path.join(__dirname, 'node_modules')
  },
  postcss: [
    rucksack({
      autoprefixer: true
    })
  ],
  plugins: (function () {
    var plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(ENV),
          RPC_ADDRESS: JSON.stringify(process.env.RPC_ADDRESS)
        }
      }),
      new WebpackErrorNotificationPlugin(/* strategy, options */),
      new WebpackCopyOnDonePlugin([
        { src: `chrome/manifest.${env}.json`, target: `./${outputBase}/manifest.json` },
        { src: 'chrome/assets/*', target: `./${outputBase}/` }
      ])
    ];

    if (isProd) {
      plugins.push(new webpack.optimize.DedupePlugin());
      plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        screwIe8: true,
        compress: {
          warnings: false
        },
        output: {
          comments: false
        }
      }));
    }

    return plugins;
  }())
};
