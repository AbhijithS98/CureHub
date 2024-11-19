import { apiSlice } from "../apiSlice";

export const doctorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    doctorRegister: builder.mutation({
      query: (formData) => ({
        url: `/doctors/register`,
        method: "POST",
        body: formData,
      }),
    }),
    doctorVerifyOtp: builder.mutation({
      query: (data) => ({
        url: `/doctors/verify-otp`,
        method: "POST",
        body: data,
      }),
    }),
    doctorResendOtp: builder.mutation({
      query: (data) => ({
        url: `/doctors/resend-otp`,
        method: "POST",
        body: data,
      }),
    }),
    doctorLogin: builder.mutation({
      query: (data) => ({
        url: `/doctors/login`,
        method: "POST",
        body: data,
      }),
    }),
    doctorLogout: builder.mutation<void, void>({
      query: () => ({
        url: `/doctors/logout`,
        method: "POST",
      }),
    }),
    doctorPassResetLink: builder.mutation({
      query: (data) => ({
        url: `/doctors/pass-reset-link`,
        method: "POST",
        body: data,
      }),
    }),
    doctorResetPassword: builder.mutation({
      query: (data) => ({
        url: `/doctors/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
    doctorGetProfile: builder.query({
      query: (email:string) => ({
        url: `/doctors/get-profile?email=${email}`,
        method: "GET",
      }),
    }),
    doctorGetAvailability: builder.query({
      query: (_id:string) => ({
        url: `/doctors/get-availability?_id=${_id}`,
        method: "GET",
      }),
    }),
    doctorUpdateProfile: builder.mutation({
      query: (updatedData) => ({
        url: `/doctors/update-profile`,  
        method: "PUT",
        body: updatedData,
      }),
    }),
    doctorAddSlots: builder.mutation({
      query: ({ docEmail, newSlots }) => ({
        url: `/doctors/add-slots?email=${docEmail}`,  
        method: "PUT",
        body: {newSlots},
      }),
    }),
    doctorDeleteSlot: builder.mutation({
      query: ({slotId, docEmail}) => ({
        url: `/doctors/delete-slot`,  
        method: "DELETE",
        body: {slotId, docEmail},
      }),
    }),
    doctorDeleteTimeSlot: builder.mutation({
      query: ({slotId, timeSlotId, docEmail}) => ({
        url: `/doctors/delete-timeSlot`,  
        method: "DELETE",
        body: {slotId, timeSlotId, docEmail},
      }),
    }),
    doctorRefreshToken: builder.mutation({
      query: () => ({
        url: '/doctors/refresh-token',
        method: 'POST',
      }),
    }),
  })
})

export const {
  useDoctorRegisterMutation,
  useDoctorVerifyOtpMutation,
  useDoctorResendOtpMutation,
  useDoctorLoginMutation,
  useDoctorLogoutMutation,
  useDoctorPassResetLinkMutation,
  useDoctorResetPasswordMutation,
  useDoctorGetProfileQuery,
  useDoctorGetAvailabilityQuery,
  useDoctorUpdateProfileMutation,
  useDoctorAddSlotsMutation,
  useDoctorDeleteSlotMutation,
  useDoctorDeleteTimeSlotMutation,
  useDoctorRefreshTokenMutation,

} = doctorApiSlice;
