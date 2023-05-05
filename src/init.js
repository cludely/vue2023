import { initState } from "./initState"
import { compileToFunction } from './compile/index'
import { mountComponent, callHook } from './lifecycle'
import { mergeOptions } from './utils/index'

export function initMixin(Vue) {
  // 将初始化方法添加到Vue实例的原型链上
  Vue.prototype._init = function (options) {
    let vm = this
    vm.$options = mergeOptions(Vue.options, options)
    vm._data = options.data
    callHook(vm, 'beforeCreated')
    // 初始化状态
    initState(vm)
    callHook(vm, 'created')
    // 渲染模板
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    let vm = this
    // 获取根元素
    el = document.querySelector(el)
    vm.$el = el
    let options = vm.$options
    // 渲染优先级 render函数 > template > el
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        el = el.outerHTML // 获取html
        // 将html变成render函数
        let render = compileToFunction(el)
        // console.log('render函数===>', render)
        // 将render函数放到实例上
        options.render = render
      }
    }

    // 挂载组件
    mountComponent(vm, el)
  }
}




