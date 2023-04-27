
export function initMixin(Vue) {
  // 初始化方法
  Vue.prototype._init = function(options) {
    console.log(options)
  }
}

