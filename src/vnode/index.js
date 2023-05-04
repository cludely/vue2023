export function renderMinxin(Vue) {
  /**
   * 将render函数变成vnode
   */
  Vue.prototype._render = function () {
    let vm = this
    let render = vm.$options.render
    let vnode = render.call(this)
    return vnode
  }

  // 解析标签
  Vue.prototype._c = function() {
    return createElement(...arguments)
  }
  // 解析文本
  Vue.prototype._v = function(text) {
    return createText(text)
  }
  // 解析变量
  Vue.prototype._s = function(val) {
    return val == null ? "" : (typeof val === 'object') ? JSON.stringify(val) : val
  }
}

// 创建元素
function createElement(tag, data = {}, ...children) {
  return vnode(tag, data, data.key, children)
}

// 创建文本
function createText(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
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
function vnode(tag, data, key, children, text) {
  return {
    tag, 
    data, 
    key, 
    children, 
    text
  }
}

