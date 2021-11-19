module.exports = {
  output: {
    hashFunction: "xxhash64"
  },
  entry: ['pages/index.js'],
  devServer: {
    port: 80,
    host: '0.0.0.0',
    hot: true,
    sockPort: 443,
    disableHostCheck: true,
    watchOptions: {
      poll: true
    },
    proxy: {
      '/api': 'http://authservice:8080'
    }
  }
};
