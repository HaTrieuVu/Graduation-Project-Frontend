import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from '../config/axios';
import { STATUS } from '../utils/status';
import _ from "lodash";

const initialState = {
    brands: [],
    brandsStatus: STATUS.IDLE,
    brandProducts: [],
    brandProductsStatus: STATUS.IDLE,
};

const brandSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAsyncProductOfBrand.pending, (state) => {
                state.brandProductsStatus = STATUS.LOADING;
            })
            .addCase(fetchAsyncProductOfBrand.fulfilled, (state, action) => {
                state.brandProducts = action.payload;
                state.brandProductsStatus = STATUS.SUCCEEDED;
            })
            .addCase(fetchAsyncProductOfBrand.rejected, (state) => {
                state.brandProductsStatus = STATUS.FAILED;
            });
    },
});

export const fetchAsyncProductOfBrand = createAsyncThunk('brand-product/fetch', async (brandId) => {
    try {
        let response = await axios.get(`/api/v1/product/brand/${brandId}`)
        if (response?.errorCode === 0 && !_.isEmpty(response?.data)) {
            return response?.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching product of brand", error);
        return [];
    }


});

export const getAllProductsByBrand = (state) => state.brand.brandProducts;
export const getBrandProductsStatus = (state) => state.brand.brandProductsStatus;

export default brandSlice.reducer;