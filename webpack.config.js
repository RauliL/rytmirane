const path = require("path");

const isProduction = /^prod/.test(process.env.NODE_ENV);

module.exports = {
  entry: path.join(__dirname, "src", "index.tsx"),
  mode: isProduction ? "production" : "development",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  optimization: {
    minimize: isProduction,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
