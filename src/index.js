import { initMixin } from "./init"
import { liftcycleMixin } from "./lifecycle"
import { renderMinxin } from "./vnode/index"
import { initGlobalApi } from './global-api/index'

function Vue(options) {
  // 对options初始化
  this._init(options)
}

initMixin(Vue)

liftcycleMixin(Vue)

renderMinxin(Vue)


// 初始化全局API
initGlobalApi(Vue)


export default Vue