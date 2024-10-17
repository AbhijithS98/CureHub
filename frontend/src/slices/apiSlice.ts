import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

let baseQuery = fetchBaseQuery({ baseUrl : ''})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => ({})
})