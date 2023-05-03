import { parseHTML } from "./parseAst"
import { generate } from "./generate"


export function compileToFunction(el) {
  // 1、将html解析成AST语法树
  let ast = parseHTML(el)
  console.log("AST语法树===>", ast)
  // 2、将 AST 语法树变成 render 函数
  // 分两步：
  //    第一步：将AST语法树变成字符串
  //    第二补：将字符串变成函数
  let code = generate(ast)
}