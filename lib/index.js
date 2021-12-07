'use strict'

var [ fileServer, serveFile ] = require('./file-server')
var httpServer = require('./http-server')

module.exports = {
    fileServer: fileServer,
    httpServer: httpServer,
    serveFile: serveFile
}