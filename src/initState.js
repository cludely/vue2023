import { observer } from "./observe/index";

export function initState(vm) {
  let opts = vm.$options;
  console.log(opts)
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
  for(let key in data) {
    proxy(vm, "_data", key)
  }
  // 3、对数据进行观察劫持
  observer(data)
}

function proxy(vm, source, key) {
  console.log(source, key, vm)
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}