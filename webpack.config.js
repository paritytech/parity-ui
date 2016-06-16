var rucksack = require('rucksack-css');
var webpack = require('webpack');
var path = require('path');
var WebpackErrorNotificationPlugin = require('webpack-error-notification');

var ENV = process.env.NODE_ENV || 'development';
var isProd = ENV === 'production';

const entry = {
  'index': './index.js'
};

if (!isProd) {
  entry.docs = './docs/docs.js';
}

module.exports = {
  debug: !isProd,
  cache: !isProd,
  devtool: isProd ? '#source-map' : '#cheap-module-eval-source-map',
  context: path.join(__dirname, './src'),
  entry: entry,
  output: {
    library: 'dapps-react-ui',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    path: path.join(__dirname, './build'),
    filename: '[name].js'
  },
  externals: isProd ? [
    /^material-ui/,
    'react',
    'react-addons-css-transition-group',
    'react-tap-event-plugin'
  ] : [],
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
      },
      {
        test: /blockies/,
        loader: 'exports?blockies'
      }

    ],
    noParse: [
      /node_modules\/sinon/
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    unsafeCache: true
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
          NODE_ENV: JSON.stringify('development'),
          RPC_ADDRESS: JSON.stringify(process.env.RPC_ADDRESS)
        }
      }),
      new WebpackErrorNotificationPlugin(/* strategy, options */)
    ];

    if (isProd) {
      plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
      plugins.push(new webpack.optimize.DedupePlugin());
    }

    return plugins;
  }()),
  devServer: {
    contentBase: './src/docs',
    hot: !isProd,
    proxy: {
      '/rpc*': {
        target: 'http://localhost:8080'
      }
    }
  }
};
