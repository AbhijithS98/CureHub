import { apiSlice } from "../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `/users/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `/users/register`,
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `/users/verify-otp`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `/users/logout`,
        method: "POST",
      }),
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: `/users/resend-otp`,
        method: "POST",
        body: data,
      }),
    }),
    PassResetLink: builder.mutation({
      query: (data) => ({
        url: `/users/pass-reset-link`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/users/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
    userListDoctors: builder.query({
      query: () => ({
        url: `/users/list-doctors`,
        method: "GET",
      }),
    }),
    userGetDocSpecializations: builder.query({
      query: () => ({
        url: `/users/get-doc-specializations`,
        method: "GET",
      }),
    }),
    userViewDoctor: builder.query({
      query: (email:string) => ({
        url: `/users/view-doctor?email=${email}`,
        method: "GET",
      }),
    }),
    userGetProfile: builder.query({
      query: (email:string) => ({
        url: `/users/get-profile?email=${email}`,
        method: "GET",
      }),
    }),
    userUpdateProfile: builder.mutation({
      query: (updatedData) => ({
        url: `/users/update-profile`,  
        method: "PUT",
        body: updatedData,
      }),
    }),
    userRefreshToken: builder.mutation({
      query: () => ({
        url: '/users/refresh-token',
        method: 'POST',
      }),
    }),
    userBookSlot: builder.mutation({
      query: (bookingDetails) => ({
        url: `/users/book-slot`,  
        method: "PUT",
        body: bookingDetails,
      }),
    }),
    userGetAppointments: builder.query({
      query: () => ({
        url: `/users/get-appointments`,
        method: "GET",
      }),
    }),
    userWalletRecharge: builder.mutation({
      query: (data) => ({
        url: `/users/wallet-recharge`,
        method: "POST",
        body: data,
      }),
    }),
    userGetWallet: builder.query({
      query: () => ({
        url: `/users/get-wallet`,
        method: "GET",
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
  useUserRefreshTokenMutation,
  useUserBookSlotMutation,
  useUserGetAppointmentsQuery,
  useUserWalletRechargeMutation,
  useUserGetWalletQuery,

} = userApiSlice;
