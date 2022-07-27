import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import path from 'path'
import { Compiler } from 'webpack'

type options = {
  configFile?: string
}

class TsconfigPathsWebpackContextPlugin {
  options: options
  constructor(rawOptions: options = {}) {
    this.options = rawOptions
  }
  apply(compiler: Compiler) {
    compiler.hooks.afterPlugins.tap('TsconfigPathsWebpackContextPlugin', (compiler) => {
      const tsconfigPathsPlugin = new TsconfigPathsPlugin({
        ...this.options,
        configFile: this.options.configFile || path.resolve(compiler.options.context, './tsconfig.json')
      })

      compiler.options.resolve.plugins = (compiler.options.resolve.plugins || []).concat(tsconfigPathsPlugin)
    })
  }
}

export default TsconfigPathsWebpackContextPlugin