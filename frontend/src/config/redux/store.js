/**
 * 
 * STEPS for State management 
 * submit Action
 * handle acrion in its reducer
 * Register here -> Reducer
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer"

export const store = configureStore({
    reducer: {
        auth: authReducer
    }
})