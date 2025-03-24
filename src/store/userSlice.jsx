import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setInfoUser: (state, action) => {
            state.user = action.payload
        }
    },
});

export const { setInfoUser } = userSlice.actions;

export default userSlice.reducer;
