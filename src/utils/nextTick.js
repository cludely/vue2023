/**
 * 当用户修改数据，并调用 vm.$nextTick(fn) 后
 * 1. 用户修改数据时，触发更新watcher，向 nextTick 中的 callback 传入一个更新渲染的函数 flushWatcher
 * 2. 用户调用 vm.$nextTick(fn), 又向 nextTick 中的 callback 传入第二个用户函数
 * 3. 当同步代码执行完毕后，开始执行异步代码，此时nextTick中的 callback 有两个函数待执行
 * 所以nextTick是先调用了一次更新页面的函数 flushWatcher，再执行用户函数，所以用户可以立即获取到最新的DOM
 */
let callback = []
let pending = false

function flush() {
  callback.forEach(cb => cb())
  pending = false
}

let timerFunc
// 处理兼容问题
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flush)
  }
} else if (MutationObserver) { // H5 异步API
  let observe = new MutationObserver(flush)
  let textNode = document.createTextNode(1) // 创建文本
  observe.observe(textNode, { characterData: true })  // 观测文本的内容
  timerFunc = () => {
    textNode.textContent = 2
  }
} else if (setImmediate) { // IE支持
  timerFunc = () => {
    setImmediate(flush)
  }
}



export function nextTick(cb) {
  callback.push(cb)
  if (!pending) {
    timerFunc() // 异步方法
    pending = true
  }
}