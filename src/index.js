import { initMixin } from "./init"
import { liftcycleMixin } from "./lifecycle"
import { renderMinxin } from "./vnode/index"

function Vue(options) {
  // 对options初始化
  this._init(options)
}

initMixin(Vue)

liftcycleMixin(Vue)

renderMinxin(Vue)



export default Vue