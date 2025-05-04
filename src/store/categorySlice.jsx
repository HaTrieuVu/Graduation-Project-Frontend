import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from '../config/axios';
import { STATUS } from '../utils/status';
import _ from "lodash";

const initialState = {
    categories: [],
    categoriesStatus: STATUS.IDLE,
    categoryProducts: [],
    categoryProductsStatus: STATUS.IDLE,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAsyncCategories.pending, (state) => {
                state.categoriesStatus = STATUS.LOADING;
            })
            .addCase(fetchAsyncCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.categoriesStatus = STATUS.SUCCEEDED;
            })
            .addCase(fetchAsyncCategories.rejected, (state) => {
                state.categoriesStatus = STATUS.FAILED;
            });

        builder
            .addCase(fetchAsyncProductsOfCategory.pending, (state) => {
                state.categoryProductsStatus = STATUS.LOADING;
            })
            .addCase(fetchAsyncProductsOfCategory.fulfilled, (state, action) => {
                state.categoryProducts = action.payload;
                state.categoryProductsStatus = STATUS.SUCCEEDED;
            })
            .addCase(fetchAsyncProductsOfCategory.rejected, (state) => {
                state.categoryProductsStatus = STATUS.FAILED;
            });
    },
});

export const fetchAsyncCategories = createAsyncThunk('categories/fetch', async () => {
    try {
        let response = await axios.get("/api/v1/manage-category/get-all")
        if (response?.errorCode === 0 && response?.data?.length > 0) {
            return response?.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching category product", error);
        return [];
    }

});

export const fetchAsyncProductsOfCategory = createAsyncThunk('category-products/fetch', async ({ categoryId, currentPage, limitProduct }) => {
    try {
        let response = await axios.get(`/api/v1/category/product-of-category?categoryId=${categoryId}&page=${currentPage}&limit=${limitProduct}`)
        if (response?.errorCode === 0 && !_.isEmpty(response?.data)) {
            return response?.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching  of category", error);
        return [];
    }
});

export const getAllCategories = (state) => state.category.categories;
export const getAllProductsByCategory = (state) => state.category.categoryProducts;
export const getCategoryProductsStatus = (state) => state.category.categoryProductsStatus;

export default categorySlice.reducer;
