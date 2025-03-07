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
import UserProfile from "../pages/dashboard/user/profile/UserProfile";
import AdminDashboardMain from "../pages/dashboard/admin/dashboard/AdminDashboardMain";
import AddProduct from "../pages/dashboard/admin/addProduct/AddProduct";
import ManageProduct from "../pages/dashboard/admin/manageProduct/ManageProduct";
import UpdateProduct from "../pages/dashboard/admin/manageProduct/UpdateProduct";
import ManageUsers from "../pages/dashboard/admin/users/ManageUsers";
import ManageOrders from "../pages/dashboard/admin/manageOrders/ManageOrders";

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
            { path: 'profile', element: <UserProfile /> },
            { path: 'reviews', element: <UserReviews /> },

            // admin routes
            { path: 'admin', element: <PrivateRoute role="admin"> <AdminDashboardMain /> </PrivateRoute> },
            { path: 'add-product', element: <PrivateRoute role="admin"> <AddProduct /> </PrivateRoute> },
            { path: 'manage-products', element: <PrivateRoute role="admin"> <ManageProduct /> </PrivateRoute> },
            { path: 'update-product/:id', element: <PrivateRoute role="admin"> <UpdateProduct /> </PrivateRoute> },
            { path: 'users', element: <PrivateRoute role="admin"> <ManageUsers /> </PrivateRoute> },
            { path: 'manage-orders', element: <PrivateRoute role="admin"> <ManageOrders /> </PrivateRoute> },
        ]
    }
]);

export default router;