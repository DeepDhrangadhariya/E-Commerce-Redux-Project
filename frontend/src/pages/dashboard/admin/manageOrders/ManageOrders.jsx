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
        <>
            <section className="py-1 bg-blueGray-50">
                <div className="w-full mb-12 xl:mb-0 px-4 mx-auto">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
                        <div className="rounded-t mb-0 px-4 py-3 border-0">
                            <div className="flex flex-wrap items-center">
                                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                    <h3 className="font-semibold text-base text-blueGray-700">Manage Orders</h3>
                                </div>
                            </div>
                        </div>

                        <div className="block w-full overflow-x-auto">
                            <table className="items-center bg-transparent w-full border-collapse ">
                                <thead>
                                    <tr>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Order Id.
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Customer
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Status
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Date
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Actions
                                        </th>
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

                        </div>
                    </div>
                </div>
                            {/* update order modal */}
                            {
                                selectedOrder && (
                                    <UpdateOrderModal
                                        order={selectedOrder}
                                        isOpen={isModalOpen}
                                        onClose={handleCloseModal}
                                    />
                                )
                            }
            </section>


           
        </>
    )
}

export default ManageOrders