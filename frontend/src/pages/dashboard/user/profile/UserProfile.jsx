import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEditProfileMutation } from '../../../../redux/features/auth/authAPI'
import avatarImg from '../../../../assets/avatar.png'
import { setUser } from '../../../../redux/features/auth/authSlice'

const UserProfile = () => {

    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const [editProfile, { isLoading, isError, error, isSuccess }] = useEditProfileMutation()

    const [formData, setFormData] = useState({
        userName: '',
        profileImage: '',
        bio: '',
        profession: '',
        userId: ''
    })
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (user) {
            setFormData({
                userName: user?.userName || '',
                profileImage: user?.profileImage || "",
                bio: user?.bio || "",
                profession: user?.profession || "",
                userId: user?._id || ""
            })
        }
    },[user])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const updatedUser = {
            userName: formData.userName,
            profileImage: formData.profileImage,
            bio: formData.bio,
            profession: formData.profession,
            userId: formData.userId
        }

        try {
            const response = await editProfile(updatedUser).unwrap()
            dispatch(setUser(response?.user))
            localStorage.setItem('user', JSON.stringify(response.user))
            alert('Profile updated successfully')
        } catch (error) {
            console.error("Failed to update profile, ", error)
        }

        setIsModalOpen(false)
    }

    return (
        <div className='container mx-auto p-6'>
            <div className='bg-white shadow-md rounded-lg p-6'>
                <div className='flex flex-col md:flex-row items-center mb-4 gap-5'>
                    <img src={formData?.profileImage || avatarImg} alt="" className='w-36 h-36 object-cover rounded-full' />
                    <div className='ml-6'>
                        <h3 className='text-2xl font-bold'>Username: {formData?.userName || 'N/A'}</h3>
                        <p className='text-gray-700'>User Bio: {formData?.bio || 'N/A'}</p>
                        <p className='text-gray-700'>Profession: {formData?.profession || 'N/A'}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className='ml-auto text-blue-500 hover:text-blue-700'><i className="ri-edit-box-line text-2xl"></i></button>
                </div>
            </div>

            {/* show modal */}
            {
                isModalOpen && (
                    <div className='fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50'>
                        <div className='bg-white p-6 rounded-lg md:w-96 max-w-xl mx-auto relative'>
                            <button onClick={() => setIsModalOpen(false)} className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'><i className="ri-close-line text-xl p-2 bg-black rounded-full"></i></button>
                            <h2 className='text-2xl font-bold mb-4'>Edit Profile</h2>
                            <form onSubmit={handleSubmit}>
                                <div className='mb-4'>
                                    <label htmlFor="userName" className='block text-sm font-medium text-gray-700'>Username</label>
                                    <input type="text" name='userName' id='userName' value={formData?.userName} onChange={handleChange} placeholder='username' className='mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm' required />
                                </div>
                                <div className='mb-4'>
                                    <label htmlFor="profileImage" className='block text-sm font-medium text-gray-700'>Profile Image Url</label>
                                    <input type="text" name='profileImage' id='profileImage' value={formData?.profileImage} onChange={handleChange} placeholder='profile image url' className='mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm' required />
                                </div>
                                <div className='mb-4'>
                                    <label htmlFor="bio" className='block text-sm font-medium text-gray-700'>Bio</label>
                                    <textarea rows='3' name='bio' id='bio' value={formData?.bio} onChange={handleChange} placeholder='add your bio' className='mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm' required />
                                </div>
                                <div className='mb-4'>
                                    <label htmlFor="profession" className='block text-sm font-medium text-gray-700'>Profession</label>
                                    <input type="text" name='profession' id='profession' value={formData?.profession} onChange={handleChange} placeholder='profession' className='mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm' required />
                                </div>
                                <button type='submit' disabled={isLoading} className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>{isLoading ? 'Saving...' : 'Save Changes'}</button>
                                {isError && <p className='mt-2 text-red-500'>Failed To Update Profile, Please Try Again</p>}
                                {isSuccess && <p className='mt-2 text-green-500'>Profile Updated Successfullly</p>}
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default UserProfile