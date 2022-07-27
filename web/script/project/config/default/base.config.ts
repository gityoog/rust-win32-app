import { Configuration, LoaderContext } from "webpack"
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ProcessPlugin from "./process-plugin"
import path from 'path'

export default {
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        resourceQuery: /raw$/,
        type: 'asset/source',
      },
      {
        test: /\.svg$/,
        issuer: /\.(s)?css/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/fonts/[name].[hash:7][ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/fonts/[name].[hash:7][ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/images/[name].[hash:7][ext]'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: (path: string) => /\.module\.(sa|sc|c)ss$/.test(path),
                getLocalIdent(loaderContext: LoaderContext<null>, _: string, localName: string) {
                  return `${localName}--${loaderContext._module!.debugId}`
                },
                localIdentName: '[local]--[hash]'
              }
            }
          }
        ]
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass")
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './template/static'),
          to: 'static'
        }
      ]
    }),
    new ProcessPlugin({ process: true })
  ]
} as Configuration