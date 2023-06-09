import { mergeOptions } from "../utils/index"
export function initGlobalApi(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    // 对象合并
    this.options = mergeOptions(this.options, mixin)
  }


  // 组件
  // 1、在vue的属性中定义一个全局的方法 component
  Vue.options.components = {} // 放全局组件
  /**
   * 注册一个全局组件
   * @param {*} id 组件名
   * @param {*} componentDef  组件定义，模板等 
   */
  Vue.component = function (id, componentDef) {
    componentDef.name = componentDef.name || id
    // Vue创建组件的核心 Vue.extend 方法
    componentDef = this.extend(componentDef)  // 返回一个组件类(构造函数)
    this.options.components[id] = componentDef
    
  }

  /**
   * 使用基础 Vue 构造器
   * @param {*} options 一个包含组件选项的对象
   * @returns 返回一个“子类”
   */
  Vue.extend = function (options) {
    let spuer = this
    const Sub = function vuecomponent(opts) {
      this._init(opts)
    }
    Sub.prototype = Object.create(spuer.prototype)
    // 解决子组件中this的指向问题
    Sub.prototype.constructor = Sub
    // 将父组件中的属性合并到子组件中
    Sub.options = mergeOptions(this.options, options)
    return Sub
  }
}