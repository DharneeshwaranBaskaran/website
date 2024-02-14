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
        test: /\.(js|mjs|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Update the extensions list
    fallback: {
    
      path: require.resolve('path-browserify'),
    },
  },
};
