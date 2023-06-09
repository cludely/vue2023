export function renderMinxin(Vue) {
  /**
   * 将render函数变成vnode
   */
  Vue.prototype._render = function () {
    let vm = this
    let render = vm.$options.render
    // console.log(111, render, vm)  // bug
    let vnode = render.call(this)
    return vnode
  }

  // 解析标签
  Vue.prototype._c = function () {
    return createElement(this, ...arguments)
  }
  // 解析文本
  Vue.prototype._v = function (text) {
    return createText(text)
  }
  // 解析变量
  Vue.prototype._s = function (val) {
    return val == null ? "" : (typeof val === 'object') ? JSON.stringify(val) : val
  }
}

// 创建元素
function createElement(vm, tag, data = {}, ...children) {
  if (isResved(tag)) { // 创建标签
    return vnode(vm, tag, data, data.key, children)
  } else {  // 创建组件
    // 前面global-api中的component方法已将组件放到vue实例上，所以可以获取到自己的组件
    const Ctor = vm.$options['components'][tag]
    return CreateComponent(vm, tag, data, children, Ctor)
  }

}

// 创建组件的虚拟DOM
function CreateComponent(vm, tag, data, children, Ctor) {
  if (typeof Ctor == 'object') {
    Ctor = vm.constructor.extend()  // 返回一个子类
  }

  data.hook = {
    init(vnode) {  // 子组件的初始化
      console.log(vnode)
      let child = vnode.componentInstance = new vnode.componentOptions.Ctor({})
      child.$mount()
    }
  }

  return vnode('vm', 'vue-component' + '-' + tag, data, undefined, undefined, undefined, { Ctor, children })
}

function isResved(tag) {
  return ['a', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'span', 'input'].includes(tag)
}

// 创建文本
function createText(text) {
  return vnode(undefined, undefined, undefined, undefined, undefined, text)
}

/**
 * 创建虚拟DOM
 * @param {*} tag 节点名称
 * @param {*} data 数据
 * @param {*} key 
 * @param {*} children 节点子集
 * @param {*} text 文本
 * @returns 
 */
function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions
  }
}

