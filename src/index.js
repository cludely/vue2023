import { initMixin } from "./init"

function Vue(options) {
  // 对options初始化
  this._init(options)
}

initMixin(Vue)




export default Vue