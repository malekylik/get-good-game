const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const mode = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production' ? 'production' : 'development';

module.exports = {
  mode: mode,
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: {
      rewrites: [
        { from: '/', to: '/get-good-game.html' },
      ]
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'get-good-game.html',
    }),
    new CleanWebpackPlugin(['dist'], {
      verbose: false,
      exclude: ['assets', ]
    })
  ],
  optimization: {
    splitChunks: {
        cacheGroups: {
          vendor: {
                test: /node_modules/,
                name: "vendor",
                chunks: "initial",
                enforce: true
            }
        }
    }
  }
};
