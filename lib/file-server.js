var path = require('path')
var staticAlias = require('node-static-alias')

const WEB_PATH = path.join(__dirname, 'web')

var fileServer = new staticAlias.Server(WEB_PATH, {
  cache: 100,
  serverInfo: 'Node widget'
})

function serveFile(url, statusCode, headers, req, res) {
  var listener = fileServer.serveFile(url, statusCode, headers, req, res)
  return new Promise((resolve, reject) => {
    listener.on('success', resolve)
    listener.on('error', reject)
  })
}
module.exports = [fileServer, serveFile]