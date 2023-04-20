module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 100, // 1rem等于100px
      propList: ['*'],
      unitPrecision: 4, // 转为rem的小数点位数
      // selectorBlackList: [''] // 忽略掉某些选择器
    }
  }
}
