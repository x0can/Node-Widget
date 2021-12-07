'use strict'

var http = require('http')

module.exports = (handleRequest) => http.createServer(handleRequest)