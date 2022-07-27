import { Configuration, LoaderContext, WebpackPluginInstance, DefinePlugin } from "webpack"
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import merge from "webpack-merge"
import { Service, Inject } from 'ioc-di'
import WebProjectOptions from "project/options"

import baseConfig from "./base.config"
import devConfig from "./dev.config"
import prodConfig from "./prod.config"

@Service()
export default class DefaultConfig {
  @Inject() options!: WebProjectOptions

  private getBaseConfig(): Configuration {
    return merge(baseConfig, {
      output: {
        path: this.options.outPath,
      },
      entry: this.options.entry,
      context: this.options.context
    })
  }

  getDevConfig(): Configuration {
    return merge(this.getBaseConfig(), devConfig, {
      plugins: this.getPlugins('dev')
    })
  }
  getProdConfig(): Configuration {
    return merge(this.getBaseConfig(), prodConfig, {
      plugins: this.getPlugins('prod')
    })
  }
  private getPlugins(type: 'dev' | 'prod') {
    const plugins: WebpackPluginInstance[] = []
    plugins.push(
      new DefinePlugin({
        OPTIONS: JSON.stringify({
          mode: type,
          proxyList: this.options.apiList,
          socketList: this.options.socketList,
          admin: this.options.filename,
          ...this.options.getDefine(type)
        })
      })
    )
    const options = {
      title: this.options.title,
      inject: true,
      baseurl: './api/',
      sockurl: './socket/',
      version: this.options.version,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: false
      },
      scriptLoading: 'blocking',
      chunksSortMode: 'manual',
      ...this.options.getHTMLOptions(type)
    } as const
    plugins.push(
      new HtmlWebpackPlugin({
        filename: this.options.filename,
        template: path.resolve(__dirname, './template/index.html'),
        chunks: type === 'prod' ? ['app'] : ['fetch', 'app'],
        ...options
      })
    )
    if (this.options.hasMobile) {
      plugins.push(
        new HtmlWebpackPlugin({
          filename: 'mobile.html',
          template: path.resolve(__dirname, './template/mobile.html'),
          chunks: type === 'prod' ? ['polyfill', 'mobile'] : ['mobile'],
          ...options
        })
      )
    }
    const htmls = this.options.getHtmls(type)
    if (htmls?.length) {
      for (const html of htmls) {
        plugins.push(
          new HtmlWebpackPlugin({
            ...options,
            template: path.resolve(__dirname, './template/index.html'),
            ...html,
            chunks: type === 'prod' ? ['polyfill'].concat(html.chunks || []) : (html.chunks || []),
          })
        )
      }
    }
    return plugins
  }
}