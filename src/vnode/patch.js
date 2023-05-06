/**
 * // 将vnode变成真实dom
 * @param {*} oldVnode 旧的DOM
 * @param {*} vnode  新的虚拟节点
 * @returns 
 */
export function patch(oldVnode, vnode) {
  // 1、创建新的DOM
  let el = createEl(vnode)
  // 2、替换新旧DOM
  let parentEl = oldVnode.parentNode
  parentEl.insertBefore(el, oldVnode.nextsibling)
  parentEl.removeChild(oldVnode)
  return el
}


/**
 * 创建真实DOM
 * @param {*} vnode 
 */
function createEl(vnode) {
  let { tag, children, key, data, text } = vnode
  if (typeof tag === 'string') { // 标签
    vnode.el = document.createElement(tag)
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