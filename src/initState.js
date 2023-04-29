import { observer } from "./observe/index";

export function initState(vm) {
  let opts = vm.$options;
  if(opts.props) {
    initProps(vm)
  }
  if(opts.data) {
    initData(vm)
  }
  if(opts.watch) {
    initWatch(vm)
  }
  if(opts.computed) {
    initComputed(vm)
  }
  if(opts.methods) {
    initMethods(vm)
  }
}

function initComputed(){}
function initMethods(){}
function initProps(){}
function initWatch(){}

// 对data初始化
function initData(vm){
  let data = vm.$options.data;
  // 1、判断data对象类型还是函数类型，若为函数，则需要解决this指向问题
  data = typeof data === 'function' ? 
          data.call(vm) : data;
  // 2、将data数据上的所有属性代理到实例上
  // 实现this.xxx 可以直接拿到 this.data.xxx 功能
  for(let key in data) {
    proxy(vm, "_data", key)
  }
  // 3、对数据进行观察劫持
  observer(data)
}

/**
 * 将 vm 实例上的 source 属性下的 key 属性直接代理到 vm 下
 * 实现 this.xxx 可以直接拿到 this.data.xxx 的功能
 */
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}