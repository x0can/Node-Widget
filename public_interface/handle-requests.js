/* eslint-disable eqeqeq */
'use strict'
var util = require('util')
var fs = require('fs')
var { fileServer, serveFile } = require('../lib/index')
var cookie = require('cookie')
var getStream = require('get-stream')
var validateSessionID = require('./handle-session')

var fsReadDir = util.promisify(fs.readdir)
var fsReadFile = util.promisify(fs.readFile)
var fsWriteFile = util.promisify(fs.writeFile)

var path = require('path')
const WEB_PATH = path.join(__dirname, 'admin')

async function handleRequest (req, res) {
  // parse cookie values?
  if (req.headers.cookie) {
    req.headers.cookie = cookie.parse(req.headers.cookie)
  }

  // handle API calls
  if (['GET', 'POST'].includes(req.method) && /^\/api\/.+$/.test(req.url)) {
    // handle admin page
    if (/^\/(?:add-checkout)(?:[#?]|$)/.test(req.url)) {
      // page not allowed without active session
      if (validateSessionID(req, res)) {
        serveFile('/add-widget.html')
      }
    }

    if (
      req.url == '/api/config-widget' && validateSessionID(req, res)
    ) {
      const newgtData = JSON.parse(await getStream(req))
      await addWidget(newgtData, req, res)
    } else if (req.url == '/api/checkout-order' && validateSessionID(req, res)) {
      // TODO CONNECT TO CHECKOUT
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

async function getWidgetIDs () {
  var files = await fsReadDir(path.join(WEB_PATH, 'posts'))
  return (
    files
      .filter((filename) => {
        return /^\d+\.html$/.test(filename)
      })
      .map((filename) => {
        const [, postID] = filename.match(/^(\d+)\.html$/)
        return Number(postID)
      })
      .sort((x, y) => {
        return y - x
      })
  )
}

async function addWidget (newgtData, req, res) {
  if (
    newgtData.title.length > 0 &&
    newgtData.post.length > 0
  ) {
    const widgetTemplate = await fsReadFile(path.join(WEB_PATH, 'widget', 'widget.html'), 'utf-8')
    const newPost =
      widgetTemplate
        .replace(/\{\{TITLE\}\}/g, newgtData.title)
        .replace(/\{\{POST\}\}/, newgtData.post)
    const postIDs = await getWidgetIDs()
    let newgtCount = 1
    const [, year, month, day] = (new Date()).toISOString().match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (postIDs.length > 0) {
      const [, latestYear, latestMonth, latestDay, latestCount] = String(postIDs[0]).match(/^(\d{4})(\d{2})(\d{2})(\d+)/)
      if (
        latestYear == year &&
        latestMonth == month &&
        latestDay == day
      ) {
        newgtCount = Number(latestCount) + 1
      }
    }
    const newgtID = `${year}${month}${day}${newgtCount}`
    try {
      await fsWriteFile(path.join(WEB_PATH, 'posts', `${newgtID}.html`), newPost, 'utf8')
      sendJSONResponse({ OK: true, postID: newgtID }, res)
      return
    } catch (err) { }
  }

  sendJSONResponse({ failed: true }, res)
}

function sendJSONResponse (msg, res, otherHeaders = {}) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
    ...otherHeaders
  })
  res.end(JSON.stringify(msg))
}

module.exports = handleRequest
