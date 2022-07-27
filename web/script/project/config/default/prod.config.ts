import { Configuration } from "webpack"
import { ESBuildMinifyPlugin } from 'esbuild-loader'

export default {
  mode: 'production',
  target: ['web', 'es5'],
  entry: {
    polyfill: ['core-js/stable', 'regenerator-runtime/runtime']
  },
  performance: {
    maxAssetSize: 10 * 1024 * 1024,
    maxEntrypointSize: 10 * 1024 * 1024
  },
  output: {
    clean: true,
    publicPath: './',
    filename: 'static/js/[name].[fullhash].js',
    globalObject: 'this'
  },
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'ie10',
        include: /static[\\/]js/
      }),
    ]
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        exclude: path => /node_modules/.test(path) && !/node_modules[\\/](gojs|ioc-di|bpmn-js|@bpmn-io|debug|color|wrequest)/.test(path),
        enforce: 'post',
        use: [
          {
            loader: 'babel-loader?cacheDirectory',
            options: {
              presets: [
                ['@babel/preset-env', {
                  "targets": { "ie": 10 }
                }]
              ]
            }
          }
        ]
      }
    ]
  }
} as Configuration