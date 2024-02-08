const path = require('path');

module.exports = {
  mode: 'development', 
  target: 'electron-renderer',
  entry: './src/electroncomponents/renderer.js', 
  output: {
    path: path.resolve(__dirname, 'build'), 
    filename: 'renderer.bundle.js', 
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false, 
      path: require.resolve('path-browserify'),
    },
  },
};
