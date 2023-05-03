const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  // 标签名称
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;  // 特殊标签<span:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`);  // 标签开头的正则 <div
const startTagClose = /^\s*(\/?)>/; // 标签结束 >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);// 标签结尾 </div>
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;  // 匹配{{ }}


/**
 * 创建AST语法树
 * @param {*} tag 标签名称
 * @param {*} attrs  标签属性
 * @returns 
 */
function createASTElement(tag, attrs) {
  return {
    tag,  // 元素标签名div
    attrs,  // 属性
    children: [], // 子节点
    type: 1,
    parent: null, // 父元素
  }
}

let root; // 根元素
let createParent; // 当前元素的父元素
let stack = []; // 栈
/**
 * 处理开始标签压栈
 * @param {*} tag 
 * @param {*} attrs 
 */
function start(tag, attrs) {
  let element = createASTElement(tag, attrs)
  if (!root) {
    root = element
  }
  createParent = element
  stack.push(element)
}

/**
 * 处理文本压栈
 * @param {*} text 
 */
function charts(text) {
  text = text.replace(/s/g, '')
  if (text) {
    createParent.children.push({
      type: 3,
      text,
    })
  }
}

/**
 * 处理闭合标签压栈
 * @param {*} tag 
 */
function end(tag) {
  let element = stack.pop()
  createParent = stack[stack.length - 1]
  if (createParent) {
    // 元素闭合
    element.parent = createParent.tag
    createParent.children.push(element)
  }
}



/**
 * 解析HTML eg: <div id="app">hello {{ msg }}</div>
 * @param {*} html 
 * @returns 返回解析完成的AST语法树
 */
export function parseHTML(html) {
  while (html) {
    // 1、解析标签
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 1.1、解析开始标签 <div id="app">
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // 1.2、解析结束标签 </div>
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }

    }
    // 2、解析文本
    let text
    if (textEnd > 0) {
      // 获取文本的内容
      text = html.substring(0, textEnd)
      // console.log("text===>", text) // hello {{ msg }}
    }
    if (text) {
      advance(text.length)
      charts(text)
    }
  }

  /**
   * 解析开始标签 <div id="app">
   * @returns 返回AST语法树
   */
  function parseStartTag() {
    // 1、删除开始标签  <div
    const start = html.match(startTagOpen);
    // console.log("start===>", start) // ['<div', 'div', index: 0, input: '<div id="app">hello {{ msg }}</div>', groups: undefined]
    if (start) {
      advance(start[0].length)
      // 2、创建AST语法树
      let match = {
        tagName: start[1],
        attrs: []
      }
      // 3、解决开始标签中的属性
      let attr
      let end
      // 3.1、当 end 不等于“ > ”且开始标签中含有属性时进行循环
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // console.log("attr===>", attr) // [' id="app"', 'id', '=', 'app', undefined, undefined, index: 0, input: ' id="app">hello {{ msg }}</div>', groups: undefined]
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }
      // 3.2、当循环结束，代表end有值，且必为 > 
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }

  /**
   * 从起始位置删除html的n个字符
   * @param {*} n 要删除的字符个数
   */
  function advance(n) {
    html = html.substring(n)
  }

  return root
}