import React, { useState } from 'react'
import { useDeleteOrderMutation, useGetAllOrdersQuery } from '../../../../redux/features/orders/orderAPI'
import { formateDate } from '../../../../utils/formateDate'
import { Link } from 'react-router-dom'
import UpdateOrderModal from './UpdateOrderModal'

const ManageOrders = () => {

    const { data: orders, error, isLoading, refetch } = useGetAllOrdersQuery()
    console.log(orders)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [deleteOrder] = useDeleteOrderMutation()

    const handleEditOrder = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setSelectedOrder(null)
        setIsModalOpen(false)
    }

    const handleDeleteOrder = async (orderId) => {
        try {
            await deleteOrder(orderId).unwrap()
            alert('Order deleted successfully')
            refetch()
        } catch (error) {
            console.error("Failed to delete order, ", error)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500'

            case 'processing':
                return 'bg-blue-500'

            case 'shipped':
                return 'bg-green-500'

            case 'completed':
                return 'bg-gray-500'

            default:
                return 'bg-gray-300'
        }
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Something Went Wrong</div>

    return (
        <div className='section__container p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Manage Orders</h2>
            <table className='min-w-full bg-white border border-gray-200 rounded-lg'>
                <thead className='bg-gray-100'>
                    <tr>
                        <th className='py-3 px-4 border-b'>Order Id</th>
                        <th className='py-3 px-4 border-b'>Customer</th>
                        <th className='py-3 px-4 border-b'>Status</th>
                        <th className='py-3 px-4 border-b'>Date</th>
                        <th className='py-3 px-4 border-b'>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        orders && orders?.map((order, index) => (
                            <tr key={index} className='border-b'>
                                <td className='py-3 px-4 border-b'>{order?.orderId}</td>
                                <td className='py-3 px-4 border-b'>{order?.email}</td>
                                <td className='py-3 px-4 border-b'>
                                    <span
                                        className={`inline-block px-3 py-1 text-sm text-white rounded-full capitalize ${getStatusColor(order?.status)}`}
                                    >{order?.status}</span>
                                </td>
                                <td className='py-3 px-4 border-b'>{formateDate(order?.updatedAt)}</td>
                                <td className='py-4 px-4  flex items-center space-x-4'>
                                    <Link to='#' className='text-blue-500 hover:underline'>View</Link>

                                    <button
                                        onClick={() => handleEditOrder(order)}
                                        className='text-green-500 hover:underline'
                                    >Edit</button>

                                    <button
                                        onClick={() => handleDeleteOrder(order?._id)}
                                        className='text-red-500 hover:underline'
                                    >Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {/* update order modal */}
            {
                selectedOrder && (
                    <UpdateOrderModal
                        order={selectedOrder}
                        isOpen = {isModalOpen}
                        onClose = {handleCloseModal}
                    />
                )
            }
        </div>
    )
}

export default ManageOrders