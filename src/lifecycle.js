import { patch } from "./vnode/patch"


export function mountComponent(vm, el) {
  callHook(vm, "beforeMounted")
  // vm._render将render函数变成vnode
  // vm._update将vnode变成真实DOM再放到页面上
  vm._update(vm._render())
  callHook(vm, "mounted")
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


// 生命周期调用
export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(this)  // 改变生命周期中的this指向问题
    }
  }
}