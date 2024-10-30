import { apiSlice } from "../apiSlice";

const DOCTOR_URL = "http://localhost:5000/api/doctors";

export const doctorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    doctorRegister: builder.mutation({
      query: (formData) => ({
        url: `${DOCTOR_URL}/register`,
        method: "POST",
        body: formData,
      }),
    }),
    doctorVerifyOtp: builder.mutation({
      query: (data) => ({
        url: `${DOCTOR_URL}/verify-otp`,
        method: "POST",
        body: data,
      }),
    }),
    doctorResendOtp: builder.mutation({
      query: (data) => ({
        url: `${DOCTOR_URL}/resend-otp`,
        method: "POST",
        body: data,
      }),
    }),
    doctorLogin: builder.mutation({
      query: (data) => ({
        url: `${DOCTOR_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    doctorLogout: builder.mutation<void, void>({
      query: () => ({
        url: `${DOCTOR_URL}/logout`,
        method: "POST",
      }),
    }),
    doctorPassResetLink: builder.mutation({
      query: (data) => ({
        url: `${DOCTOR_URL}/pass-reset-link`,
        method: "POST",
        body: data,
      }),
    }),
    doctorResetPassword: builder.mutation({
      query: (data) => ({
        url: `${DOCTOR_URL}/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
    doctorGetProfile: builder.query({
      query: (email:string) => ({
        url: `${DOCTOR_URL}/get-profile?email=${email}`,
        method: "GET",
      }),
    }),
    doctorUpdateProfile: builder.mutation({
      query: (updatedData) => ({
        url: `${DOCTOR_URL}/update-profile`,  
        method: "PUT",
        body: updatedData,
      }),
    }),
    doctorAddSlots: builder.mutation({
      query: ({ docEmail, newSlots }) => ({
        url: `${DOCTOR_URL}/add-slots?email=${docEmail}`,  
        method: "PUT",
        body: {newSlots},
      }),
    }),
    doctorDeleteSlot: builder.mutation({
      query: ({slotId, docEmail}) => ({
        url: `${DOCTOR_URL}/delete-slot`,  
        method: "DELETE",
        body: {slotId, docEmail},
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
  useDoctorUpdateProfileMutation,
  useDoctorAddSlotsMutation,
  useDoctorDeleteSlotMutation,

} = doctorApiSlice;
