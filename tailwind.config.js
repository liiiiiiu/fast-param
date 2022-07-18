module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // 禁止预加载基础样式，否则会导致某些UI框架的样式异常
    // 查看: https://www.jianshu.com/p/2162daf865d9
    preflight: false
  }
}
