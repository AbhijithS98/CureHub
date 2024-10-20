import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice"; 
import userAuthReducer from './slices/userSlices/userAuthSlice.js'


const store = configureStore({
  reducer: {
    userAuth : userAuthReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
