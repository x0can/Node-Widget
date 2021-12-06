/* eslint-disable this/no-this */
'use strict'

function Widget () {
  this.merchantCode = ''
  this.accssTocken = ''
}

Widget.prototype.getCredentials = function (...args) {
  return args
}

module.exports = Widget
