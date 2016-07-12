exports.loaders = [
  {
    test: /\.js$/,
    include: [
      /node_modules\/parity-signer/,
      /node_modules\/dapps-react-components/
    ],
    loader: 'babel',
    query: {
      presets: ['react-hmre']
    }
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
];
