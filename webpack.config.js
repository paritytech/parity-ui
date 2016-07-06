var rucksack = require('rucksack-css');
var webpack = require('webpack');
var path = require('path');
var WebpackErrorNotificationPlugin = require('webpack-error-notification');
var WebpackCopyOnDonePlugin = require('webpack-copy-on-done-plugin');

var ENV = process.env.NODE_ENV || 'development';
var isProd = ENV === 'production';

process.env.LOGGING = !isProd || isSigner();

module.exports = {
  debug: !isProd,
  cache: !isProd,
  devtool: isProd ? '#source-map' : '#cheap-module-eval-source-map',
  context: path.join(__dirname, './app'),
  entry: {
    index: isProd ? './index.js' : './index.dev.js'
  },
  output: {
    library: 'parity-sysui-app',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    path: path.join(__dirname, './build'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: isProd ? ['babel'] : [
          'react-hot',
          'babel'
        ]
      },
      {
        test: /\.json$/,
        loaders: ['json']
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        include: /app/,
        loaders: [
          'style',
          'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss'
        ]
      },
      {
        test: /\.css$/,
        exclude: /app/,
        loader: 'style!css'
      },
      {
        test: /\.less$/,
        loaders: [
          'style',
          'css',
          'less'
        ]
      },
      {
        test: /\.(png|jpg|)$/,
        loader: 'file-loader'
      },
      {
        // Match woff2 in addition to patterns like .woff?v=1.1.1.
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url',
        query: {
          limit: 50000,
          mimetype: 'application/font-woff',
          name: 'assets/fonts/[hash].[ext]'
        }
      }
    ],
    noParse: [
      /node_modules\/sinon/
      // /node_modules\/dapps-react-ui/
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    unsafeCache: true
    // alias: isProd ? {} : {
    //   'dapps-react-ui': __dirname + '/index.js'
    // }
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
      new WebpackErrorNotificationPlugin(/* strategy, options */)
    ];

    if (isSigner()) {
      plugins.push(new WebpackCopyOnDonePlugin(signerPluginOpts()));
    }

    if (isProd && !isSigner()) {
      plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
      plugins.push(new webpack.optimize.DedupePlugin());
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
  }()),
  devServer: {
    contentBase: './app',
    hot: !isProd
  }
};

function isSigner () {
  return !!process.argv.find(arg => arg.indexOf('--signer=') > -1);
}

function signerPluginOpts () {
  const dappTarget = '../parity-dapps-minimal-sysui-rs/src/web/app.js';
  const extTarget = '../parity-sysui-chrome-extension/node_modules/parity-sysui-app/build/index.js';
  const target = isDappSigner() ? dappTarget : extTarget;
  return {
    target: target
  };
}

function isDappSigner () {
  return process.argv
              .find(arg => arg.indexOf('--signer=') > -1)
              .indexOf('dapp') > -1;
}
