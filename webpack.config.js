const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
const svgToMiniDataURI = require('mini-svg-data-uri')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = (env, argv) => {
  const production = argv.mode !== 'development'
  const { hot } = argv
  return {
    devtool: production ? false : 'eval',
    entry: {
      index: path.resolve(__dirname, 'frontend/src/index.js'),
      app: [
        path.resolve(__dirname, 'frontend/src/resource/sass/app.scss'),
        path.resolve(__dirname, 'frontend/src/resource/css/tinymce.css'),
      ],
    },
    output: {
      filename: '[name].js',
      ...production && { pathinfo: false },
      path: path.resolve(__dirname, 'assets/js/'),
      chunkFilename: production ? '[name].js?v=[contenthash:6]' : '[name].js',
      library: '_frm_in',
      libraryTarget: 'umd',
    },
    target: !production ? 'web' : 'browserslist',
    ...hot && {
      devServer: {
        static: {
          directory: path.join(__dirname, '../assets/js/'),
        },
        // publicPath: 'http://localhost:3000',
        hot: true,
        liveReload: false,
        port: 3000,
        devMiddleware: {
          index: true,
          mimeTypes: { phtml: 'text/html' },
          publicPath: '/publicPathForDevServe',
          serverSideRender: true,
          writeToDisk: true,
        },
        headers: { 'Access-Control-Allow-Origin': '*' },
        allowedHosts: 'all',
      },
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          main: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors-main',
            chunks: chunk => chunk.name === 'index',
          }
        },
      },
      minimize: production,
      minimizer: [
        ...(!production ? [] : [
          new TerserPlugin({
            terserOptions: {
              parse: { ecma: 8 },
              compress: {
                drop_console: production,
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
              },
              mangle: { safari10: true },
            },
            extractComments: {
              condition: true,
              filename: (fileData) => `${fileData.filename}.LICENSE.txt${fileData.query}`,
              banner: (commentsFile) => `license information ${commentsFile}`,
            },
          }),
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              parser: safePostCssParser,
              map: production ? false : { inline: false, annotation: true },
            },
            cssProcessorPluginOptions: { preset: ['default', { minifyFontValues: { removeQuotes: false } }] },
          }),
        ]),
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({ 'process.env': { NODE_ENV: production ? JSON.stringify('production') : JSON.stringify('development') } }),
      new MiniCssExtractPlugin({
        filename: '../css/[name].css?v=[contenthash:6]',
        ignoreOrder: true,
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'frontend/logo.svg'),
            to: path.resolve(__dirname, 'assets/img/logo.svg'),
          },
          // ...filesToCopy,
        ],
      }),
      ...(!hot ? [] : [new ReactRefreshWebpackPlugin({
        overlay: {
          sockIntegration: 'wds',
          sockHost: 'localhost',
          sockPort: 3000,
        },
      })])
    ],

    resolve: { extensions: ['.js', '.jsx', '.json', '.css'] },

    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(jsx?)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          // include: path.resolve(__dirname, 'src'),
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  // useBuiltIns: 'entry',
                  // corejs: 3,
                  targets: {
                    // browsers: ['>0.2%', 'ie >= 9', 'not dead', 'not op_mini all'],
                    browsers: !production ? ['Chrome >= 88'] : ['>0.2%', 'ie >= 11'],
                  },
                  loose: true,
                },
              ],
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              ['@babel/plugin-proposal-private-methods', { loose: true }],
              ['@wordpress/babel-plugin-makepot', { output: path.resolve(__dirname, 'locale.pot') }],
              ...(!hot ? [] : ['react-refresh/babel']),
            ],
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          exclude: /node_modules/,
          use: [
            // 'style-loader',
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: '' },
            },
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    ['autoprefixer'],
                  ],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  ...production && { outputStyle: 'compressed' },
                  ...!production && { sourceMap: false },
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                options: { generator: (content) => svgToMiniDataURI(content.toString()) },
                name: production ? '[name][contenthash:8].[ext]' : '[name].[ext]',
                outputPath: '../img',
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|ttf|woff|woff2|eot)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 3000,
                name: production ? '[name][contenthash:8].[ext]' : '[name].[ext]',
                outputPath: '../img',
              },
            },
          ],
        },
      ],
    },
    externals: {
      '@wordpress/i18n': {
        commonjs: ['wp', 'i18n'],
        commonjs2: ['wp', 'i18n'],
        umd: ['wp', 'i18n'],
        root: ['wp', 'i18n'],
      },
    },
  }
}
