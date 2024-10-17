import { apiSlice } from "../apiSlice";

const USER_URL = "http://localhost:5000/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/verify-otp`,
        method: "POST",
        body: data,
      }),
    }),
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
} = userApiSlice;
