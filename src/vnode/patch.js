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
    // console.log(oldVnode, vnode)  // bug
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
function updataChild(oldChildren, newChildren, parent) {
  // 1、创建双指针
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[oldStartIndex];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChildren[newStartIndex];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  // 判断是否时同一个元素
  function isSameVnode(node1, node2) {
    return node1.tag === node2.tag && node1.key === node2.key
  }
  // 创建旧元素映射表
  function makeIndexByKey(nodeList) {
    let map = {}
    nodeList.forEach((item, index) => {
      if (item.key) {
        map[item.key] = index
      }
    })
    return map
  }

  let map = makeIndexByKey(oldChildren)
  // console.log('map===>', map)
  // 2、遍历
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 2.1 比对子元素
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode) //  递归
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else {
      // 2.2、暴力比对
      // 2.2.1、创建旧元素映射表
      // 2.2.2、从老节点中寻找可复用的元素
      let moveIndex = map[newStartVnode.key]
      if (moveIndex == undefined) {
        parent.insertBefore(createEl(newStartVnode), oldStartVnode.el)
      } else {
        let moveVnode = oldChildren[moveIndex]  // 获取到要移动的元素
        oldChildren[moveIndex] = null // 防止数组塌陷
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
        // 移动的元素可能有子节点
        patch(moveVnode, newStartVnode)
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  // 3、添加新增的节点
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      parent.appendChild(createEl(newChildren[i]))
    }
  }
  // 4、去掉旧节点中多余的元素
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i]
      if (child != null) {
        parent.removeChild(child.el)
      }
    }
  }
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