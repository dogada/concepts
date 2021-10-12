var http = require('http')
const process = require('process')
const url = process.argv[2] || 'http://localhost:3000?health'
var options = {
  timeout: 2000
}

var request = http.request(url, options, (res) => {
  console.info('STATUS: ' + res.statusCode)
  const code = res.statusCode === 200 ? 0 : 1
  process.exit(code)
})

request.on('error', function (err) {
  console.error('ERROR', err)
  process.exit(1)
})

request.end()
