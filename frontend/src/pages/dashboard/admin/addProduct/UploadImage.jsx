import React, { useState } from 'react'

const UploadImage = ({ name, value, placeholder, setImage }) => {

    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState("")

    const uploadImage = async () => {

    }

    return (
        <div>
            <label htmlFor={name}>Upload Image</label>
            <input
                type="file"
                name={name}
                id={name}
                onChange={uploadImage}
                className='add-product-InputCSS'
            />
            {
                loading && (
                    <div className='mt-2 text-sm text-blue-600'>Product uploading...</div>
                )
            }
            {
                url && (
                    <div className='mt-2 text-sm text-green-600'>
                        <p>Image uploaded successfully!</p>
                        <img src={url} alt="uploaded-image" />
                    </div>
                )
            }
        </div>
    )
}

export default UploadImage