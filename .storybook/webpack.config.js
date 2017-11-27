const path = require('path');
const autoprefixer = require('autoprefixer');
const _ = require('lodash');

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

function createAlias(modules) {
  return _.reduce(modules, (c, v) => {
    c[v] = path.resolve(__dirname, './../node_modules', v);
    return c;
  }, {});
}

module.exports = (config) => {
  const {
    STORY_UI_COMPONENT_SERVER_HOST,
    STORY_UI_COMPONENT_SERVER_PORT,
  } = process.env;

  const host = STORY_UI_COMPONENT_SERVER_HOST || 'localhost';
  const port = STORY_UI_COMPONENT_SERVER_PORT || '7777';

  config.output.publicPath = `http://${host}:${port}/`;
  config.resolve = {
    alias: createAlias(['react']),
  };

  config.module.rules = _.concat(config.module.rules, [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /(node_modules)/,
    },
    {
      test: /\.(otf|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader',
      options: {
        name: 'static/fonts/[hash].[ext]',
      },
    },
    {
      test: /\.pdf$/,
      loader: 'file-loader',
      options: {
        name: 'static/pdf/[name].[ext]',
      },
    },
    {
      test: /\.csv$/,
      loader: 'file-loader',
      options: {
        name: 'static/csv/[name].[ext]',
      },
    },
    {
      test: /pdf\.worker\.min\.js/,
      loader: 'file-loader',
      options: {
        name: 'static/[name].[ext]',
      },
    },
    {
      test: /\.(svg|png|jpg|jpeg|gif)$/,
      loader: 'file-loader',
      options: {
        name: 'images/[name].[ext]',
      },
    },
    {
      test: /\.local\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            modules: true,
            localIdentName: '[name]_[local]_[hash:base64:5]',
          },
        },
        {
          loader: 'postcss-loader',
          options: {
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
    },
    {
      test: /\.local\.nohash\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
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
    },
    {
      test: /\.global\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
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
    },
  ]);

  return config;
};
