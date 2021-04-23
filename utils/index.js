const fs = require('fs')
const p = require('path')
const createSvgSymbol = require('./create-svg-symbol.js')
// const filterLog = require('./filter-log.js')

const db = {
  read(dir) {
    return new Promise((resolve, reject)=>{
      fs.readFile(dir, 'utf-8', (error, content) => {
        if (!content) return false
        resolve(content)
      })
    })
  },
  write (dir, result) {
    return new Promise((resolve, reject) => {
      fs.writeFile(dir, result, 'utf8', (error) => {
        if (error) return reject(error)
        resolve()
      })
    })
  },
}

const util = {
  dir (filePath) {
    return new Promise((resolve, reject) => {
      fs.readdir(filePath, (error, fileList) => {
        if (error) return reject(error)
        resolve(fileList)
      })
    })
  },
  createSvg (dir, name) {
    return new Promise((resolve, reject) => {
      fs.readFile(dir, 'utf-8', (error, content) => {
        const result = createSvgSymbol(content, name)
        if (!result) return false
        resolve(result)
      })
    })
  },
  write (dir, result) {
    return new Promise((resolve, reject) => {
      fs.writeFile(dir, result, 'utf8', (error) => {
        if (error) return reject(error)
        resolve()
      })
    })
  },
  isFile (fileDir) {
    return new Promise((resolve, reject) => {
      fs.stat(fileDir, async (error, state) => {
        if (error) return reject(error)
        resolve(state.isFile())
      })
    })
  }
}

async function joinSvg (src) {


  async function gitFilePath (path) {
    let svg = '<svg>'
    const filePath = p.resolve(path)
    const fileList = await util.dir(filePath)
    console.log('fileList')
    console.log(fileList)
    for (let i = 0; i<fileList.length; i++) {
      const fileName = fileList[i]
      const fileDir = p.join(filePath, fileName)
      const isFile = await util.isFile(fileDir)
      const suffix = p.extname(fileDir)
      if (isFile && suffix && suffix === '.svg') {
        const result = await util.createSvg(fileDir, fileName.replace('.svg', '')) // 传入文件路径、文件名称(不包含后缀)
        console.log('result')
        console.log(result)
        svg += result
      }
    }
    return svg
  }

  const a = await gitFilePath(src) + '</svg>'
  console.log('a')
  console.log(a)

  const template = await db.read(p.join(p.resolve('utils'), 'template.js'))
  console.log('template')
  console.log(template)
  const finallyJs = template.replace('#@@#', a)
  console.log('finallyJs')
  console.log(finallyJs)
  await db.write(p.join(p.resolve('result'), 'import-svg.js'), finallyJs)
}

void joinSvg('icons')

module.exports.joinSvg = joinSvg
