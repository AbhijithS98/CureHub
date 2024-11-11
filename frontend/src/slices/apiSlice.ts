import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store.js';

let baseQuery = fetchBaseQuery({ 
    baseUrl : 'http://localhost:5000/api',
    credentials: 'include',
})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['User','Doctor','Admin'],
    endpoints: (builder) => ({})
})

