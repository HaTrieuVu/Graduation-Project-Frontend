import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { STATUS } from '../utils/status';
import axios from 'axios';
import _ from "lodash";

const initialState = {
    searchProducts: [],
    searchProductsStatus: STATUS.IDLE,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSearch: (state) => {
            state.searchProducts = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAsyncSearchProduct.pending, (state) => {
                state.searchProductsStatus = STATUS.LOADING;
            })

            .addCase(fetchAsyncSearchProduct.fulfilled, (state, action) => {
                state.searchProducts = action.payload;
                state.searchProductsStatus = STATUS.SUCCEEDED;
            })

            .addCase(fetchAsyncSearchProduct.rejected, (state) => {
                state.searchProductsStatus = STATUS.FAILED;
            });
    },
});

export const fetchAsyncSearchProduct = createAsyncThunk('product-search/fetch', async (keywordSearch) => {
    const response = await axios.get(`/products/search?page=${1}&limit=${15}&keywordSearch=${keywordSearch}`)
    if (response?.data?.errorCode === 0 && !_.isEmpty(response?.data?.data)) {
        return response?.data?.data;
    }
});

export const { setSearchTerm, clearSearch } = searchSlice.actions;

export const getSearchProducts = (state) => state.search.searchProducts;
export const getSearchProductsStatus = (state) => state.search.searchProductsStatus;

export default searchSlice.reducer;
