const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {

  return {
    mode: "development",
    // webpack folder's entry js - excluded from jekll's build process, since the compiled version is what we'll use in the DOM.
    entry: "./webpack/entry.js",
    output: {
      // put the generated file in the assets folder so jekyll will grab it.
      path: path.resolve(__dirname, 'assets/js'),
      filename: "search.js"
    },
    // loaders for different libraries and, eventually, filetypes
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          ELASTICSEARCH_URL: JSON.stringify(env.ELASTICSEARCH_URL)
        }
      })
    ]
  }
};
