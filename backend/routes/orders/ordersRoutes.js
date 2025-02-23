const express = require('express')
const routes = express.Router()
const ordersCtrl = require('../../controller/orders/ordersCtrl')

routes.get('/:email', ordersCtrl.getOrderByEmail)
routes.get('/order/:id', ordersCtrl.getOrderById)
routes.get('/', ordersCtrl.getAllOrders)

routes.post('/create-checkout-session', ordersCtrl.createCheckoutSession)
routes.post('/confirm-payment', ordersCtrl.confirmPayment)

routes.patch('/update-order-status/:id', ordersCtrl.updateOrderStatus)

routes.delete('/delete-order/:id', ordersCtrl.deleteOrder)

module.exports = routes