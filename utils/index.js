const fs = require('fs')
const p = require('path')
const createSvgSymbol = require('./create-svg-symbol.js')

const db = {
  read(dir) {
    return new Promise((resolve, reject) => {
      fs.readFile(dir, 'utf-8', (error, content) => {
        if (!content) return false
        resolve(content)
      })
    })
  },
  write(dir, result) {
    return new Promise((resolve, reject) => {
      fs.writeFile(dir, result, 'utf8', (error) => {
        if (error) return reject(error)
        resolve()
      })
    })
  }
}

const util = {
  dir(filePath) {
    return new Promise((resolve, reject) => {
      fs.readdir(filePath, (error, fileList) => {
        if (error) return reject(error)
        resolve(fileList)
      })
    })
  },
  isFile(fileDir) {
    return new Promise((resolve, reject) => {
      fs.stat(fileDir, async (error, state) => {
        if (error) return reject(error)
        resolve(state.isFile())
      })
    })
  },
  isDir(fileDir) {
    return new Promise((resolve, reject) => {
      fs.stat(fileDir, async (error, state) => {
        if (error) return reject(error)
        resolve(state.isDirectory())
      })
    })
  },
  createSvg(dir, name) {
    return new Promise((resolve, reject) => {
      fs.readFile(dir, 'utf-8', (error, content) => {
        console.log('content')
        console.log(content)
        const result = createSvgSymbol(content, name)
        if (!result) return false
        resolve(result)
      })
    })
  },
  async accumulate(path, data) {
    const filePath = p.resolve(path)
    const fileList = await util.dir(filePath)
    console.log('\nfileList')
    console.log(fileList + '\n')
    for (let i = 0; i < fileList.length; i++) {
      const fileName = fileList[i]
      const fileDir = p.join(filePath, fileName)
      const isFile = await util.isFile(fileDir)
      const isDir = await util.isDir(fileDir)
      const suffix = p.extname(fileDir)
      if (isFile && suffix && suffix === '.svg') {
        // 传入文件路径、文件名称(不包含后缀)
        const result = await util.createSvg(fileDir, fileName.replace('.svg', ''))
        data += result
      } else if(isDir) {
        data = await this.accumulate(fileDir, data)
      }
    }
    return data
  }
}

async function joinSvg(src) {
  let svg = ''
  const svgList = await util.accumulate(src, svg)
  const svgElement = '<svg>' + svgList + '</svg>'

  // 获取 js 引入 svg 的模板
  const template = await db.read(p.join(p.resolve('utils'), 'template.js'))
  const importJs = template.replace('#__#', svgElement)

  // 将内容导出到 result/import-svg.js
  const resultUrl = p.join(p.resolve('result'), 'import-svg.js')
  await db.write(resultUrl, importJs)
}

module.exports.joinSvg = joinSvg
