import React, { useEffect, useState } from 'react'
// import productsData from '../../data/products.json'
import ProductCards from './ProductCards'
import ShopFiltering from './ShopFiltering'
import { useFetchAllProductsQuery } from '../../redux/features/products/productAPI'

const filters = {
    categories: ['all', 'accessories', 'dress', 'jewellery', 'cosmetics', 'skin-care'],
    colors: ['all', 'black', 'red', 'gold', 'blue' , 'silver', 'beige', 'green'],
    priceRanges: [
        { label: 'Under $50', min: 0, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100 - $200', min: 100, max: 200 },
        { label: '$200 and above', min: 200, max: Infinity }
    ]
}

const ShopPage = () => {

    // const [products, setProducts] = useState(productsData)
    const [filtersState, setFiltersState] = useState({
        category: 'all',
        color: 'all',
        priceRange: ''
    })

    const [currentPage, setCurrentPage] = useState(1)
    const [productsPerPage] = useState(8)

    const { category, color, priceRange } = filtersState
    const [minPrice, maxPrice] = priceRange ? priceRange.split('-').map(Number) : [0, Infinity];

    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: category !== 'all' ? category : '',
        color: color !== 'all' ? color : '',
        minPrice: isNaN(minPrice) ? '' : minPrice,
        maxPrice: isNaN(maxPrice) ? '' : maxPrice,
        page: currentPage,
        limit: productsPerPage
    })

    // filter funtions

    // const applyFilters = () => {
    //     let filteredProducts = productsData

    //     // filter by categories
    //     if (filtersState.category && filtersState.category !== 'all') {
    //         filteredProducts = filteredProducts.filter(product => product.category === filtersState.category)
    //     }

    //     // filter by colors
    //     if (filtersState.color && filtersState.color !== "all") {
    //         filteredProducts = filteredProducts.filter(product => product.color === filtersState.color)
    //     }

    //     // filter by pricerange
    //     if (filtersState.priceRange) {
    //         const [minPrice, maxPrice] = filtersState.priceRange.split('-').map(Number)
    //         filteredProducts = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice)
    //     }

    //     setProducts(filteredProducts)
    // }



    // useEffect(() => {
    //     applyFilters()
    // }, [filtersState])

    // clear the filter
    const clearFilters = () => {
        setFiltersState({
            category: "all",
            color: 'all',
            priceRanges: ''
        })
    }

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber)
        }
    }

    if (isLoading) return <div>Loading....</div>
    if (error) return <div>Error Loading Products</div>

    const startProducts = (currentPage - 1) * productsPerPage + 1
    const endProducts = startProducts + products.length - 1

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Shop Page</h2>
                <p className='section__subheader'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus expedita veniam ratione numquam suscipit ipsum magni.</p>
            </section>

            <section className='section__container'>
                <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
                    {/* left aside */}
                    <ShopFiltering
                        filters={filters}
                        filtersState={filtersState}
                        setFiltersState={setFiltersState}
                        clearFilters={clearFilters}
                    />

                    {/* right side */}
                    <div>
                        <h3 className='text-xl font-medium mb-4'>
                            Showing {startProducts} to {endProducts} of {totalProducts} Products
                        </h3>
                        <ProductCards products={products} />

                        {/* pagination controls */}
                        <div className='mt-6 flex justify-center'>
                            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2'>Previous</button>

                            {
                                [...Array(totalPages)].map((_, index) => (
                                    <button onClick={() => handlePageChange(index + 1)} className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md mx-1`} key={index}>{index + 1}</button>
                                ))
                            }
                            
                            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md ml-2'>Next</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ShopPage