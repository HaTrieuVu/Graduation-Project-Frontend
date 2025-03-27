import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isUserLoaded: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setInfoUser: (state, action) => {
            state.user = action.payload;
            state.isUserLoaded = true; // Đánh dấu đã tải xong user
        },
        clearUser: (state) => {
            state.user = null;
            state.isUserLoaded = true; // Đánh dấu đã kiểm tra user
        }
    },
});

export const { setInfoUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
