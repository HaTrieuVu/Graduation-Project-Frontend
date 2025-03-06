import { createBrowserRouter } from "react-router-dom";


import HomePage from "../pages/HomePage/HomePage";
import ProductSinglePage from "../pages/ProductSinglePage/ProductSinglePage";
import CartPage from "../pages/CartPage/CartPage";
import SearchPage from "../pages/SearchPage/SearchPage";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import App from "../App";


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
            }
        ]

    }
]);

export default router;