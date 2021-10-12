const { resolve } = require('path')

module.exports = {
  webpack(config, options) {
    config.resolve.alias['~'] = resolve(__dirname, './src')
    return config
  },
  typescript: {
    ignoreDevErrors: true
  }
}
