import watcher from "./watcher"

// dep 与 watcher的关系：一对多，多对多 dep.name = [watcher1,watcher2...]
let id = 0
class Dep {
  constructor() {
    this.subs = []  // 存放watcher
    this.id = id++
  }

  // 收集watcher
  depend() {
    // this.subs.push(Dep.target)
    Dep.target.addDep(this)
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  // 更新watcher
  notify() {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}


// 添加watcher
Dep.target = null
export function pushTarget(watcher) {
  Dep.target = watcher
}

export function popTarget() {
  Dep.target = null
}

export default Dep