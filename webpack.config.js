import path from 'path';
import externals from './webpack/externals';
import {middleware} from './server/middleware';
import webpack from 'webpack';
import merge from 'webpack-merge';
import StatsPlugin from 'stats-webpack-plugin';
import define from './webpack/define';
import tsLoader from './webpack/ts-loader';
import servePlugin from './webpack/serve';
import cssLoader from './webpack/cssLoader';
import miniCssPlugin from './webpack/minicss';
import {WebpackPluginServe as Serve} from 'webpack-plugin-serve';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';

const modes = {
  HOTRELOAD: 'hotreload',
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
};

const res = (p) => path.resolve(__dirname, p);
const optimize = process.env.NODE_ENV === modes.PRODUCTION;
const mode = optimize ? modes.PRODUCTION : modes.DEVELOPMENT;

// конфиг общий для всех
const common = merge(
  {
    mode,
    watch: !optimize,
    entry: ['fetch-everywhere'],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
    },
    devtool: 'source-map',
    plugins: [new ForkTsCheckerWebpackPlugin()],
  },
  define(mode),
  tsLoader()
);

// основной мульти-конфиг, но не полноценный
const baseConfig = {
  client: merge.smart(
    common,
    // styleLoader(), // использовать этот вместо экстрактора, если не работает hot reload
    miniCssPlugin(optimize),
    cssLoader(),
    {
      name: 'client',
      target: 'web',
      entry: [res('./src/index.tsx')],
      output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: res('./out/buildClient'),
        publicPath: '/static/',
      },
      optimization: {
        runtimeChunk: {
          name: 'bootstrap',
        },
        splitChunks: {
          chunks: 'initial',
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-redux|redux|history|transition-group|redux-first-router|redux-first-router-link|fetch-everywhere|babel-polyfill)[\\/]/,
              name: 'vendor',
            },
          },
        },
      },
      plugins: [
        new CleanWebpackPlugin(),
        new StatsPlugin('../buildServer/stats.json'),
        new CopyPlugin({
          patterns: [
            {
              from: res('static/favicon.ico'),
            },
          ],
        }),
      ],
    }
  ),
  server: merge.smart(
    common,
    externals(res('./node_modules')),
    cssLoader('css-loader/locals'),
    {
      name: 'server',
      target: 'node',
      entry: [res('./server/render.tsx')],
      output: {
        filename: 'serverRender.js',
        libraryTarget: 'commonjs2',
        path: res('./out/buildServer'),
      },
      plugins: [
        new CleanWebpackPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
      ],
    }
  ),
};

const serverDevelopment = {
  client: {
    plugins: [
      new WebpackShellPluginNext({
        onBuildEnd: {
          scripts: ['echo "onBuildEnd Client"'],
          blocking: false,
          parallel: true,
        },
      }),
    ],
  },
  server: {
    plugins: [
      new WebpackShellPluginNext({
        onBuildEnd: {
          scripts: ['echo "onBuildEnd Server"'],
          blocking: false,
          parallel: true,
        },
      }),
    ],
  },
};

// мульти-конфиг для разработки
function getDevelopmentConfig() {
  const serve = new Serve({
    port: 3000,
    static: ['out/buildClient'],
    waitForBuild: true,
    middleware, // здесь находятся мидлвари сервера
    client: {
      retry: true, // этот параметр переподключает вебсокет
    },
  });

  return {
    client: merge(
      {
        entry: ['webpack-plugin-serve/client'],
        devtool: 'source-map',
      },
      servePlugin(serve)
    ),
    server: merge(
      {
        devtool: 'source-map',
      },
      servePlugin(serve)
    ),
  };
}

// мульти-конфиг для релиза
const productionConfig = {
  client: {
    devtool: false,
    output: {
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].js',
    },
  },
  server: {
    devtool: false,
    output: {
      filename: 'serverRender.js',
    },
    plugins: [new webpack.HashedModuleIdsPlugin()],
  },
};

/**
 * Выбор конфига в зависимости от NODE_ENV
 */
function getModeConfig() {
  let config;
  switch (process.env.NODE_ENV) {
    case modes.PRODUCTION:
      config = productionConfig;
      break;
    case modes.DEVELOPMENT:
      config = serverDevelopment;
      break;
    case modes.HOTRELOAD:
    default:
      config = getDevelopmentConfig();
      break;
  }

  return config;
}

module.exports = merge.multiple(baseConfig, getModeConfig());
