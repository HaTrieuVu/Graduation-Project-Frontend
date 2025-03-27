import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from '../config/axios';
import { STATUS } from '../utils/status';
import _ from "lodash";

const initialState = {
    carts: [],
    cartsStatus: STATUS.IDLE,
    itemsCount: 0,
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        //lấy tổng tiền và số lượng sp trong giỏ hàng
        getCartTotal: (state) => {
            state.totalAmount = state.carts?.cartDetails?.reduce((cartTotal, cartItem) => {
                return (cartTotal += cartItem?.productVersions?.fGiaBan);
            }, 0);

            state.itemsCount = state.carts?.cartDetails?.length;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAsyncCarts.pending, (state) => {
                state.cartsStatus = STATUS.LOADING;
            })
            .addCase(fetchAsyncCarts.fulfilled, (state, action) => {
                state.carts = action.payload;
                state.cartsStatus = STATUS.SUCCEEDED;
            })
            .addCase(fetchAsyncCarts.rejected, (state) => {
                state.cartsStatus = STATUS.FAILED;
            });
    }
});

export const fetchAsyncCarts = createAsyncThunk('carts/fetch', async (data) => {
    try {
        let response = await axios.post("/api/v1/cart/get-info-to-cart", data);

        if (response?.errorCode === 0 && !_.isEmpty(response?.data)) {
            return response?.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching carts product", error);
        return [];
    }
});

export const {
    getCartTotal,
} = cartSlice.actions;

export const getAllCarts = (state) => state.cart.carts;
export const getCartItemsCount = (state) => state.cart.itemsCount;

export default cartSlice.reducer;