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
import ManageCustomer from "../Systems/ManageCustomer/ManageCustomer";
import ManageSupplier from "../Systems/ManageSupplier/ManageSupplier";
import ManageBrand from "../Systems/ManageBrand/ManageBrand";
import ManageCategory from "../Systems/ManageCategory/ManageCategory";
import ManageProduct from "../Systems/ManageProduct/ManageProduct";
import ManageProductVersion from "../Systems/ManageProductVersion/ManageProductVersion";
import ManageProductImage from "../Systems/ManageProductImage/ManageProductImage";
import BrandProductPage from "../pages/BrandProductPage/BrandProductPage";
import ManageOrder from "../Systems/ManageOrder/ManageOrder";
import ManageImportReceipt from "../Systems/ManageImportReceipt/ManageImportReceipt";
import ManageWarranty from "../Systems/ManageWarranty/ManageWarranty";
import ManageEmployee from "../Systems/ManageEmployee/ManageEmployee";
import ManagePromotion from "../Systems/ManagePromotion/ManagePromotion";
import UserPage from "../pages/UserPage/UserPage";
import PurchaseOrder from "../components/PurchaseOrder/PurchaseOrder";
import UserProfile from "../components/UserProfile/UserProfile";
import ChangePassword from "../components/ChangePassword/ChangePassword";


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
                path: "/brand/:id/:brandName",
                element: <BrandProductPage />
            },
            {
                path: "/cart",
                element: <CartPage />
            },
            {
                path: "/search/:keywordSearch",
                element: <SearchPage />
            },
            {
                path: "/user",
                element: <UserPage />,
                children: [
                    {
                        path: "/user/profile",
                        element: <UserProfile />,
                    },
                    {
                        path: "/user/purchase",
                        element: <PurchaseOrder />,
                    },
                    {
                        path: "/user/change-password",
                        element: <ChangePassword />,
                    }
                ]
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
                path: "/admin/manage-customer",
                element: <ManageCustomer />
            },
            {
                path: "/admin/manage-employee",
                element: <ManageEmployee />
            },
            {
                path: "/admin/manage-product",
                element: <ManageProduct />
            },
            {
                path: "/admin/manage-product-version",
                element: <ManageProductVersion />
            },
            {
                path: "/admin/manage-product-image",
                element: <ManageProductImage />
            },
            {
                path: "/admin/manage-order",
                element: <ManageOrder />
            },
            {
                path: "/admin/manage-import-receipt",
                element: <ManageImportReceipt />
            },
            {
                path: "/admin/manage-warranty",
                element: <ManageWarranty />
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
            {
                path: "/admin/manage-promition",
                element: <ManagePromotion />
            },
        ]
    }
]);

export default router;