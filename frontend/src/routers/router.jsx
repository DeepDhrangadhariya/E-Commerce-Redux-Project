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
            { path: '/success', element: <PaymentSuccess /> }
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
            { path: 'orders', element: <div>User Orders</div> },
            { path: 'payments', element: <div>User Payments</div> },
            { path: 'profile', element: <div>User Profile</div> },
            { path: 'reviews', element: <div>User Reviews</div> },

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