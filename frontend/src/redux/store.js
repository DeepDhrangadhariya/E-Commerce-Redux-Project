import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import authApi from './features/auth/authAPI'
import authReducer from './features/auth/authSlice'
import productsApi from './features/products/productAPI'
import reviewApi from './features/reviews/reviewsAPI'

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, productsApi.middleware, reviewApi.middleware)
})