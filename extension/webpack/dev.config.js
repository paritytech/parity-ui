const path = require('path');
const webpack = require('webpack');

const host = 'localhost';
const port = 3030;
const hotScript = `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`;
const WebpackErrorNotificationPlugin = require('webpack-error-notification');

const baseDevConfig = () => ({
  devtool: 'eval-cheap-module-source-map',
  entry: {
    App: [hotScript, path.join(__dirname, '../chrome/extension/App')],
    background: [hotScript, path.join(__dirname, '../chrome/extension/background')],
  },
  devMiddleware: {
    publicPath: `http://${host}:${port}/js/`,
    stats: {
      colors: true
    },
    noInfo: true
  },

  output: {
    path: path.join(__dirname, '../dev/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    publicPath: `http://${host}:${port}/js/`
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
    new WebpackErrorNotificationPlugin(/* strategy */ /* options */),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react-hmre']
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: /node_modules\/parity-signer/,
        loader: 'babel',
        query: {
          presets: ['react-hmre']
        }
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss'
        ]
      },
      {
        test: /\.json$/,
        loaders: ['json']
      }
    ]
  }
});

const appConfig = baseDevConfig();

module.exports = [
  appConfig
];
