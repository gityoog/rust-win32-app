import { Inject, Service } from "ioc-di"
import DefaultConfig from "project/config/default"
import TypescriptConfig from "project/config/typescript"
import WebProjectOptions from "project/options"

import portfinder from "portfinder"
import { webpack, Configuration } from "webpack"
import WebpackDevServer from "webpack-dev-server"
import ProcessMessage from "../message"
import merge from "webpack-merge"

@Service()
export default class ProjectDeveloper {
  @Inject() private defaultConfig!: DefaultConfig
  @Inject() private typescriptConfig!: TypescriptConfig
  @Inject() private options!: WebProjectOptions

  async run() {
    const port = await portfinder.getPortPromise({
      port: this.options.devPort
    })
    const compiler = webpack(this.getConifg())

    new WebpackDevServer({
      host: '0.0.0.0',
      port,
      hot: true,
      liveReload: false,
      allowedHosts: "all",
      compress: true,
      client: {
        logging: "warn",
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      },
      proxy: {
        '/api': {
          target: this.options.getApi(),
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
          onProxyReq: function (proxyReq, req) {
            if (!proxyReq.headersSent) {
              proxyReq.setHeader('x-sourceurl', 'http://' + req.headers['host']
                // @ts-ignore
                + req._parsedUrl.pathname)
            }
          },
          router: req => {
            if (req.headers && req.headers.cookie) {
              const regx = new RegExp(`proxyurl${port}=(.*?)(;|$)`, "i")
              const result = regx.exec(req.headers.cookie)
              if (result && result[1]) {
                return result[1]
              }
            }
            return this.options.getApi()
          }
        },
        '/socket': {
          target: this.options.getSocket(),
          pathRewrite: { '^/socket': '' },
          ws: true,
          router: req => {
            if (req.headers && req.headers.cookie) {
              const regx = new RegExp(`socketurl${port}=(.*?)(;|$)`, "i")
              const result = regx.exec(req.headers.cookie)
              if (result && result[1]) {
                return result[1]
              }
            }
            return this.options.getSocket()
          }
        },
        '/lazyCompilation': {
          target: 'http://localhost',
          pathRewrite: () => "",
          router: function (req) {
            return decodeURIComponent(
              // @ts-ignore
              req._parsedUrl.query
            )
          }
        }
      }
    }, compiler).startCallback(err => {
      if (!err) {
        ProcessMessage.success({
          host: '0.0.0.0',
          port
        })
      }
    })
  }

  private getConifg(): Configuration {
    return merge(this.defaultConfig.getDevConfig(), this.typescriptConfig.getDevConfig(), this.options.getDevExtra())
  }
}