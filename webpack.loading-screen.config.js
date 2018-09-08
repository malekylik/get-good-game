const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/UI/LoadingScreen/index.js',
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
        { from: '/', to: '/loading-screen.html' },
      ]
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/UI/LoadingScreen/loading-screen.html',
      filename: 'loading-screen.html',
    }),
    new CleanWebpackPlugin(['dist'], {
      verbose: false,
      exclude: ['assets',]
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
