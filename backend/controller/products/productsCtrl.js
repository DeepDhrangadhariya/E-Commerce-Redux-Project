const productSchema = require("../../model/productsSchema")
const reviewsTable = require("../../model/reviewsSchema")

module.exports.createProduct = async (req, res) => {
    try {
        const newProduct = new productSchema({
            ...req.body
        })

        const savedProduct = await newProduct.save()

        // calculate reviews
        const reviews = await reviewsTable.find({ prodcutId: savedProduct._id })
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
            const averageRating = totalRating / reviews.length
            savedProduct.rating = averageRating
            await savedProduct.save()
        }

        res.status(200).send(savedProduct)
    } catch (error) {
        console.error("Error At Create Product, ", error)
        res.status(500).send({ message: "Error At Create Product" })
    }
}

module.exports.getAllProducts = async (req, res) => {
    try {
        const { category, color, minPrice, maxPrice, page = 1, limit = 10 } = req.query
        let filter = {}

        if (category && category !== 'all') {
            filter.category = category
        }

        if (color && color !== 'all') {
            filter.color = color
        }

        if (minPrice && maxPrice) {
            const min = parseFloat(minPrice)
            const max = parseFloat(maxPrice)
            if (!isNaN(min) && !isNaN(max)) {
                filter.price = { $gte: min, $lte: max }
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)
        const totalProducts = await productSchema.countDocuments(filter)
        const totalPages = Math.ceil(totalProducts / parseInt(limit))
        const products = await productSchema.find(filter).skip(skip).limit(parseInt(limit)).populate('author', 'email').sort({ createdAt: -1 })

        res.status(200).send({ products, totalPages, totalProducts })
    } catch (error) {
        console.error("Error Fetching Products, ", error)
        res.status(500).send({ message: "Error Fetching Products" })
    }
}

module.exports.getSingleProduct = async (req, res) => {
    try {
        const prodcutId = req.params.id
        const product = await productSchema.findById(prodcutId).populate('author', 'email userName')
        if (!product) {
            return res.status(404).send({ message: "Product Not Found" })
        }
        const reviews = await reviewsTable.find({ prodcutId }).populate('userId', 'userName email')

        res.status(200).send({ product, reviews })
    } catch (error) {
        console.error("Error Fetching Single Product, ", error)
        res.status(500).send({ message: "Error Fetching Single Product" })
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const updatedProduct = await productSchema.findByIdAndUpdate(productId, { ...req.body }, { new: true })

        if (!updatedProduct) {
            return res.status(404).send({ message: "Product Not Found" })
        }

        res.status(200).send({ message: "Product Updated Successfull", product: updatedProduct })
    } catch (error) {
        console.error("Error Updating Product, ", error)
        res.status(500).send({ message: "Error Updating Product" })
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const deletedProduct = await productSchema.findByIdAndDelete(productId)

        if (!deletedProduct) {
            return res.status(404).send({ message: "Product Not Found" })
        }

        // delete reviews of this product
        await reviewsTable.deleteMany({ prodcutId: productId })

        res.status(200).send({ message: "Product Deleted Successfully" })
    } catch (error) {
        console.error("Error Deleting Product, ", error)
        res.status(500).send({ message: "Error Deleting Product" })
    }
}

module.exports.getRelatedProducts = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(404).send({ message: 'Product Id Not Found' })
        }

        const product = await productSchema.findById(id)
        if (!product) {
            return res.status(404).send({ message: 'Product Not Found' })
        }

        const titleRegex = new RegExp(
            product.name.split(' ').filter((word) => word.length > 1).join("|"), "i"
        )

        const relatedProducts = await productSchema.find({
            _id: { $ne: id },
            $or: [
                { name: { $regex: titleRegex } },
                { category: product.category }
            ]
        })

        res.status(200).send(relatedProducts)
    } catch (error) {
        console.error("Error Geting Related Products, ", error)
        res.status(500).send({ message: "Error Geting Related Products" })
    }
}