const path = require('path');
const autoprefixer = require('autoprefixer');
const _ = require('lodash');

const autoprefixerConfig = autoprefixer({
  browsers: [
    'Android >= 5',
    'Explorer >= 10',
    'iOS >= 10',
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
      test: /\.(svg|png|jpg|jpeg|gif)$/,
      loader: 'file-loader',
      options: {
        name: 'images/[name].[ext]',
      },
    },
    {
      test: /\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
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
