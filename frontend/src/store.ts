import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice"; 
import userAuthReducer from './slices/userSlices/userAuthSlice.js'
import adminAuthReducer from './slices/adminSlices/adminAuthSlice.js'
import doctorAuthReducer from './slices/doctorSlices/doctorAuthSlice.js'


const store = configureStore({
  reducer: {
    userAuth : userAuthReducer,
    adminAuth : adminAuthReducer,
    doctorAuth : doctorAuthReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
