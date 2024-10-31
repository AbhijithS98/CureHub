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
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/resend-otp`,
        method: "POST",
        body: data,
      }),
    }),
    PassResetLink: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/pass-reset-link`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
    userListDoctors: builder.query({
      query: () => ({
        url: `${USER_URL}/list-doctors`,
        method: "GET",
      }),
    }),
    userGetDocSpecializations: builder.query({
      query: () => ({
        url: `${USER_URL}/get-doc-specializations`,
        method: "GET",
      }),
    }),
    userViewDoctor: builder.query({
      query: (email:string) => ({
        url: `${USER_URL}/view-doctor?email=${email}`,
        method: "GET",
      }),
    }),
    userGetProfile: builder.query({
      query: (email:string) => ({
        url: `${USER_URL}/get-profile?email=${email}`,
        method: "GET",
      }),
    }),
    userUpdateProfile: builder.mutation({
      query: (updatedData) => ({
        url: `${USER_URL}/update-profile`,  
        method: "PUT",
        body: updatedData,
      }),
    }),
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useLogoutMutation,
  useResendOtpMutation,
  usePassResetLinkMutation,
  useResetPasswordMutation,
  useUserListDoctorsQuery,
  useUserGetDocSpecializationsQuery,
  useUserViewDoctorQuery,
  useUserGetProfileQuery,
  useUserUpdateProfileMutation,

} = userApiSlice;
