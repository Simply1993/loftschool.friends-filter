const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");
const env = process.env.NODE_ENV;

module.exports = {
  entry: {
    index: "./src/assets/scripts/index.js"
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ["bootloader"]
    })
  ],
  devtool: env === "development" ? "#eval-source-map" : ""
};

if (env === "production") {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      warnings: false
    })
  ]);
}
