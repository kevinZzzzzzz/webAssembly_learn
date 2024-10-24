// webpack.config.js
module.exports = {
  entry: "./main.js",
  mode: "development",
  output: {
    path: __dirname,
    filename: "bundle.js",
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },
}
