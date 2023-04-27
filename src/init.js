import { initState } from "./initState"
export function initMixin(Vue) {
  // 将初始化方法添加到Vue实例的原型链上
  Vue.prototype._init = function(options) {
    let vm = this
    vm.$options = options
    // 初始化状态
    initState(vm)
  }
}

