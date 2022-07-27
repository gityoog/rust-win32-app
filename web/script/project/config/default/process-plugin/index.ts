import webpack from 'webpack'
import Logger from './logger'

export default class ProcessPlugin {
  private options: { process: boolean }
  constructor({ process = true }: { process?: boolean } = {}) {
    this.options = {
      process
    }
  }
  private name = 'ProcessPlugin'
  private done = false
  private logger = new Logger()
  apply(compiler: webpack.Compiler) {
    if (this.options.process) {
      new webpack.ProgressPlugin(
        (percent, msg, module) => {
          if (!this.done) {
            this.logger.process(
              (percent * 100).toFixed(0) + '% ' + msg + ' ' + (module || '')
            )
          }
        }
      ).apply(compiler)
    }
    compiler.hooks.compile.tap(this.name, () => {
      this.done = false
      this.logger.status('Building ...')
    })
    compiler.hooks.afterDone.tap(this.name, stats => {
      this.done = true
      if (stats.hasErrors()) {
        this.logger.other(stats.toString({
          all: false,
          errors: true,
          colors: true
        }))
        this.logger.status('Build failed with errors.')
      } else {
        if (stats.hasWarnings()) {
          this.logger.other(stats.toString({
            all: false,
            errors: true,
            warnings: true,
            colors: true
          }))
        }
        this.logger.status('Build success. \nTime: ' + stats.toJson().time + ' ms')
      }
    })
  }
}