/* eslint-disable this/no-this */
'use strict'

function ResponseStructure () {
  this.callBackType = ''
  this.transaction = {}
  this.customer = {}
  this.bank = {}
}

ResponseStructure.prototype.getCallBackResponse = function (...args) {
  try {
    if (!args[0]) throw new Error('missing args : string callBackType \n object transaction \n object customer \n object bank')
  } catch (error) {

  }
}

module.exports = ResponseStructure
