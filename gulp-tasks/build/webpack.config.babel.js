import _ from 'lodash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import path from 'path';
import config from './config.js';
import { vendor, createResolveAlias } from './../lib';

const {
  DREAM_BREAKER_BUILD_ANALYZE,
} = process.env;

const extractLocal = new ExtractTextPlugin({
  filename: 'stylesheets/local.[contenthash].css',
  allChunks: true,
});

const defineEnviroments = new webpack.EnvironmentPlugin(['NODE_ENV']);
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

const reactLoadable = new ReactLoadablePlugin({
  filename: path.join(__dirname, './../../artifacts/loadable.json'),
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
    app: config.frontEndEntryPoint,
    vendor,
  },
  target: 'web',
  devtool: false,
  output: {
    path: path.join(__dirname, './../../build/public'),
    publicPath: '/public/',
    filename: 'javascripts/[name].[chunkHash].js',
    chunkFilename: 'javascripts/[name].[chunkHash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          forceEnv: 'client_production',
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
          name: 'images/[hash].[ext]',
        },
      },
      {
        test: /\.(otf|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[hash].[ext]',
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
                sourceMap: false,
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
                sourceMap: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
                outputStyle: 'compressed',
              },
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    reactLoadable,
    extractLocal,
    defineEnviroments,
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'javascripts/[name].[chunkHash].js',
      minChunks: (module) => {
        if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false;
        }

        if (!_.isArray(module.context)) {
          return false;
        }

        return module.context.includes('/node_modules/');
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: (module) => {
        if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false;
        }

        if (!_.isArray(module.context)) {
          return false;
        }

        return !module.context.includes('/node_modules/');
      },
    }),
    new DuplicatePackageCheckerPlugin({
      verbose: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new UglifyJsPlugin(),
    new AssetsPlugin({ filename: 'artifacts/assets.json' }),
    /* BundleAnalyzerPlugin */
    ..._.filter(
      [
        DREAM_BREAKER_BUILD_ANALYZE ? new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          generateStatsFile: true,
          reportFilename: path.resolve('./../../artifacts/', 'report.html'),
        }) : undefined,
      ],
      (v) => !_.isNil(v),
    ),
  ],
};
