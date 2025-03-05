import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import TextInput from './TextInput'
import SelectInput from './SelectInput'
import UploadImage from './UploadImage'
import { useAddProductMutation } from '../../../../redux/features/products/productAPI'
import { useNavigate } from 'react-router-dom'

const categories = [
    { label: 'Select Category', value: '' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Dress', value: 'dress' },
    { label: 'Jewellery', value: 'jewellery' },
    { label: 'Skin Care', value: 'skin-care' },
]

const colors = [
    { label: 'Select Color', value: '' },
    { label: 'Black', value: 'black' },
    { label: 'Red', value: 'red' },
    { label: 'Gold', value: 'gold' },
    { label: 'Blue', value: 'blue' },
    { label: 'Silver', value: 'silver' },
    { label: 'Beige', value: 'beige' },
    { label: 'Green', value: 'green' },
]

const AddProduct = () => {

    const { user } = useSelector(state => state.auth)

    const [product, setProduct] = useState({
        name: '',
        category: '',
        color: '',
        price: '',
        description: '',
    })

    const [image, setImage] = useState('')
    const [addProduct, { isLoading, error }] = useAddProductMutation()

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setProduct({
            ...product,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!product.name || !product.category || !product.price || !product.description || !product.color) {
            alert('Please fill all the required fields')
            return
        }

        try {
            await addProduct({ ...product, image, author: user?._id, createdAt: new Date }).unwrap()
            alert('Product added successfully')
            setProduct({
                name: '',
                category: '',
                color: '',
                price: '',
                description: '',
            })
            setImage('')
            navigate('/shop')
        } catch (error) {
            console.error("Failed to submit, ", error)
        }
    }

    return (
        <div className='container mx-auto mt-8'>
            <h2 className='text-2xl font-bold mb-6'>Add New Product</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <TextInput
                    label='Product Name'
                    name='name'
                    value={product.name}
                    onChange={handleChange}
                    type='text'
                    placeholder='Product Name'
                />

                <SelectInput
                    label='Category'
                    name='category'
                    value={product.category}
                    onChange={handleChange}
                    options={categories}
                />

                <SelectInput
                    label='Colors'
                    name='color'
                    value={product.color}
                    onChange={handleChange}
                    options={colors}
                />

                <TextInput
                    label='Price'
                    name='price'
                    value={product.price}
                    onChange={handleChange}
                    type='number'
                    placeholder='50'
                />

                <UploadImage
                    name='image'
                    value={e => setImage(e.target.value)}
                    placeholder='Upload Image'
                    setImage={setImage}
                />

                <div>
                    <label
                        htmlFor='description'
                        className='block text-sm font-medium text-gray-700'
                    >Description</label>
                    <textarea
                        name="description"
                        id="description"
                        className='add-product-InputCSS'
                        value={product.description}
                        placeholder='Write a product description'
                        onChange={handleChange}

                    ></textarea>
                </div>

                <div>
                    <button
                        type='submit'
                        className='add-product-btn'
                    >Add Product</button>
                </div>
            </form>
        </div>
    )
}

export default AddProduct