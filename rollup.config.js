import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'


export default {
  // 打包的入口文件
  input: './src/index.js',
  output: {
    file: 'dist/vue.js',
    format: 'umd',  // 在 window 上 Vue
    name: 'Vue',
    sourcemap: true,  // 源文件映射
  },
  plugins: [
    // 将高级语法转换成初级语法
    babel({
      exclude: 'node_modules/**'
    }),
    serve({ // 开启服务
      port: 3000,
      contentBase: '',  // 以当前文件所在目录为基准
      openPage: '/index.html'
    })
  ]
}