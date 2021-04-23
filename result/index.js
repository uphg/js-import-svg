const fs = require('fs')
const p = require('path')
const createSvgSymbol = require('./create-svg-symbol.js')
// const filterLog = require('./filter-log.js')

const util = {
  dir (filePath) {
    return new Promise((resolve, reject) => {
      fs.readdir(filePath, (error, fileList) => {
        if (error) return reject(error)
        resolve(fileList)
      })
    })
  },
  read (dir, name) {
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
  isFile(fileDir) {
    return new Promise((resolve, reject) => {
      fs.stat(fileDir, async (error, state) => {
        if (error) return reject(error)
        resolve(state.isFile())
      })
    })
  }
}

async function joinSvg (src) {
  let svg = '<svg>'

  async function gitFilePath (path, svg) {
    const filePath = p.resolve(path)
    const fileList = await util.dir(filePath)
    fileList.forEach(fileName => {

      const fileDir = p.join(filePath, fileName)
      // stat: get file information
      fs.stat(fileDir, async (error, state) => {
        if (error) return console.log(error)

        const isFile = state.isFile()
        // const isDir = state.isDirectory()

        if (isFile) {
          const suffix = p.extname(fileDir) // 获取文件后缀
          if (suffix && suffix === '.svg') {
            const result = await util.read(fileDir,
              fileName.replace('.svg', '')) // 传入文件路径、文件名称(不包含后缀)
            console.log('@ read')
            console.log(result)
            svg += result
            console.log('svg')
            console.log(svg)
            // await util.write(fileDir, result)
          }
        }
        // else if (isDir) {
        //   await gitFilePath(fileDir)
        // }
      })
    })
  }

  await gitFilePath(src, svg)

  svg += '</svg>'
  // console.log('svg')
  // console.log(svg)
}

void joinSvg('icons')

module.exports.joinSvg = joinSvg
