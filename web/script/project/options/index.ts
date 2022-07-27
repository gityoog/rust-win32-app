import { Service } from 'ioc-di'
import { Configuration } from 'webpack'
import merge from 'webpack-merge'

interface module {
  getDevConfig(): Configuration
  getProdConfig(): Configuration
}

@Service()
export default class WebProjectOptions {
  title
  outPath
  devPort
  context
  filename: string
  entry: Record<string, string>
  hasMobile = false
  socket
  apiList: string[]
  socketList: string[]
  version: string
  define
  html?: {
    base?: Record<string, any>
    prod?: Record<string, any>
    dev?: Record<string, any>
  }
  htmls?: {
    base?: Record<string, any>
    prod?: Record<string, any>
    dev?: Record<string, any>
  }[]
  extra?: {
    base?: Configuration
    prod?: Configuration
    dev?: Configuration
  }
  modules?: module[]
  constructor({ title, outPath, devPort = 3000, context, app = './index.ts', mobile, api, socket, html, htmls, extra, modules, entry, filename = 'index.html', define }: {
    title: string
    outPath: string
    context: string
    mobile?: string
    app?: string
    devPort?: number
    api: string | string[]
    socket?: string | string[]
    html?: {
      base?: Record<string, any>
      prod?: Record<string, any>
      dev?: Record<string, any>
    }
    extra?: {
      base?: Configuration
      prod?: Configuration
      dev?: Configuration
    }
    htmls?: {
      base?: Record<string, any>
      prod?: Record<string, any>
      dev?: Record<string, any>
    }[]
    entry?: Record<string, string>
    modules?: module[]
    filename?: string
    define?: {
      base?: Record<string, any>
      prod?: Record<string, any>
      dev?: Record<string, any>
    }
  }) {
    this.title = title
    this.outPath = outPath
    this.devPort = devPort
    this.context = context
    this.socket = socket
    this.filename = filename
    this.define = define
    this.apiList = Array.isArray(api) ? api : [api]
    this.socketList = Array.isArray(socket) ? socket : socket ? [socket] : []
    this.entry = {
      app,
      ...entry
    }
    this.html = html
    this.htmls = htmls
    this.extra = extra
    this.modules = modules
    if (mobile) {
      this.hasMobile = true
      this.entry.mobile = mobile
    }
    const date = new Date()
    this.version = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`
  }
  getSocket() {
    return this.socketList[0] || 'ws://localhost'
  }
  getApi() {
    return this.apiList[0]
  }
  getHtmls(type: 'dev' | 'prod') {
    return this.htmls?.map(item => {
      return {
        ...item.base,
        ...item[type]
      }
    })
  }
  getHTMLOptions(type: 'dev' | 'prod') {
    return {
      ...this.html?.base,
      ...this.html?.[type]
    }
  }
  getDevExtra() {
    return merge(this.modules?.reduce((c, item) => merge(c, item.getDevConfig()), {} as Configuration) || {}, this.extra?.base || {}, this.extra?.dev || {})
  }
  getProdExtra() {
    return merge(this.modules?.reduce((c, item) => merge(c, item.getProdConfig()), {} as Configuration) || {}, this.extra?.base || {}, this.extra?.prod || {})
  }
  getDefine(type: 'dev' | 'prod') {
    return {
      ...this.define?.base,
      ...this.define?.[type]
    }
  }
}