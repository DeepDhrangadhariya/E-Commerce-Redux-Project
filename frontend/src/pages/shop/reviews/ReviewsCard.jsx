import React, { useState } from 'react'
import commentorIcon from "../../../assets/avatar.png"
import { formateDate } from '../../../utils/formateDate'
import RatingsStars from '../../../components/RatingsStars'
import PostAReview from './PostAReview'

const ReviewsCard = ({ productReviews }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)

    // console.log(productReviews)

    const reviews = productReviews || []
    // console.log(reviews)

    const handleOpenReviewModal = () => {
        setIsModalOpen(true)
    }

    const handleCloseReviewModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div className='my-6 bg-white p-8'>
            <div>
                {
                    reviews.length > 0 ? (<div>
                        <h3 className='text-lg font-medium'>All Comments...</h3>
                        <div>
                            {
                                reviews.map((review, index) => (
                                    <div key={index} className='mt-4'>
                                        <div className='flex gap-4 items-center'>
                                            <img src={commentorIcon} className='size-14' alt="" />
                                            <div className='space-y-1'>
                                                <p className='text-lg font-medium underline capitalize underline-offset-4 text-blue-400'>{review?.userId?.userName}</p>
                                                <p className='text-[12px] italic'>{formateDate(review?.updatedAt)}</p>
                                                <RatingsStars rating={review.rating} />
                                            </div>
                                        </div>
                                        <div className='text-gray-600 mt-5 border p-8'>
                                            <p className='md:w-4/5'>{review.comment}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>) : (<p>No Reviews Yet</p>)
                }
            </div>

            {/* add review button */}
            <div className='mt-12'>
                <button onClick={handleOpenReviewModal} className='px-6 py-3 bg-primary text-white rounded-md'>Add A Review</button>
            </div>

            {/* review modal */}
            <PostAReview isModalOpen={isModalOpen} handleClose={handleCloseReviewModal} />
        </div>
    )
}

export default ReviewsCard