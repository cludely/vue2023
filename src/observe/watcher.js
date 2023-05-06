import { pushTarget, popTarget } from "./dep"


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
    // 判断
    if(typeof updateComponent === 'function') {
      this.getter = updateComponent
    }
    this.get()
  }
  // 用来初次渲染
  get() {
    pushTarget(this)  // 给dep添加watcher
    this.getter() // 更新页面
    popTarget() // 给dep取消watcher
  }

  // 更新
  update() {
    this.get()
  }
}


export default watcher