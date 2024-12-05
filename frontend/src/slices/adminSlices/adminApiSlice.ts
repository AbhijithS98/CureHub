import { apiSlice } from "../apiSlice";


export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `/admin/login`,
        method: "POST",
        body: data,
      }),
    }),
    adminLogout: builder.mutation<void, void>({
      query: () => ({
        url: `/admin/logout`,
        method: "POST",
      }),
    }),
    adminListDoctors: builder.query({
      query: () => ({
        url: `/admin/list-doctors`,
        method: "GET",
      }),
    }),
    adminListUnapprovedDoctors: builder.query({
      query: () => ({
        url: `/admin/list-unapproved-doctors`,
        method: "GET",
      }),
    }),
    adminApproveDoctor: builder.mutation({
      query: (data) => ({
        url: `/admin/approve-doctor`,
        method: "POST",
        body: data,
      }),
    }),
    adminRejectDoctor: builder.mutation({
      query: (data) => ({
        url: `/admin/reject-doctor`,
        method: "POST",
        body: data,
      }),
    }),
    adminPassResetLink: builder.mutation({
      query: (data) => ({
        url: `/admin/pass-reset-link`,
        method: "POST",
        body: data,
      }),
    }),
    adminResetPassword: builder.mutation({
      query: (data) => ({
        url: `/admin/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
    adminListUsers: builder.query({
      query: () => ({
        url: `/admin/list-users`,
        method: "GET",
      }),
    }),
    adminBlockUser: builder.mutation({
      query: (data) => ({
        url: `/admin/block-user`,
        method: "POST",
        body: data,
      }),
    }),
    adminUnblockUser: builder.mutation({
      query: (data) => ({
        url: `/admin/unblock-user`,
        method: "POST",
        body: data,
      }),
    }),
    adminBlockDoctor: builder.mutation({
      query: (data) => ({
        url: `/admin/block-doctor`,
        method: "POST",
        body: data,
      }),
    }),
    adminUnblockDoctor: builder.mutation({
      query: (data) => ({
        url: `/admin/unblock-doctor`,
        method: "POST",
        body: data,
      }),
    }),
    adminRefreshToken: builder.mutation({
      query: () => ({
        url: '/admin/refresh-token',
        method: 'POST',
      }),
    }),
    adminListAppointments: builder.query({
      query: () => ({
        url: `/admin/list-appointments`,
        method: "GET",
      }),
    }),
    adminStatsUsers: builder.query({
      query: () => ({
        url: `/admin/stats-users`,
        method: "GET",
      }),
    }),
    adminStatsDoctors: builder.query({
      query: () => ({
        url: `/admin/stats-doctors`,
        method: "GET",
      }),
    }),
    adminStatsAppointments: builder.query({
      query: () => ({
        url: `/admin/stats-appointments`,
        method: "GET",
      }),
    }),
    adminStatsRevenue: builder.query({
      query: () => ({
        url: `/admin/stats-revenue`,
        method: "GET",
      }),
    }),
    adminStatsRefund: builder.query({
      query: () => ({
        url: `/admin/stats-refund`,
        method: "GET",
      }),
    }),
    adminAppointmentsChart: builder.query({
      query: () => ({
        url: `/admin/appointments-chart-data`,
        method: "GET",
      }),
    }), 
    adminRevenueChart: builder.query({
      query: () => ({
        url: `/admin/revenue-chart-data`,
        method: "GET",
      }),
    }),
    adminAppointmentReport: builder.query({
      query: ({ startDate, endDate, doctorId, patientId }) => ({
        url: `/admin/appointment-report-data`,
        method: "GET",
        params: { startDate, endDate, doctorId, patientId },
      }),
    }),
    adminRevenueReport: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/admin/revenue-report-data`,
        method: "GET",
        params: { startDate, endDate },
      }),
    }),
  })
})

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAdminListDoctorsQuery,
  useAdminListUnapprovedDoctorsQuery,
  useAdminApproveDoctorMutation,
  useAdminRejectDoctorMutation,
  useAdminPassResetLinkMutation,
  useAdminResetPasswordMutation,
  useAdminListUsersQuery,
  useAdminBlockUserMutation,
  useAdminUnblockUserMutation,
  useAdminBlockDoctorMutation,
  useAdminUnblockDoctorMutation,
  useAdminRefreshTokenMutation,
  useAdminListAppointmentsQuery,
  useAdminStatsUsersQuery,
  useAdminStatsDoctorsQuery,
  useAdminStatsAppointmentsQuery,
  useAdminStatsRevenueQuery,
  useAdminStatsRefundQuery,
  useAdminAppointmentsChartQuery,
  useAdminRevenueChartQuery,
  useLazyAdminAppointmentReportQuery,
  useLazyAdminRevenueReportQuery
  
} = adminApiSlice;

