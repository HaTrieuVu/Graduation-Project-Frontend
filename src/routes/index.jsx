import { createBrowserRouter } from "react-router-dom";


import HomePage from "../pages/HomePage/HomePage";
import ProductSinglePage from "../pages/ProductSinglePage/ProductSinglePage";
import CartPage from "../pages/CartPage/CartPage";
import SearchPage from "../pages/SearchPage/SearchPage";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import App from "../App";
import NotFound from "../components/NotFound/NotFound";
import AdminPage from "../pages/AdminPage/AdminPage";
import HomeAdmin from "../Systems/HomeAdmin/HomeAdmin";
import ManageUser from "../Systems/ManageUser/ManageUser";
import ManageSupplier from "../Systems/ManageSupplier/ManageSupplier";
import ManageBrand from "../Systems/ManageBrand/ManageBrand";
import ManageCategory from "../Systems/ManageCategory/ManageCategory";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <HomePage />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/product/:id",
                element: <ProductSinglePage />
            },
            {
                path: "/cart",
                element: <CartPage />
            },
            {
                path: "/search/:searchTerm",
                element: <SearchPage />
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    },
    {
        path: "/admin",
        element: <AdminPage />,
        children: [
            {
                path: "",
                element: <HomeAdmin />
            },
            {
                path: "/admin/manage-user",
                element: <ManageUser />
            },
            {
                path: "/admin/manage-supplier",
                element: <ManageSupplier />
            },
            {
                path: "/admin/manage-brand",
                element: <ManageBrand />
            },
            {
                path: "/admin/manage-category",
                element: <ManageCategory />
            },
        ]
    }
]);

export default router;