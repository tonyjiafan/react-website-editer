if (process.env.NODE_ENV === 'production') {
    console.log('生产环境')
    module.exports = require('./configStore.prod')
} else {
    console.log('开发环境')
    module.exports = require('./configStore.dev')
}