/* eslint-disable eqeqeq */
/* eslint-disable security/detect-unsafe-regex */
'use strict'

// var getStream = require('get-stream')
var handleRequest = require('./handle-requests')
var { httpServer } = require('../lib')
// ************************************

var HTTP_PORT = 8039
var httpserv = httpServer(handleRequest)

main()

// ************************************

function main () {
  httpserv.listen(HTTP_PORT)
  console.log(`Listening on http://localhost:${HTTP_PORT}...`)
}

// TODO REQUEST FROM SHOPIFY USER OBJECT
