import { configureStore } from '@reduxjs/toolkit'

import sidebarReducer from './sidebarSlice';
import categoryReducer from './categorySlice';
import productReducer from './productSlice';
import brandReducer from './brandSlice';
import userReducer from "./userSlice"



export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    category: categoryReducer,
    product: productReducer,
    brand: brandReducer,
    userInfo: userReducer
  },
})
