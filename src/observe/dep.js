import watcher from "./watcher"
/**
 * 发布者
 * 作用：搜集依赖，即watcher对象
 */
let id = 0
class Dep {
  constructor() {
    this.subs = []  // 存放所有的观察者watcher
    this.id = id++
  }

  // 收集依赖, watcher
  depend() {
    Dep.target.addDep(this)
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  // 发送通知，更新
  notify() {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}


Dep.target = null
export function pushTarget(watcher) {
  Dep.target = watcher
}

export function popTarget() {
  Dep.target = null
}

export default Dep