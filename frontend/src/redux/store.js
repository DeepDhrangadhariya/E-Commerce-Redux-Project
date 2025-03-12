import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import authApi from './features/auth/authAPI'
import authReducer from './features/auth/authSlice'
import productsApi from './features/products/productAPI'
import reviewApi from './features/reviews/reviewsAPI'
import statsApi from './features/stats/statsAPI'
import orderApi from './features/orders/orderAPI'

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [statsApi.reducerPath]: statsApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, productsApi.middleware, reviewApi.middleware, statsApi.middleware, orderApi.middleware)
})