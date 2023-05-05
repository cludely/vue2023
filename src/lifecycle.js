import { patch } from "./vnode/patch"


export function mountComponent(vm, el) {
  // vm._render将render函数变成vnode
  // vm._update将vnode变成真实DOM再放到页面上
  vm._update(vm._render())
}

export function liftcycleMixin(Vue) {
  /**
   * 将vnode变成真实DOM再放到页面上
   */
  Vue.prototype._update = function (vnode) {
    // console.log('虚拟节点===>', vnode)
    let vm = this
    vm.$el = patch(vm.$el, vnode)
  }
}