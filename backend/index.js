const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const port = process.env.PORT || 1002

// middlewares setup
app.use(express.json({ limit: '25mb' }))
app.use((express.urlencoded({limit: '25mb'})))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

// routes
app.use('/api/auth', require('./routes/user/userRoutes'))
app.use('/api/products', require('./routes/products/productsRoutes'))
app.use('/api/reviews', require('./routes/reviews/reviewsRoutes'))

main().then(() => console.log("DataBase Connected")).catch(err => console.log(err))

async function main() {
    await mongoose.connect(process.env.DB_URL)

    app.get('/', (req, res) => {
        res.send('This Is Ecom Database')
    })
}

app.listen(port, () => {
    console.log(`Server Started On Port ${port}`)
})