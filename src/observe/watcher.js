import { pushTarget, popTarget } from "./dep"
import { nextTick } from '../utils/nextTick'

// 通过这个watcher 实现更新
let id = 0
class watcher {
  constructor(vm, updateComponent, cb, options) {
    // (1)
    this.vm = vm
    this.exprOrfn = updateComponent
    this.cb = cb
    this.options = options
    this.id = id++
    this.deps = []  // 存放dep
    this.depsId = new Set() // 存放depid
    // 判断
    if (typeof updateComponent === 'function') {
      this.getter = updateComponent
    }
    this.get()
  }

  // 添加dep
  addDep(dep) {
    // 1.去重
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }

  // 用来初次渲染
  get() {
    pushTarget(this)  // 给dep添加watcher
    this.getter() // 更新页面
    popTarget() // 给dep取消watcher
  }

  // 更新
  update() {
    // this.get()
    // 异步
    queueWatcher(this)
  }

  run() {
    this.get()
  }
}

let queue = []  // 将需要更新的watcher暂存在一个列队中
let has = {}
let pending = false

function flushWatcher() {
  queue.forEach(watcher => watcher.run())
  queue = []
  has = {}
  pending = false
}

function queueWatcher(watcher) {
  let id = watcher.id
  if (has[id] == null) { //去重
    queue.push(watcher)
    has[id] = true
    // 防抖,防止用户触发多次更新
    if (!pending) {
      /**
       * 当用户修改数据，并调用 vm.$nextTick(fn) 后
       * 1. 用户修改数据时，触发更新watcher，向 nextTick 中传入一个更新渲染的函数 flushWatcher
       * 2. 用户调用 vm.$nextTick(fn), 又向 nextTick 中传入第二个用户函数
       * 3. 当同步代码执行完毕后，开始执行异步代码，此时nextTick中有两个函数待执行
       * 所以nextTick是先调用了一次更新页面的函数 flushWatcher，再执行用户函数，所以用户可以立即获取到最新的DOM
       */
      nextTick(flushWatcher)
    }
    pending = true
  }
}



export default watcher