import WebProject from './project'
import Config from './config'
import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'

const type = process.argv[2]
const project = new WebProject(Config)

if (type === 'prod') {
  project.build(({ outPath }) => {
    const zipfile = new AdmZip()
    fs.readdirSync(outPath).forEach(item => {
      if (!item.endsWith('.info')) {
        const file = path.resolve(outPath, item)
        const stat = fs.statSync(file)
        if (stat.isFile()) {
          zipfile.addLocalFile(file)
        } else if (stat.isDirectory()) {
          zipfile.addLocalFolder(file, item)
        }
      }
    })
    zipfile.writeZip(path.resolve(__dirname, '../../res', `web.zip`))
  })
} else {
  project.dev()
}