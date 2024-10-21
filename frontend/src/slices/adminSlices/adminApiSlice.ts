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
  })
})

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAdminListDoctorsQuery,
  useAdminApproveDoctorMutation,
  useAdminRejectDoctorMutation,
  
} = adminApiSlice;

