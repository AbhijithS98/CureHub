import { apiSlice } from "../apiSlice";

const ADMIN_URL = "http://localhost:5000/api/admin";


export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    adminLogout: builder.mutation<void, void>({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method: "POST",
      }),
    }),
    adminListDoctors: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/list-doctors`,
        method: "GET",
      }),
    }),
    adminApproveDoctor: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/approve-doctor`,
        method: "POST",
        body: data,
      }),
    }),
    adminRejectDoctor: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/reject-doctor`,
        method: "POST",
        body: data,
      }),
    }),
    adminPassResetLink: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/pass-reset-link`,
        method: "POST",
        body: data,
      }),
    }),
    adminResetPassword: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
    adminListUsers: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/list-users`,
        method: "GET",
      }),
    }),
    adminBlockUser: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/block-user`,
        method: "POST",
        body: data,
      }),
    }),
    adminUnblockUser: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/unblock-user`,
        method: "POST",
        body: data,
      }),
    }),
  })
})

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAdminListDoctorsQuery,
  useAdminApproveDoctorMutation,
  useAdminRejectDoctorMutation,
  useAdminPassResetLinkMutation,
  useAdminResetPasswordMutation,
  useAdminListUsersQuery,
  useAdminBlockUserMutation,
  useAdminUnblockUserMutation,
  
} = adminApiSlice;

