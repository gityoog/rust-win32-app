import logUpdate from 'log-update'
import { stdout } from 'single-line-log'

export default class Logger {
  _status = ''
  _process = ''
  _other = ''
  mode = 'update'
  private update() {
    logUpdate(
      [this._status, this._process, this._other].filter(Boolean).join('\n')
    )
  }
  status(status: string) {
    if (this.mode === 'normal') {
      console.log(status + '\n')
    } else {
      this._status = status
      this.update()
    }
  }
  process(process: string) {
    if (this.mode === 'normal') {
      stdout(process)
    } else {
      this._process = process
      this.update()
    }
  }
  other(other: string) {
    if (this.mode === 'normal') {
      console.log(other + '\n')
    } else {
      this._other = other
      this.update()
    }
  }
}