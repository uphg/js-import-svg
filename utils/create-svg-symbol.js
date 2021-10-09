const ICON_PREFIX = 'tu-icon'

const rules = {
  SVG_BEFORE: /<svg[^>]+>/,
  SVG_AFTER: /<\/svg>/,
  PATH: /<path[^>]+>.+<\/path[^>]+>/g,
  CONTENT: /(?<=<svg[^>]+>).*(?=<\/svg>)/g, 
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
  const main = content.match(rules.CONTENT)[0]
  let symbol = `<symbol id="${ICON_PREFIX}-${name}" viewBox="${viewBox}">`

  symbol += main.replace(rules.AIR, ' ').replace(rules.AIR_SUFFIX, '').replace(` fill="currentColor">`, '>')
  symbol += `</symbol>`

  return symbol
}

module.exports = createSvgSymbol
