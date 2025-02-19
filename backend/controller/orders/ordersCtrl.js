const orderModel = require("../../model/ordersSchema")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports.createCheckoutSession = async (req, res) => {
    const { products } = req.body

    try {
        const lineItems = products.map((product) => ({
            price_data: {
                currency: "usd",
                products_data: {
                    name: product.name,
                    images: [product.image]
                },
                unit_amount: Math.round(product.price * 100)
            },
            quantity: product.quantity
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['cart'],
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
        res.json({order})

    } catch (error) {
        console.error("Error Confirming Payment, ", error)
        res.status(500).json({ message: "Failed To Confirm Payment" })
    }
}