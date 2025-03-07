import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseURL } from '../../../utils/baseURL'

const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseURL()}/api/orders`,
        credentials: 'include'
    }),
    tagTypes: ["Order"],
    endpoints: (builder) => ({
        getOrdersByEmail: builder.query({
            query: (email) => ({
                url: `/${email}`,
                method: 'GET'
            }),
            providesTags: ['Order']
        }),

        getOrdersById: builder.query({
            query: (id) => ({
                url: `/order/${id}`,
                method: 'GET'
            }),
            providesTags: ['Order']
        }),

        getAllOrders: builder.query({
            query: () => ({
                url: '',
                method: 'GET',
            }),
            providesTags: ['Order']
        }),

        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/update-order-status/${id}`,
                method: 'PATCH',
                body: { status }
            }),
            invalidatesTags: ['Order']
        }),

        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `/delete-order/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Order']
        })
    })
})

export const { useGetOrdersByEmailQuery, useGetOrdersByIdQuery, useGetAllOrdersQuery, useUpdateOrderStatusMutation, useDeleteOrderMutation } = orderApi
export default orderApi