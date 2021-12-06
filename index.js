/* eslint-disable eqeqeq */
/* eslint-disable security/detect-unsafe-regex */
'use strict'

var http = require('http')
var path = require('path')
var staticAlias = require('node-static-alias')

// ************************************

const WEB_PATH = path.join(__dirname, 'public_interface')
var HTTP_PORT = 8039
var httpserv = http.createServer(handleRequest)

var fileServer = new staticAlias.Server(WEB_PATH, {
  cache: 100,
  serverInfo: 'Node widget',
  alias: [
    {
      match: /^\/(?:index\/?)?(?:[?#].*$)?$/,
      serve: 'index.html',
      force: true
    }
  ]
})

main()

// ************************************

function main () {
  httpserv.listen(HTTP_PORT)
  console.log(`Listening on http://localhost:${HTTP_PORT}...`)
}

async function handleRequest (req, res) {
  if (['GET', 'HEAD'].includes(req.method)) {
    // special handling for empty favicon
    if (req.url == '/favicon.ico') {
      res.writeHead(204, {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age: 604800'
      })
      res.end()
      return
    }
    // handle other static files
    fileServer.serve(req, res, (err) => {
      if (err) {
        if (req.headers.accept.includes('text/html')) {
          serveFile('/404.html', 200, { 'X-Not-Found': '1' }, req, res)
            .catch(console.error)
        } else {
          res.writeHead(404)
          res.end()
        }
      }
    })
  }
  else {
    res.writeHead(404)
    res.end()
}
}

function serveFile (url, statusCode, headers, req, res) {
  var listener = fileServer.serveFile(url, statusCode, headers, req, res)
  return new Promise((resolve, reject) => {
    listener.on('success', resolve)
    listener.on('error', reject)
  })
}
