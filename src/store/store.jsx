import { configureStore } from '@reduxjs/toolkit'

import sidebarReducer from './sidebarSlice';
import categoryReducer from './categorySlice';
import userReducer from "./userSlice"


export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    category: categoryReducer,
    userInfo: userReducer
  },
})
