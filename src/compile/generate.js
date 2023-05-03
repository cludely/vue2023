

// 处理属性
function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    // 处理行内样式 
    // {name: 'style', value: 'color: red;font-size: 16px;'}
    // 处理成   style:{"color":" red","font-size":" 16px"}
    if(attr.name === 'style') {
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


export function generate(el) {
  console.log(el)
  let code = `_c(${el.tag},${el.attrs.length ? `${genProps(el.attrs)}` : 'null'})`
  console.log(code)
}