const path = require("path")
// webpack.config.js
module.exports = {
  entry: "./main.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },
}
