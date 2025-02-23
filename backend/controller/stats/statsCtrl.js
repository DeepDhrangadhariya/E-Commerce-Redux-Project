const orderModel = require("../../model/ordersSchema")
const productTable = require("../../model/productsSchema")
const reviewsTable = require("../../model/reviewsSchema")
const userTable = require("../../model/userSchema")

module.exports.userStatsByEmail = async (req, res) => {
    const { email } = req.params
    if (!email) {
        return res.status(400).send({ message: "Email Is Required" })
    }

    try {

        const user = await userTable.findOne({ email: email })
        if (!user) {
            return res.status(404).send({ message: "User Not Found" })
        }

        // sum of all products
        const totalPaymentsResult = await orderModel.aggregate([
            { $match: { email: email } },
            {
                $group: { _id: null, totalAmount: { $sum: "$amount" } }
            }
        ])

        const totalPaymentsAmount = totalPaymentsResult.length > 0 ? totalPaymentsResult[0].totalAmount : 0

        // get total reviews
        const totalReviews = await reviewsTable.countDocuments({ userId: user?._id })

        // total purchased products
        const purchasedProductIds = await orderModel.distinct("products.productId", { email: email })
        const totalPurchasedProducts = purchasedProductIds.length

        res.status(200).json({
            totalPayments: totalPaymentsAmount.toFixed(2),
            totalReviews,
            totalPurchasedProducts
        })

    } catch (error) {
        console.error("Error Fetching User Stats By Email, ", error)
        res.status(500).send("Failed To Fetch User Stats By Email")
    }
}

module.exports.adminStats = async (req, res) => {
    try {

        const totalOrders = await orderModel.countDocuments()
        const totalProducts = await productTable.countDocuments()
        const totalReviews = await reviewsTable.countDocuments()
        const totalUsers = await userTable.countDocuments()

        // calculate total earnings
        const totalEarningsResult = await orderModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$amount" }
                }
            }
        ])
        const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalEarnings : 0

        const monthlyEarningsResult = await orderModel.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    monthlyEarnings: { $sum: "$amount" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ])
        
        // formate monthly earnings
        const monthlyEarnings = monthlyEarningsResult.map((entry) => ({
            month: entry._id.month,
            year: entry._id.year,
            earnings: entry.monthlyEarnings.toFixed(2)
        }))

        res.status(200).json({
            totalOrders,
            totalProducts,
            totalReviews,
            totalUsers,
            totalEarnings,
            monthlyEarnings
        })

    } catch (error) {
        console.error("Error Fetching Admin Stats, ", error)
        res.status(500).send({ message: "Failed To Fetch Admin Stats" })
    }
}