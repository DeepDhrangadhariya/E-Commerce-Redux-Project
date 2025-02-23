const orderModel = require("../../model/ordersSchema")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports.createCheckoutSession = async (req, res) => {
    const { products } = req.body

    try {
        const lineItems = products.map((product) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                    images: [product.image]
                },
                unit_amount: Math.round(product.price * 100)
            },
            quantity: product.quantity
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`
        })

        res.json({ id: session.id })
    } catch (error) {
        console.error("Error Creating Checkout Session, ", error)
        res.status(500).json({ message: "Failed To Create Checkout Session" })
    }
}

module.exports.confirmPayment = async (req, res) => {
    const { session_id } = req.body

    try {

        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ["line_items", "payment_intent"]
        })

        const paymentIntentId = session.payment_intent.id
        let order = await orderModel.findOne({ orderId: paymentIntentId })

        if (!order) {
            const lineItems = session.line_items.data.map((item) => ({
                productId: item.price.product,
                quantity: item.quantity
            }))

            const amount = session.amount_total / 100
            order = new orderModel({
                orderId: paymentIntentId,
                amount,
                products: lineItems,
                email: session.customer_details.email,
                status: session.payment_intent.status === "succeeded" ? "pending" : 'failed'
            })
        } else {
            order.status = session.payment_intent.status === "succeeded" ? "pending" : 'failed'
        }

        await order.save()
        res.json({ order })

    } catch (error) {
        console.error("Error Confirming Payment, ", error)
        res.status(500).json({ message: "Failed To Confirm Payment" })
    }
}

module.exports.getOrderByEmail = async (req, res) => {
    const email = req.params.email
    if (!email) {
        return res.status(400).send({ message: "Email Is Required" })
    }

    try {

        const orders = await orderModel.find({ email: email })

        if (orders.length === 0 || !orders) {
            return res.status(400).send({ message: "No Orders Found For This Email", orders: 0 })
        }

        res.status(200).send({ orders })

    } catch (error) {
        console.error("Error Fetching Orders By Email, ", error)
        res.status(500).send({ message: "Faild To Fetch Orders By Email" })
    }
}

module.exports.getOrderById = async (req, res) => {
    try {

        const order = await orderModel.findById(req.params.id)
        if (!order) {
            return res.status(404).send({ message: "Order Not Found" })
        }

        res.status(200).send(order)

    } catch (error) {
        console.error("Error Fetching Orders By Id, ", error)
        res.status(500).send({ message: "Failed To Fetch Orders By Id" })
    }
}

module.exports.getAllOrders = async (req, res) => {
    try {

        const orders = await orderModel.find().sort({ createdAt: -1 })
        if (orders.length === 0 || !orders) {
            return res.status(404).send({ message: "No Orders Found", orders: [] })
        }

        res.status(200).send(orders)

    } catch (error) {
        console.error("Error Fetching All Orders, ", error)
        res.status(500).send({ message: "Failed To Fetch All Orders" })
    }
}

module.exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(404).send({ message: "Id Is Required" })
    }

    const { status } = req.body
    if (!status) {
        return res.status(400).send({ message: "Status Is Required" })
    }

    try {

        const updatedOrder = await orderModel.findByIdAndUpdate(id, {
            status,
            updatedAt: new Date()
        }, {
            new: true,
            runValidators: true
        })

        if (!updatedOrder) {
            return res.status(404).send({ message: "Order Not Found" })
        }

        res.status(200).json({ message: "Order Status Updated Successfully", order: updatedOrder })

    } catch (error) {
        console.error("Error Updating Order Status, ", error)
        res.status(500).send({ message: "Failed To Update Order Status" })
    }
}

module.exports.deleteOrder = async (req, res) => {
    const {id} = req.params
    if (!id) {
        return res.status(404).send({message: "Id Is Required"})
    }

    try {
        
        const deletedOrders = await orderModel.findByIdAndDelete(id)
        if (!deletedOrders) {
            return res.status(404).send({message: "Order Not Found"})
        }

        res.status(200).json({
            message: "Order Deleted Successfully",
            order: deletedOrders
        })

    } catch (error) {
        console.error("Error Deleting Order, ", error)
        res.status(500).send({message: "Failed To Delete Order"})
    }
}