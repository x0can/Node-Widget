/* eslint-disable this/no-this */
'use strict'

function Widget () {
  // this.auth_header = {}
  this.customer_info = {}
  this.order_details = {}
  this.transaction_details = {}
}

Widget.prototype.createTransaction = function (obj) {
  this.transaction_details = obj
}

Widget.prototype.createCustomerObject = function (obj) {
  this.customer_info = obj
}

Widget.prototype.createOrderDetails = function (obj) {
  this.order_details = obj
}

Widget.prototype.createAuthHeader = function (obj) {
  this.auth_header = obj
}

module.exports = Widget
