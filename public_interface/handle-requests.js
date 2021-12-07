/* eslint-disable eqeqeq */
'use strict'
var cookie = require('cookie')
var { fileServer, serveFile } = require('../lib/index')
var validateSessionID = require('./handle-session')

async function handleRequest (req, res) {
  // parse cookie values?
  if (req.headers.cookie) {
    req.headers.cookie = cookie.parse(req.headers.cookie)
  }

  // handle API calls
  if (['GET', 'POST'].includes(req.method) && /^\/api\/.+$/.test(req.url)) {
    if (req.url == '/api/checkout-order') {
      validateSessionID(req, res)
    }
  } else if (['GET', 'HEAD'].includes(req.method)) {
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
  } else {
    res.writeHead(404)
    res.end()
  }
}

module.exports = handleRequest
