const express = require("express");
const routes = express.Router();
const productsCtrl = require('../../controller/products/productsCtrl');
const { verifyToken } = require("../../middleware/verifyToken");
const { verifyAdmin } = require("../../middleware/verifyAdmin");

routes.get('/', productsCtrl.getAllProducts)
routes.get('/:id', productsCtrl.getSingleProduct)
routes.get('/related/:id', productsCtrl.getRelatedProducts)

routes.post('/create-product', productsCtrl.createProduct)

routes.patch('/update-product/:id', verifyToken, verifyAdmin, productsCtrl.updateProduct)

routes.delete('/:id', productsCtrl.deleteProduct)

module.exports = routes