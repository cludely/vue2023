import { mergeOptions } from "../utils/index"
export function initGlobalApi(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    // 对象合并
    this.options = mergeOptions(this.options, mixin)
  }
}