const path = require("path");

const isProduction = /^prod/.test(process.env.NODE_ENV);

module.exports = {
  entry: path.join(__dirname, "src", "index.ts"),
  mode: isProduction ? "production" : "development",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  optimization: {
    minimize: isProduction,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
