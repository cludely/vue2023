import { pushTarget, popTarget } from "./dep"
import { nextTick } from '../utils/nextTick'

let id = 0

/**
 * 观察者
 */
class watcher {
  constructor(vm, updateComponent, cb, options) {
    this.vm = vm
    this.exprOrfn = updateComponent
    this.cb = cb
    this.options = options
    this.id = id++
    this.user = !!options.user
    this.deps = []  // 存放dep, 发布者
    this.depsId = new Set() // 存放depid
    this.lazy = options.lazy  // 如果watcher上有lazy为true,说明是computed的watcher
    this.dirty = this.lazy  // dirty 脏值检查，标识用户是否执行
    // 判断
    if (typeof updateComponent === 'function') {
      this.getter = updateComponent
    } else {
      // watch: { 'a.b.c': function... }
      this.getter = function () {
        let path = updateComponent.split('.')
        let obj = vm
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]]
        }
        return obj
      }
    }
    // 执行渲染页面
    this.value = this.lazy ? void 0 : this.get()  // 保存watch旧值
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
    const value = this.getter.call(this.vm) // 更新页面
    popTarget() // 给dep取消watcher
    return value
  }

  // 更新
  update() {
    if (this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }

  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  /**
   * 相互收集watcher
   */
  depend() {
    // 收集watcher，双向
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  run() {
    let value = this.get()
    let oldValue = this.value
    this.value = value
    if (this.user) {
      this.cb.call(this.vm, value, oldValue)
    }
  }

}

let queue = []  // 将需要更新的watcher暂存在一个列队中
let has = {}
let pending = false

function flushWatcher() {
  queue.forEach(watcher => {
    watcher.run()
  })
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