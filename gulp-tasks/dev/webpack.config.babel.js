import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import path from 'path';
import config from './config.js';
import { vendor, createResolveAlias } from './../lib';

const extractLocal = new ExtractTextPlugin({
  filename: 'stylesheets/local.css',
  allChunks: true,
});

const autoprefixerConfig = autoprefixer({
  browsers: [
    'Android 2.3',
    'Android >= 4',
    'Chrome >= 35',
    'Firefox >= 31',
    'Explorer >= 9',
    'iOS >= 7',
    'Opera >= 12',
    'Safari >= 7.1',
  ],
});

const defineEnviroments = new webpack.EnvironmentPlugin([
  'NODE_ENV',
]);

const reactLoadable = new ReactLoadablePlugin({
  filename: path.resolve(__dirname, 'loadable.json'),
});

export default {
  resolve: {
    modules: [
      config.appRoot,
      'node_modules',
    ],
    alias: createResolveAlias(vendor),
  },
  entry: {
    app: [
      'babel-polyfill',
      'webpack-hot-middleware/client?reload=true',
      'webpack/hot/dev-server',
      config.frontEndEntryPoint,
    ],
    vendor,
  },
  cache: true,
  target: 'web',
  devtool: 'eval',
  output: {
    publicPath: config.publicPath,
    filename: 'javascripts/[name].js',
    chunkFilename: 'javascripts/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          forceEnv: 'client_development',
        },
      },
      {
        test: /\.ico$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
        },
      },
      {
        test: /\.(otf|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.scss$/,
        use: extractLocal.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  autoprefixerConfig,
                ],
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    reactLoadable,
    extractLocal,
    defineEnviroments,
  ],
};
