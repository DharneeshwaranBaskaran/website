const path = require('path');

module.exports = function override(config, env) {
  if (env.target === 'electron-renderer') {
    config.target = 'electron-renderer';
    config.output.libraryTarget = 'commonjs2';
  }

  // Extend existing module.rules with Babel loader for JSX
  config.module.rules.push({
    test: /\.(js|mjs)$/, // Updated to support both .js and .mjs files
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
    },
  });

  // Handle resolving modules
  config.resolve.fallback = {
    fs: false,
    path: require.resolve('path-browserify'),
  };

  return {
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        fs: false,
        os: false,
        path: false,
      },
    },
  };
};
