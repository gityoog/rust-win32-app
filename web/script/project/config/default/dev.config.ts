import { Configuration } from "webpack"

export default {
  mode: 'development',
  stats: 'none',
  target: ['web', 'es5'],
  infrastructureLogging: {
    level: 'warn'
  },
  entry: {
    fetch: 'whatwg-fetch'
  },
  output: {
    // publicPath: './',
    filename: 'static/js/[name].js',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path => false && /node_modules/.test(path) && !/node_modules[\\/](gojs|ioc-di|bpmn-js|@bpmn-io|debug|color|wrequest)/.test(path),
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
  },
  experiments: {
    lazyCompilation: {
      imports: true,
      entries: false,
      backend: {
        client: require.resolve('./lazy-compilation/client.js')
      }
    }
  }
} as Configuration