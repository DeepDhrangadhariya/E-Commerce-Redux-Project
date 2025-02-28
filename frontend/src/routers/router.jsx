import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import CategoryPage from "../pages/category/CategoryPage";
import Search from "../pages/search/Search";
import ShopPage from "../pages/shop/ShopPage";
import SingleProduct from "../pages/shop/productDetails/SingleProduct";
import Login from "../components/Login";
import Register from "../components/Register";
import PaymentSuccess from "../components/PaymentSuccess";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import UserDashboardMain from "../pages/dashboard/user/dashboard/UserDashboardMain";
import UserOrders from "../pages/dashboard/user/Orders/UserOrders";
import OrderDetails from "../pages/dashboard/user/Orders/OrderDetails";
import UserPayments from "../pages/dashboard/user/payments/UserPayments";
import UserReviews from "../pages/dashboard/user/reviews/UserReviews";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Home /> },
            { path: '/categories/:categoryName', element: <CategoryPage /> },
            { path: '/search', element: <Search /> },
            { path: '/shop', element: <ShopPage /> },
            { path: '/shop/:id', element: <SingleProduct /> },
            { path: '/success', element: <PaymentSuccess /> },
            { path: '/orders/:orderId', element: <OrderDetails /> }
        ],
    },

    // authentication routes
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },

    // dashboard routes 
    {
        path: '/dashboard',
        element: <PrivateRoute> <DashboardLayout /> </PrivateRoute>,
        children: [
            // user routes
            { path: '', element: <UserDashboardMain /> },
            { path: 'orders', element: <UserOrders /> },
            { path: 'payments', element: <UserPayments /> },
            { path: 'profile', element: <div>User Profile</div> },
            { path: 'reviews', element: <UserReviews /> },

            // admin rotes
            { path: 'admin', element: <PrivateRoute role="admin"> <div>Admin Main</div> </PrivateRoute> },
            { path: 'add-new-post', element: <PrivateRoute role="admin"> <div>New Post</div> </PrivateRoute> },
            { path: 'manage-products', element: <PrivateRoute role="admin"> <div>Manage Post</div> </PrivateRoute> },
            { path: 'update-product/:id', element: <PrivateRoute role="admin"> <div>Update Post</div> </PrivateRoute> },
            { path: 'users', element: <PrivateRoute role="admin"> <div>All Users</div> </PrivateRoute> },
            { path: 'manage-orders', element: <PrivateRoute role="admin"> <div>Manage Orders</div> </PrivateRoute> },
        ]
    }
]);

export default router;