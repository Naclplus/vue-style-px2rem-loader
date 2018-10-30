const loaderUtils = require('loader-utils')

// 默认参数
const defaultopts = {
    baseDpr: 2,
    remUnit: 75, // rem unit value (default: 100)
    remPrecision: 4 // rem value precision (default: 2)
}
// 获取webpack配置好的参数
const opts = loaderUtils.getOptions(this)
// 将参数组合
const config = Object.assign({}, defaultopts, opts)
const template = /<template>([\s\S]+)<\/template>/gi
const ZPXRegExp = /(\d+)px/

module.exports = function (source) {
    let _source = ''
    // 如果当前的source里面存在template
    if (template.test(source)) {
        // 匹配template部分
        _source = source.match(template)[0]
    }
    // 匹配出template里面的px
    let pxGlobalRegExp = new RegExp(ZPXRegExp.source, 'ig')
    if (pxGlobalRegExp.test(_source)) {
        // px转换rem，核心部分
        return source.replace(pxGlobalRegExp, ($0, $1) => {
            let val = config.baseDpr * $1 / config.remUnit
            // 精确到几位
            val = parseFloat(val.toFixed(config.remPrecision))
            return val === 0 ? val : val + 'rem'
        })
    } else {
        // 没有就不转，直接返回
        return source
    }
}
