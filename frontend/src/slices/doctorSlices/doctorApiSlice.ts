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
  
} = doctorApiSlice;
