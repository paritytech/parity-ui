module.exports = {
  devServer: {
    contentBase: './src/web',
    proxy: {
      '/ws': {
        target: 'http://localhost:8180'
      }
    }
  }
};
