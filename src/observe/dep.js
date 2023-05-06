import watcher from "./watcher"

// dep 与 watcher的关系：一对多 dep.name = [watcher1,watcher2...]
class Dep {
  constructor() {
    this.subs = []
  }

  // 收集watcher
  depend() {
    this.subs.push()
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