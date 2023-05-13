import { observer } from "./observe/index";
import { nextTick } from "./utils/nextTick";
import watcher from './observe/watcher';

export function initState(vm) {
  let opts = vm.$options;
  if (opts.props) {
    initProps(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
}

function initComputed() { }
function initMethods() { }
function initProps() { }
function initWatch(vm) {
  // 1、获取watch
  let watch = vm.$options.watch
  // 2、遍历
  for (let key in watch) {
    // 2.1 获取他的属性对应的值
    let handler = watch[key]
    // 2.2 判断类型 数组、对象、字符串、方法
    if (Array.isArray(handler)) {
      handler.forEach(item => createrWatcher(vm, key, item))
    } else {
      // 3、创建一个方法来处理
      createrWatcher(vm, key, handler)
    }
  }
}

// vm.$watch(() => 'a')   // 返回值就是watcher上的属性
function createrWatcher(vm, exprOrfn, handler, options) {
  if (typeof handler === 'object') {
    options = handler // 用户配置项
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler] // 将实例上的方法作为handler
  }
  // watch 的最终处理是通过 $watch 这个方法
  return vm.$watch(vm, exprOrfn, handler, options)
}

// 对data初始化
function initData(vm) {
  let data = vm.$options.data;
  // 1、判断data对象类型还是函数类型，若为函数，则需要解决this指向问题
  data = typeof data === 'function' ?
    data.call(vm) : data;
  // 2、将data数据上的所有属性代理到实例上
  // 实现this.xxx 可以直接拿到 this.data.xxx 功能
  for (let key in data) {
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

export function stateMinxin(vm) {
  vm.prototype.$nextTick = function (cb) {
    nextTick(cb)
  }

  vm.prototype.$watch = function (Vue, exprOrfn, handler, options = {}) {
    let watch = new watcher(Vue, exprOrfn, handler, {...options, user: true})
    if (options.immediate) {
      handler.call(Vue)
    }
  }
}