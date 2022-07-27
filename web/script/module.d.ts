
declare module 'sass'
declare module 'webpack-filter-warnings-plugin' {
  import { Compiler } from "webpack"
  class FilterWarningsPlugin {
    constructor(options: { exclude?: RegExp })
    apply(compiler: Compiler): void
  }
  export default FilterWarningsPlugin
}
declare module 'single-line-log'