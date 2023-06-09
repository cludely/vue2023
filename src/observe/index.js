import { ArrayMethods } from "./arr";

import Dep from './dep'

/**
 * 将传入的对象转化成响应式对象
 * @param {*} data 
 * @returns 
 */
export function observer(data) {
  if (typeof data != 'object' || data == null) {
    return data;
  }
  return new Observer(data)
}


class Observer {
  constructor(value) {
    // 定义一个不可枚举的属性__ob__,指向当前实例
    Object.defineProperty(value, "__ob__", {
      enumerable: false,
      value: this
    })
    this.dep = new Dep()
    // 判断数据是数组还是对象
    if (Array.isArray(value)) {
      value.__proto__ = ArrayMethods
      // 处理数组对象 [{}, {}, {}...]
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  // 遍历对象中的所有属性
  walk(data) {
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i] // 属性
      let value = data[key] // 值
      defineReactive(data, key, value)
    }
  }

  // 处理数组对象 [{}, {}, {}...]
  observeArray(value) {
    for (let i = 0; i < value.length; i++) {
      observer(value[i])
    }
  }
}

// 对对象中的某个属性进行劫持
function defineReactive(object, key, value) {
  // 1、当属性的值类型为Object时，进行递归
  let childDep = observer(value)
  let dep = new Dep() // 给每一个属性添加一个dep
  // 2、观察劫持这个属性
  Object.defineProperty(object, key, {
    get() {
      // 收集依赖 watcher
      if (Dep.target) {
        dep.depend()
        if (childDep.dep) {
          childDep.dep.depend() // 数组收集
        }
      }
      return value
    },
    set(newValue) {
      if (newValue === value) return;
      // 3、新设置的值也需要重新进行劫持
      observer(newValue)
      value = newValue;
      dep.notify()  // 发送通知，更新页面
    }
  })
}