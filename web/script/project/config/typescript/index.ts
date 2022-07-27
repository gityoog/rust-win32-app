import { Configuration } from "webpack"
import BaseConfig from "../base"
import FilterWarningsPlugin from 'webpack-filter-warnings-plugin'
import TsconfigPathsWebpackContextPlugin from "./tsconfig-paths-webpack-context-plugin"
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"

export default class TypescriptConfig extends BaseConfig {
  base: Configuration = {
    resolve: {
      extensions: ['.tsx', '.ts']
    },
    module: {
      rules: [
        {
          test: /\.tsx$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@vue/jsx',
                    {
                      injectH: false,
                      vModel: false
                    }
                  ]
                ],
                plugins: [
                  require.resolve('./jsx-loader/injectH.js'),
                  require.resolve('./jsx-loader/vModel.js')
                ]
              }
            }
          ]
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true, // 禁用 type checking
                appendTsSuffixTo: [/\.vue$/]
              }
            }
          ]
        },
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          issuer: /\.tsx?$/,
          use: [
            require.resolve('./vue-svg-loader'),
            'svg-sprite-loader',
            {
              loader: 'svgo-loader',
              options: {
                plugins: [{
                  name: "removeAttrs",
                  params: {
                    attrs: "(fill|stroke)"
                  }
                }]
              }
            }
          ]
        }
      ]
    },
    ignoreWarnings: [/export .* was not found in/],
    plugins: [
      new TsconfigPathsWebpackContextPlugin(),
      // new FilterWarningsPlugin({
      //   exclude: /export .* was not found in/
      // })
    ]
  }
  dev: Configuration = {
    module: {
      rules: [{
        test: /\.tsx$/,
        loader: require.resolve('./jsx-loader/hot-reload.js')
      }]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({

      })
    ]
  }
  prod: Configuration = {

  }
}