// 重写数组方法

let oldArrayProtoMethods = Array.prototype

// 2、创建一个新的原型对象，用来劫持
export let ArrayMethods = Object.create(oldArrayProtoMethods)

// 3、劫持
let methods = [
  "push",
  "pop",
  "unshift",
  "shift",
  "splice"
]

methods.forEach(item => {
  ArrayMethods[item] = function (...args) {
    let result = oldArrayProtoMethods[item].apply(this, args)
    let inserted
    switch(item) {
      case "push":
      case "unshift":
        inserted = args
        break;
      case "splice":
        inserted = args.splice(2)
    }

    let ob = this.__ob__
    if(inserted) {
      ob.observeArray(inserted)
    }
    ob.dep.notify()
    return result
  }
})

