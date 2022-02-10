/* eslint-disable no-underscore-dangle */
/* eslint-disable no-template-curly-in-string */
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { createRequire } from "module";
import webpack from "webpack";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

export default (env, _) => {
  const isDevelopment = env.mode === "development";
  // const isProduction = env.mode === "production";
  const isNotDevelopment = env.mode === "production" || env.mode === "dev_prod";
  return {
    mode: isNotDevelopment ? "production" : "development",
    devtool: isNotDevelopment ? false : "eval-source-map",
    entry: {
      main: path.join(__dirname, "src", "index.tsx"),
    },
    output: {
      path: path.join(__dirname, "dist"),
      clean: true,
      filename: "js/[name].js",
      publicPath: isNotDevelopment ? "https://IGameInstaller.web/" : "/",
    },
    performance: {
      maxEntrypointSize: 1 * 1024 * 1024,
      maxAssetSize: 256 * 1024,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".wasm"],
      alias: {
        "@": path.join(__dirname, "src"),
        "@public": path.join(__dirname, "public"),
      },
      fallback: {
        assert: require.resolve("assert/"),
      },
    },
    module: {
      rules: [
        // 图片文件
        {
          test: /\.(png|svg|jpg|jpeg|webp|gif)$/,
          // see https://webpack.js.org/guides/asset-modules/#general-asset-type
          type: "asset",
          generator: {
            filename: "images/[name][ext]",
          },
        },
        // 字体文件
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: "asset",
          generator: {
            filename: "fonts/[name][ext]",
          },
        },
        // 处理css文件
        {
          test: /\.css$/,
          use: [
            isNotDevelopment && {
              loader: MiniCssExtractPlugin.loader,
            },
            isDevelopment && {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
          ].filter(Boolean),
        },
        // 处理js|jsx|ts|tsx文件
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            plugins: [
              [
                "babel-plugin-transform-imports",
                {
                  "@mui/material": {
                    transform: "@mui/material/${member}",
                    preventFullImport: true,
                  },
                  "@mui/material/colors": {
                    transform: "@mui/material/colors/${member}",
                    preventFullImport: true,
                  },
                  "@mui/icons-material": {
                    transform: "@mui/icons-material/${member}",
                    preventFullImport: true,
                  },
                  "@mui/lab": {
                    transform: "@mui/lab/${member}",
                    preventFullImport: true,
                  },
                  lodash: {
                    transform: "lodash/${member}",
                    preventFullImport: true,
                  },
                },
              ],
              isDevelopment && "react-refresh/babel",
            ].filter(Boolean),
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: "defaults",
                  useBuiltIns: "usage",
                  corejs: {
                    version: 3,
                    proposals: true,
                  },
                },
              ],
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                },
              ],
              [
                "@babel/preset-typescript",
                {
                  optimizeConstEnums: true,
                },
              ],
            ],
          },
        },
      ],
    },
    optimization: isDevelopment
      ? {}
      : {
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                format: {
                  comments: false,
                },
              },
              parallel: true,
              extractComments: false,
            }),
            new CssMinimizerPlugin({
              minimizerOptions: {
                preset: [
                  "default",
                  {
                    discardComments: { removeAll: true },
                  },
                ],
              },
            }),
          ],
        },
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
      new HtmlWebpackPlugin({
        publicPath: isNotDevelopment ? "https://IGameInstaller.web/" : "/",
        inject: false,
        template: path.join(__dirname, "src", "index.ejs"),
      }),
      new FaviconsWebpackPlugin({
        logo: path.join(__dirname, "public", "logo.svg"),
        prefix: "icons/",
        mode: "webapp",
        devMode: "light",
        cache: true,
        inject: true,
        favicons: {
          icons: {
            android: false,
            appleIcon: false,
            appleStartup: false,
            coast: false,
            favicons: true,
            firefox: false,
            windows: false,
            yandex: false,
          },
        },
      }),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      isNotDevelopment &&
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: path.join(__dirname, "report.html"),
          openAnalyzer: true,
        }),
      isNotDevelopment &&
        new MiniCssExtractPlugin({
          filename: "css/[name].css",
        }),
    ].filter(Boolean),
    devServer: isDevelopment
      ? {
          compress: true,
          open: false,
          hot: true,
          port: 8500,
          historyApiFallback: true,
        }
      : {},
  };
};
