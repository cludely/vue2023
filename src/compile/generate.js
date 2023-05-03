import { defaultTagRE } from "./parseAst"

// 处理属性
function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    // 处理行内样式 
    // {name: 'style', value: 'color: red;font-size: 16px;'}
    // 处理成   style:{"color":" red","font-size":" 16px"}
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, val] = item.split(':')
        obj[key] = val
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

// 处理子节点1
function genChildren(el) {
  let children = el.children
  if (children) {
    return children.map(child => gen(child)).join(',')
  }
}
// 处理子节点2  
function gen(node) {
  if (node.type === 1) { // 元素
    return generate(node)
  } else {  // 文本
    let text = node.text
    // 处理不带插值表达式的文本
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    }
    // 处理带插值表达式的文本
    let tokens = []
    let lastIndex = defaultTagRE.lastIndex = 0
    let match
    while (match = defaultTagRE.exec(text)) {
      let index = match.index
      // 添加内容
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text).slice(lastIndex))
      }
      // 处理插值表达式
      tokens.push(`_s(${match[1].trim()})`)

      lastIndex = index + match[0].length
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}

export function generate(el) {
  let children = genChildren(el)
  let code = `_c(${el.tag},${el.attrs.length ? `${genProps(el.attrs)}` : 'null'},${children ? `${children}` : 'null'})`
  console.log(code)
}