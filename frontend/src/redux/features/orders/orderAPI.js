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
        })
    })
})

export const { useGetOrdersByEmailQuery, useGetOrdersByIdQuery } = orderApi
export default orderApi