const ICON_PREFIX = 'tu-icon'

const rules = {
  SVG_BEFORE: /<svg[^>]+>/,
  SVG_AFTER: /<\/svg>/,
  PATH: /<path[^>]+\/>/g,
  VIEW_BOX: /(?<=\bviewBox=")[^"]+\b/,
  AIR: /\s{1,}/g, // 将所有换行、回车、多个空格替换为一个空格
  AIR_SUFFIX: /\s+(?=\/\>)/g // 将所有 “/>” 后缀前的空格去掉
}

const re = {
  get (rule, text) {
    const result = rule.exec(text)
    return result[0]
  }
}

function createSvgSymbol (content, name) {
  const svgBefore = re.get(rules.SVG_BEFORE, content)
  const viewBox = re.get(rules.VIEW_BOX, svgBefore)
  const pathLabels = content.match(rules.PATH)

  let symbol = `<symbol id="${ICON_PREFIX}-${name}" viewBox="${viewBox}">`
  pathLabels.forEach(pathLabel => {
    symbol += pathLabel.replace(rules.AIR, ' ').replace(rules.AIR_SUFFIX, '')
  })
  symbol += '</symbol>'

  return symbol
}

module.exports = createSvgSymbol
