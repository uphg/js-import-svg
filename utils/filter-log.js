const regex = {
  BEFORE: /console\.log\(/,
  BRACKETS: /[()]/
}

function filterLog(content) {
  if(!regex.BEFORE.test(content)) return false
  let finalText = ''
  function setText(content) {
    let finalAfter = ''
    const index = content.search(regex.BEFORE)
    const before = content.slice(0, index)
    const after = content.slice(index + 12)
    const mark = after.match(regex.BRACKETS)
    if (!mark || !mark[0]) return console.log('语法错误，"console.log(" 后缺失 ")"')
    if (mark[0] === ')') {
      finalAfter = markSingle(after)
    } else if (mark[0] === '(') {
      finalAfter = markMany(mark)
    }
    finalText += before
    // not exist console
    if (finalAfter.search(regex.BEFORE) < 0) {
      finalText += finalAfter
      return false
    }
    setText(finalAfter)
  }
  setText(content)
  return finalText
}

// not exist nested parentheses
function markSingle(text) {
  const index = text.search(/\)/)
  return text.slice(index + 1)
}

// exist nested parentheses
function markMany(text) {
  let number = 2
  function saveMark(text) {
    const after = text.input.slice(text.index + 1)
    const mark = after.match(regex.BRACKETS)
    if (!mark || number === 0) return after
    if (mark[0] === ')') {
      number -= 1
    } else if (mark[0] === '(') {
      number += 1
    }
    return saveMark(mark)
  }
  return saveMark(text)
}

module.exports = filterLog
