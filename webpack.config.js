var rucksack = require('rucksack-css');
var webpack = require('webpack');
var path = require('path');

var ENV = process.env.NODE_ENV || 'development';

module.exports = {
  context: path.join(__dirname, './client'),
  entry: {
    index: './index.js'
  },
  output: {
    path: path.join(__dirname, './static'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot', // TODO should be only in dev
          'babel'
        ]
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        include: /client/,
        loaders: [
          'style',
          'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss'
        ]
      },
      {
        test: /\.css$/,
        exclude: /client/,
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
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  postcss: [
    rucksack({
      autoprefixer: true
    })
  ],
  plugins: [
    // TODO [todr] paths in dapp-styles is hardcoded for meteor, we need to rewrite it here
    new webpack.NormalModuleReplacementPlugin(
      /ethereum_dapp-styles/,
      function (a) {
        a.request = a.request.replace('./packages/ethereum_dapp-styles', '.');
        a.request = a.request.replace('./lib/packages/ethereum_dapp-styles', '.');
        return a;
      }
    ),
    new webpack.NormalModuleReplacementPlugin(
      /dapp-styles\/hex-grid-tile\.png$/,
      require.resolve('dapp-styles/hex-grid-tile.png')
    ),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(ENV) }
    })
  ],
  devServer: {
    contentBase: './client',
    hot: true
  }
};
