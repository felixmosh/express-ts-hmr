const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { RunScriptWebpackPlugin } = require("run-script-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const { argv } = require("yargs");

const isDevelopment = argv.mode === "development";

module.exports = {
  target: "node",
  entry: [isDevelopment && "webpack/hot/poll?1000", "./src/index.ts"].filter(
    Boolean
  ),
  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: "server.js",
    libraryTarget: "commonjs2",
    hotUpdateChunkFilename: "hot/[id].[fullhash].hot-update.js",
    hotUpdateMainFilename: "hot/[fullhash].hot-update.json",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "@swc-node/loader",
        options: {
          compilerOptions: {
            target: "ES2020",
            module: "commonjs",
            lib: ["ES2020", "dom"],
            experimentalDecorators: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            moduleResolution: "node",
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            forceConsistentCasingInFileNames: true,
          },
        },
      },
    ],
  },
  resolve: {
    symlinks: true,
    extensions: [".ts", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
  node: {
    __dirname: true,
  },
  optimization: {
    nodeEnv: false,
    minimize: false,
  },
  performance: {
    hints: false,
  },
  externals: [nodeExternals({ allowlist: ["webpack/hot/poll?1000"] })], // in order to ignore all modules in node_modules folder
  plugins: [
    new webpack.DefinePlugin({
      "typeof window": JSON.stringify("undefined"),
    }),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment &&
      new RunScriptWebpackPlugin({
        autoRestart: false,
        nodeArgs: [],
        keyboard: true,
        restartable: true,
      }),
    isDevelopment &&
      new webpack.BannerPlugin({
        // https://github.com/evanw/node-source-map-support
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false,
      }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new ForkTsCheckerWebpackPlugin(),
  ].filter(Boolean),
  devtool: isDevelopment ? "inline-cheap-module-source-map" : false,
};
