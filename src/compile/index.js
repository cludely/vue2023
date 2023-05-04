import { parseHTML } from "./parseAst"
import { generate } from "./generate"

/**
 * 将html解析成render函数
 * @param {*} el 
 */
export function compileToFunction(el) {
  // 1、将html解析成AST语法树
  let ast = parseHTML(el)
  // console.log("AST语法树===>", ast)
  // 2、将AST语法树变成render字符串 
  // _c(div,{id:"app",style:{"color":" red","font-size":" 16px"}},_v("hello {{ mg }}"+_s(mg)))
  // _c解析元素 _v解析文本  _s解析变量
  let code = generate(ast)
  // console.log('render字符串===>', code)
  // 3、将render字符串变成render函数
  let render = new Function(`with(this){return ${code}}`)
  
  return render

}


