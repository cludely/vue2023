/**
 * 响应式原理
 */

export function observer(data) {
  if(typeof data != 'object' || data == null) {
    return data;
  }
  return new Observer(data)
}

class Observer{
  constructor(obj) {
    this.walk(obj)
  }
  // 遍历对象中的所有属性
  walk(obj) {
    let keys = Object.keys(obj)
    // 对每个data中的属性进行观察劫持
    for(let i = 0;i < keys.length; i++) {
      let key = keys[i] // 属性
      let value = obj[key] // 值
      defineReactive(obj, key, value)
    }
  }
}

// 对对象中的某个属性进行劫持
function defineReactive(object, key, value) {
  // 1、当属性的值类型为Object时，进行递归
  observer(value)
  // 2、观察劫持这个属性
  Object.defineProperty(object, key, {
    get() {
      return value
    },
    set(newValue) {
      if(newValue === value) return;
      // 3、新设置的值也需要重新进行劫持
      observer(newValue)  
      value = newValue;
      
    }
  })
}