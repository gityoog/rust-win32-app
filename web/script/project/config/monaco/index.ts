import { Configuration } from "webpack"
import merge from "webpack-merge"
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'

export default class MonacoConfig {
  private getBaseConfig(): Configuration {
    return {
      plugins: [
        new MonacoWebpackPlugin()
      ]
    }
  }

  getDevConfig(): Configuration {
    return merge(this.getBaseConfig(), {
      module: {
        rules: [
          {
            test: /\.js$/,
            include: /node_modules[\\/]monaco-editor/,
            use: [
              {
                loader: 'babel-loader?cacheDirectory',
                options: {
                  presets: [
                    [
                      '@babel/preset-env', { "targets": { chrome: 72 } }
                    ]
                  ]
                }
              }
            ]
          }
        ]
      }
    })
  }
  getProdConfig(): Configuration {
    return merge(this.getBaseConfig(), {})
  }
}