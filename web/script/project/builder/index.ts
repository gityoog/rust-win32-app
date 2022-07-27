import { Inject, Service } from "ioc-di"
import DefaultConfig from "project/config/default"
import TypescriptConfig from "project/config/typescript"
import WebProjectOptions from "project/options"

import { webpack, Configuration, Stats } from "webpack"
import ProcessMessage from "../message"
import merge from "webpack-merge"
import fs from 'fs'
import path from 'path'

@Service()
export default class ProjectBuilder {
  @Inject() private defaultConfig!: DefaultConfig
  @Inject() private typescriptConfig!: TypescriptConfig
  @Inject() private options!: WebProjectOptions

  async run(callback?: (data: {
    stats: Stats
    outPath: string
  }) => void) {
    webpack(this.getConfig(), (err, stats) => {
      if (err || !stats) throw err
      if (stats.hasErrors()) {
        ProcessMessage.fail(stats.toString())
      } else {
        fs.writeFileSync(path.resolve(this.options.outPath, `${this.options.version}.info`), stats.toString({
          colors: false
        }).replace(/\n/g, '\r\n'))

        callback?.({
          stats,
          outPath: this.options.outPath
        })

        ProcessMessage.success({
          outPath: this.options.outPath
        })
      }
    })
  }

  private getConfig(): Configuration {
    return merge(this.defaultConfig.getProdConfig(), this.typescriptConfig.getProdConfig(), this.options.getDevExtra())
  }
}