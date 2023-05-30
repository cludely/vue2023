import { observer } from "./observe/index";
import { nextTick } from "./utils/nextTick";
import Watcher from './observe/watcher';
import Dep from "./observe/dep";

export function initState(vm) {
  let opts = vm.$options;
  if (opts.data) {
    initData(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
  if (opts.props) {
    initProps(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
}

function initComputed(vm) {
  let computed = vm.$options.computed
  // 每个计算属性都需要一个watcher
  let watchers = vm._computedWatchers = {}
  // 将computed属性通过Object.definedProperty进行处理
  for (let key in computed) {
    let userDef = computed[key]
    let getter = typeof userDef == 'function' ? userDef : userDef.get
    // 给每一个计算属性添加watcher
    watchers[key] = new Watcher(vm, getter, () => { }, { lazy: true })
    defineComputed(vm, key, userDef)
  }
}

let sharedPropDefinition = {}
function defineComputed(target, key, userDef) {
  sharedPropDefinition = {
    enumerable: true,
    configurable: true,
    get: () => { },
    set: () => { }
  }
  // 处理 userDef 的格式
  if (typeof userDef == 'function') {
    sharedPropDefinition.get = createComputedGetter(key)
  } else {
    sharedPropDefinition.get = createComputedGetter(key)
    sharedPropDefinition.set = userDef.set
  }
  Object.defineProperty(target, key, sharedPropDefinition)
}
/**
 * 返回用户的计算属性方法
 */
function createComputedGetter(key) {
  return function () {
    let watcher = this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {  // 说明还有watcher，应该收集起来
        watcher.depend()
      }
      return watcher.value
    }
  }
}


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
    let watch = new Watcher(Vue, exprOrfn, handler, { ...options, user: true })
    if (options.immediate) {
      handler.call(Vue)
    }
  }
}