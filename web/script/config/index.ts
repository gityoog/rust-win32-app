import path from 'path'
import WebProjectOptions from "project/options"

export default new WebProjectOptions({
  title: 'drag-demo',
  outPath: path.resolve(__dirname, '../../dist'),
  context: path.resolve(__dirname, '../../src'),
  app: 'index.ts',
  api: 'http://127.0.0.1:3000/',
  devPort: 10010
})