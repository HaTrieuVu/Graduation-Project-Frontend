import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { STATUS } from '../utils/status';
import _ from "lodash";

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
export const fetchAsyncProducts = createAsyncThunk("products/fetch", async ({ page, limitProduct }) => {
    const response = await axios.get(`/products/get-all?page=${page}&limit=${limitProduct}`);
    if (response?.data?.errorCode === 0 && response?.data?.data?.products?.length > 0) {
        return response?.data?.data;
    }
}
);

// lấy thông tin chi tiết của 1 sản phẩm theo id
export const fetchAsyncProductSingle = createAsyncThunk('product-single/fetch', async (id) => {
    const response = await axios.get(`/product-single?id=${id}`);
    if (response?.data?.errorCode === 0 && !_.isEmpty(response?.data?.data)) {
        return response?.data?.data;
    }
});

export const getAllProducts = (state) => state.product.products;
export const getAllProductsStatus = (state) => state.product.productsStatus;

export const getProductSingle = (state) => state.product.productSingle;
export const getSingleProductStatus = (state) => state.product.productSingleStatus;
export default productSlice.reducer;
