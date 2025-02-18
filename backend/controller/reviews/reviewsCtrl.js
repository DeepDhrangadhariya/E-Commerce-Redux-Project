const prodcutTable = require("../../model/productsSchema")
const reviewsTable = require("../../model/reviewsSchema")

module.exports.postNewReview = async (req, res) => {
    try {
        const { comment, rating, productId, userId } = req.body

        if (!comment || !rating || !productId || !userId) {
            return res.status(400).send({ message: "All Fields Are Required!" })
        }
        const existingReview = await reviewsTable.findOne({ productId, userId })

        if (existingReview) {
            // update reviews
            existingReview.comment = comment
            existingReview.rating = rating
            await existingReview.save()
        } else {
            // create new review
            const newReview = new reviewsTable({
                comment, rating, productId, userId
            })
            await newReview.save()
        }

        // calculate the average rating
        const reviews = await reviewsTable.find({ productId })
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
            const averageRating = totalRating / reviews.length

            const product = await prodcutTable.findById(productId)
            if (product) {
                product.rating = averageRating
                await product.save({ validateBeforeSave: false })
            } else {
                return res.status(404).send({ message: "Product Not Found" })
            }
        }

        res.status(200).send({ message: "Review Processed Successfully", reviews })
    } catch (error) {
        console.error("Error Posting Review, ", error)
        res.status(500).send({ message: 'Failed to Post Review' })
    }
}

module.exports.totalReviewsCount = async (req, res) => {
    try {
        const totalReviews = await reviewsTable.countDocuments({})
        res.status(200).send({ totalReviews })
    } catch (error) {
        console.error("Error Geting Total Reviews, ", error)
        res.status(500).send({ message: "Failed To Get Total Reviews" })
    }
}

module.exports.getReviewsByUserId = async (req, res) => {
    try {
        const { userId } = req.params
        if (!userId) {
            return res.status(400).send({ message: "User Id Is Required" })
        }

        const reviews = await reviewsTable.find({ userId: userId }).sort({ createdAt: -1 })
        if (reviews.length === 0) {
            return res.status(404).send({ message: "No Reviews Found" })
        }

        res.status(200).send(reviews)
    } catch (error) {
        console.error("Error Fetching Reviews By UserId, ", error)
        res.status(500).send({ message: "Failed To Fetch Reviews By UserId" })
    }
}