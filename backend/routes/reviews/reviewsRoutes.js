const express = require('express')
const routes = express.Router()
const reviewsCtrl = require('../../controller/reviews/reviewsCtrl')

routes.get('/total/reviews', reviewsCtrl.totalReviewsCount)
routes.get('/:userId', reviewsCtrl.getReviewsByUserId)

routes.post('/post-review', reviewsCtrl.postNewReview)

module.exports = routes