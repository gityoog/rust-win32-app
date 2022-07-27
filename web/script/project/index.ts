import WebProjectOptions from "./options"
import { Root, Service, Inject, Concat } from 'ioc-di'
import ProjectBuilder from "./builder"
import ProjectDeveloper from "./developer"

@Root()
@Service()
export default class WebProject {

  @Inject() private developer!: ProjectDeveloper
  @Inject() private builder!: ProjectBuilder
  @Inject() options: WebProjectOptions
  constructor(options: WebProjectOptions) {
    this.options = options
  }
  async dev() {
    return this.developer.run()
  }
  async build(callback?: Parameters<ProjectBuilder['run']>[0]) {
    return this.builder.run(callback)
  }
}

type a<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K]
}