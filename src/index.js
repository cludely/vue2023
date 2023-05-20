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

export default Vue