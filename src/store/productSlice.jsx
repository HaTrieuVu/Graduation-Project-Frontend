import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from '../config/axios';
import { STATUS } from '../utils/status';
import _ from "lodash";
import { toast } from 'react-toastify';

const initialState = {
    products: {},
    productsStatus: STATUS.IDLE,
    productSingle: [],
    productSingleStatus: STATUS.IDLE,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAsyncProducts.pending, (state) => {
                state.productsStatus = STATUS.LOADING;
            })
            .addCase(fetchAsyncProducts.fulfilled, (state, action) => {
                state.productsStatus = STATUS.SUCCEEDED;
                state.products = action.payload;
            })
            .addCase(fetchAsyncProducts.rejected, (state) => {
                state.productsStatus = STATUS.FAILED;
            });

        builder
            .addCase(fetchAsyncProductSingle.pending, (state) => {
                state.productSingleStatus = STATUS.LOADING;
            })
            .addCase(fetchAsyncProductSingle.fulfilled, (state, action) => {
                state.productSingleStatus = STATUS.SUCCEEDED;
                state.productSingle = action.payload;
            })
            .addCase(fetchAsyncProductSingle.rejected, (state) => {
                state.productSingleStatus = STATUS.FAILED;
            });
    },
});

// Lấy ds sản phẩm theo phân trang (giới hạn)
export const fetchAsyncProducts = createAsyncThunk("products/fetch", async ({ page, limitProduct, valueFilter }) => {
    try {
        const response = await axios.get(`/api/v1/products/get-all?page=${page}&limit=${limitProduct}&valueFilter=${valueFilter}`);
        if (response?.errorCode === 0 && response?.data?.products?.length > 0) {
            return response?.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
});


// lấy thông tin chi tiết của 1 sản phẩm theo id
export const fetchAsyncProductSingle = createAsyncThunk('product-single/fetch', async (id) => {
    try {
        const response = await axios.get(`/api/v1/product-single?id=${id}`);
        if (response?.errorCode === 0 && !_.isEmpty(response?.data)) {
            return response?.data;
        } else {
            response?.errorMessage === "Người dùng chưa đăng nhập!" && toast.error("Bạn chưa đăng nhập. Hãy đăng nhập...")
        }
        return [];
    } catch (error) {
        console.error("Error fetching products singer:", error);
        return [];
    }

});

export const getAllProducts = (state) => state.product.products;
export const getAllProductsStatus = (state) => state.product.productsStatus;

export const getProductSingle = (state) => state.product.productSingle;
export const getSingleProductStatus = (state) => state.product.productSingleStatus;
export default productSlice.reducer;
