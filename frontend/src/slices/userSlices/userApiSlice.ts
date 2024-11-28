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
      query: (formData) => ({
        url: `/users/register`,
        method: "POST",
        body: formData,
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
      query: (formData) => ({
        url: `/users/update-profile`,  
        method: "PUT",
        body: formData,
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
    userCancelBooking: builder.mutation({
      query: (data) => ({
        url: `/users/cancel-booking`,  
        method: "PUT",
        body: data,
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
    userGetWalletTransactions: builder.query({
      query: () => ({
        url: `/users/get-wallet-payments`,
        method: "GET",
      }),
    }),
    userFetchDoctorReviews: builder.query({
      query: (doctorId: string) => ({
        url: `/users/get-doctor-reviews?docId=${doctorId}`,
        method: "GET",
      }),
    }),
    userAddDoctorReview: builder.mutation({
      query: (data) => ({
        url: `/users/add-review`,
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
  useUserCancelBookingMutation,
  useUserGetAppointmentsQuery,
  useUserWalletRechargeMutation,
  useUserGetWalletQuery,
  useUserGetWalletTransactionsQuery,
  useUserFetchDoctorReviewsQuery,
  useUserAddDoctorReviewMutation,

} = userApiSlice;
