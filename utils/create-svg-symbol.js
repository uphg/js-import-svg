const rules = {
  SVG_BEFORE: /<svg[^>]+>/,
  SVG_AFTER: /<\/svg>/,
  PATH: /<path[^>]+\/>/g,
  VIEW_BOX: /(?<=\bviewBox=")[^"]+\b/
}

const re = {
  get (rule, text) {
    const result = rule.exec(text)
    return result[0]
  },
  getters (rule, text) {
    const result = rule.exec(text)
    return result
  },
  before (rule, text) {
    const index = text.search(rule)
    return text.slice(0, index)
  },
  after (rule, text) {
    const index = text.search(rule)
    const base = this.get(rule, text)
    return text.slice(index + base.length)
  }
}

function createSvgSymbol (content, name) {
  const svgBefore = re.get(rules.SVG_BEFORE, content)
  const viewBox = re.get(rules.VIEW_BOX, svgBefore)
  const pathLabels = content.match(rules.PATH)

  let symbol = `<symbol id="icon-${name}" viewBox="${viewBox}">`
  pathLabels.forEach(pathLabel => {
    symbol += pathLabel
  })
  symbol += '</symbol>'

  return symbol
}

module.exports = createSvgSymbol
