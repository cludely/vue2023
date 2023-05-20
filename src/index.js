import { initMixin } from "./init"
import { liftcycleMixin } from "./lifecycle"
import { renderMinxin } from "./vnode/index"
import { initGlobalApi } from './global-api/index'
import { stateMinxin } from './initState'
import { compileToFunction } from "./compile/index"
import { createEl, patch } from "./vnode/patch"

function Vue(options) {
  // 对options初始化
  this._init(options)
}

initMixin(Vue)

liftcycleMixin(Vue)

renderMinxin(Vue)

stateMinxin(Vue)  // 给 vm 添加 $nextTick


// 初始化全局API
initGlobalApi(Vue)

// 创建vnode
let vm1 = new Vue({
  data: {
    name: '张三'
  }
})

let render1 = compileToFunction(`<ul>
  <li>a</li>
  <li>b</li>
  <li>c</li>
</ul>`)

let vnode1 = render1.call(vm1)
document.body.appendChild(createEl(vnode1))

let vm2 = new Vue({
  data: {
    name: '李四'
  }
})

let render2 = compileToFunction(`<ul>
<li>a</li>
<li>b</li>
<li>c</li>
<li>d</li>
</ul>`)
let vnode2 = render2.call(vm2)
//patch 比对
patch(vnode1, vnode2)

export default Vue