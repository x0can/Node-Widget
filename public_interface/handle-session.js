/* eslint-disable eqeqeq */
'use strict'
var { fileServer, serveFile } = require('../lib/index')

var sessions = []

module.exports = function validateSessionID (req, res) {
  if (req.headers.cookie == undefined) {
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
  } else if (req.headers.cookie && req.headers.cookie.sessionId) {
    const isLoggedIn = Number(req.headers.cookie.isLoggedIn)
    const sessionID = req.headers.cookie.sessionId

    if (
      isLoggedIn == 1 &&
            sessions.includes(sessionID)
    ) {
      req.sessionID = sessionID

      // update cookie headers
      res.setHeader(
        'Set-Cookie',
        getCookieHeaders(sessionID, new Date(Date.now() + /* 1 hour in ms */3.6E5).toUTCString())
      )
      return true
    } else {
      clearSession(req, res)
    }
  }

  return false
}

function clearSession (req, res) {
  var sessionID =
        req.sessionID ||
        (req.headers.cookie && req.headers.cookie.sessionId)

  if (sessionID) {
    sessions = sessions.filter((sID) => {
      return sID !== sessionID
    })
  }

  res.setHeader('Set-Cookie', getCookieHeaders(null, new Date(0).toUTCString()))
}

function getCookieHeaders (sessionID, expires = null) {
  var cookieHeaders = [`sessionId=${sessionID || ''}; HttpOnly; Path=/`, `isLoggedIn=${sessionID ? '1' : ''}; Path=/`
  ]

  if (expires != null) {
    cookieHeaders = cookieHeaders.map((headerVal) => {
      return `${headerVal}; Expires=${expires}`
    })
  }

  return cookieHeaders
}
