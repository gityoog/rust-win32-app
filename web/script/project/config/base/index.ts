import { Configuration } from "webpack"
import merge from "webpack-merge"

export default abstract class BaseConfig {
  abstract base: Configuration
  abstract dev: Configuration
  abstract prod: Configuration

  getDevConfig() {
    return merge(this.base, this.dev)
  }

  getProdConfig() {
    return merge(this.base, this.prod)
  }
}