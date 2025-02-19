import React from 'react'
import { Link, useParams } from 'react-router-dom'
import RatingsStars from '../../../components/RatingsStars'
import { useDispatch } from 'react-redux'
import { useFetchProductByIdQuery } from '../../../redux/features/products/productAPI'
import { addToCart } from '../../../redux/features/cart/cartSlice'
import ReviewsCard from '../reviews/ReviewsCard'

const SingleProduct = () => {

    const { id } = useParams()
    // console.log(id)
    const dispatch = useDispatch()
    const { data, error, isLoading } = useFetchProductByIdQuery(id)
    // console.log(data)
    const singleProduct = data?.product || {}
    // console.log(singleProduct)
    const productReviews = data?.reviews || []
    // console.log(productReviews)

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <p>Error Loading Product Details</p>

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Single Product Page</h2>
                <div className='section__subheader'>
                    <span className='hover:text-primary'><Link to='/'>home</Link></span>
                    <i className='ri-arrow-right-s-line'></i>
                    <span className='hover:text-primary'><Link to='/shop'>shop</Link></span>
                    <i className='ri-arrow-right-s-line'></i>
                    <span className='hover:text-primary cursor-pointer'>{singleProduct?.name}</span>
                </div>
            </section>

            <section className='section__container mt-8'>
                <div className='flex flex-col items-center md:flex-row gap-8'>
                    {/* product image */}
                    <div className='md:w-1/2 w-full'>
                        <img src={singleProduct?.image} alt="product image" className='rounded-md w-full h-auto' />
                    </div>

                    <div className='md:w-1/2 w-full'>
                        <h3 className='text-2xl font-semibold mb-4'>{singleProduct?.name}</h3>
                        <p className='text-xl text-primary mb-4'>${singleProduct?.price}
                            {singleProduct?.oldPrice && <s className='ml-1'>${singleProduct?.oldPrice}</s>}
                        </p>
                        <p className='text-gray-400 mb-4'>{singleProduct?.description}</p>

                        {/* aditional product info */}
                        <div className='flex flex-col space-y-2'>
                            <p><strong>Category:</strong> {singleProduct?.category}</p>
                            <p><strong>Color:</strong> {singleProduct?.color}</p>
                            <div className='flex gap-1 items-center'>
                                <strong>Ratings: </strong>
                                <RatingsStars rating={singleProduct?.rating} />
                            </div>
                        </div>

                        <button onClick={(e) => { e.stopPropagation(); handleAddToCart(singleProduct) }} className='mt-6 px-6 py-3 bg-primary text-white rounded-md'>Add To Cart</button>
                    </div>
                </div>
            </section>

            {/* display reviews */}
            <section className='section__container mt-8'>
                <ReviewsCard productReviews={productReviews} />
            </section>
        </>
    )
}

export default SingleProduct