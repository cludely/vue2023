/**
 * // 将vnode变成真实dom
 * @param {*} oldVnode 旧的DOM
 * @param {*} vnode  新的虚拟节点
 * @returns 
 */
export function patch(oldVnode, vnode) {
  // 第一次渲染时oldVnode是真实DOM
  if (oldVnode.nodeType === 1) {
    // 1、创建新的DOM
    let el = createEl(vnode)
    // 2、替换新旧DOM
    let parentEl = oldVnode.parentNode
    parentEl.insertBefore(el, oldVnode.nextsibling)
    parentEl.removeChild(oldVnode)
    return el
  } else {  // diff算法
    console.log(oldVnode, vnode)  // bug
    // 1、最外层元素标签不一样
    if (oldVnode.tag !== vnode.tag) {
      oldVnode.el.parentNode.replaceChild(createEl(vnode), oldVnode.el)
    }
    // 2、最外层元素标签一样，但text、属性等不一样的情况
    // 2.1、如果只是普通文本
    if (!oldVnode.tag) {
      if (oldVnode.text !== vnode.text) {
        return oldVnode.el.textContent = vnode.text
      }
    }
    // 2.2、处理属性
    let el = vnode.el = oldVnode.el
    updataProps(vnode, oldVnode.data)
    // 2.3、处理子元素
    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []
    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 2.3.1 老节点有子节点，新节点有子节点
      updataChild(oldChildren, newChildren, el)
    } else if (oldChildren.length > 0) {
      // 2.3.2 老节点有子节点，新节点没有子节点
      el.innerHTML = ''
    } else if (newChildren.length > 0) {
      // 2.3.3 老节点没有子节点，新节点有子节点
      for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i]
        // 添加到真实DOM中
        el.appendChild(createEl(child))
      }
    }
  }
}

// diff
function updataChild(oldChildren, newChildren, el) {

}


// 添加属性
function updataProps(vnode, oldProps = {}) {
  let newProps = vnode.data || {}
  let el = vnode.el
  // 1、老节点有属性但新节点没有属性
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }
  // 2、处理样式  老节点  style={color:red} 新节点 style={background: red}
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
  // 3、处理新节点的属性
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps[key]) {
        el.style[styleName] = newProps[key][styleName]
      }
    } else if (key === 'class') {
      el.className = newProps[key]
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}


/**
 * 创建真实DOM
 * @param {*} vnode 
 */
export function createEl(vnode) {
  let { tag, children, key, data, text } = vnode
  if (typeof tag === 'string') { // 标签
    vnode.el = document.createElement(tag)
    updataProps(vnode)
    if (children && children.length > 0) {
      children.forEach(child => {
        vnode.el.appendChild(createEl(child)) // 递归
      });
    }
  } else {  // 文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}