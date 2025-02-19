const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
    },
    products: [
        {
            productId: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }
    ],
    amount: {
        type: Number,
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "completed"],
        default: "pending"
    }
}, {timestamps: true})

const orderModel = mongoose.model('Order', orderSchema)

module.exports = orderModel