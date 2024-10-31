module.exports = {
  css: {
    extract: false
  },
  chainWebpack: config => {
    config.module
      .rule('babel')
      .test(/\.js$/)
      .include
      .add(/node_modules\/@campsabout\/mapbox/)
      .add(/node_modules\/@geocms\/components/) // Include other dependencies if needed
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        plugins: ['@babel/plugin-transform-optional-chaining']
      })
  }
}
