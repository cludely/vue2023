export const HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestory",
  "destoryed"
]

let starts = {}
starts.data = function (parentVal, childVal) {
  return childVal
}
starts.computed = function () { }
starts.watch = function () { }
starts.methods = function () { }
// 遍历生命周期HOOKS
HOOKS.forEach(hooks => {
  starts[hooks] = mergeHook
})

function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}



export function mergeOptions(parent, child) {
  // 组合数据结构： Vue.options = {created:[a, b, c], watch:[a,b]...}
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    mergeField(key)
  }

  function mergeField(key) {
    // 策略模式
    if (starts[key]) {  // 合并HOOKS
      options[key] = starts[key](parent[key], child[key])
    } else {
      options[key] = child[key]
    }
  }


  return options
}