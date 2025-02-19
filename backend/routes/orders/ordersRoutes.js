const express = require('express')
const routes = express.Router()
const ordersCtrl = require('../../controller/orders/ordersCtrl')

routes.post('/create-checkout-session', ordersCtrl.createCheckoutSession)
routes.post('/confirm-payment', ordersCtrl.confirmPayment)

module.exports = routes