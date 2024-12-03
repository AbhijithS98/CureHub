import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from './store'
import App from './App'
import { ROUTES } from './router';
import 'bootstrap/dist/css/bootstrap.min.css';

{/* Protected route components */}
import UserProtectedRoute from './components/userComponents/UserProtect';
import AdminProtectedRoute from './components/adminComponents/AdminProtect';
import DoctorProtectedRoute from './components/doctorComponents/DoctorProtect';

{/* User screens imports */}
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/userScreens/RegisterScreen';
import OtpScreen from './screens/userScreens/OtpScreen';
import LoginScreen from './screens/userScreens/LoginScreen';
import ForgotPasswordScreen from './screens/userScreens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/userScreens/ResetPasswordScreen';
import DoctorListingScreen from './screens/userScreens/DoctorListingScreen';
import ViewDoctorScreen from './screens/userScreens/ViewDoctorScreen';
import ProfileScreen from './screens/userScreens/ProfileScreen';
import AppointmentBookingScreen from './screens/userScreens/BookAppointmentScreen';
import PaymentScreen from './screens/userScreens/PaymentScreen';
import ThankyouScreen from './screens/userScreens/ThankYouScreen';
import WalletScreen from './screens/userScreens/WalletScreen';
import UserViewPrescription from './screens/userScreens/ViewPrescriptionScreen';
import ChatScreen from './screens/userScreens/ChatScreen';

{/* Doctor screens imports */}
import DoctorRegisterScreen from './screens/doctorScreens/RegisterScreen';
import DoctorOtpScreen from './screens/doctorScreens/OtpScreen';
import ConfirmationScreen from './screens/doctorScreens/ConfirmationScreen';
import DoctorLoginScreen from './screens/doctorScreens/LoginScreen';
import DoctorForgotPassScreen from './screens/doctorScreens/ForgotPassScreen'
import DoctorResetPassScreen from './screens/doctorScreens/ResetPassScreen';
import DoctorProfileScreen from './screens/doctorScreens/ProfileScreen';
import DoctorAvailabilityScreen from './screens/doctorScreens/SetAvailabilityScreen';
import AddPrescription from './screens/doctorScreens/AddPrescription';
import ViewPrescription from './screens/doctorScreens/ViewPrescription';
import DoctorChatList from './screens/doctorScreens/DoctorChatList';

{/* Admin screens imports */}
import AdminLoginScreen from './screens/adminScreens/LoginScreen';
import AdminDashboard from './screens/adminScreens/Dashboard';
import ManageDoctorRequests from './screens/adminScreens/ManageDoctorRequests';
import AdminForgotPassScreen from './screens/adminScreens/ForgotPassScreen';
import AdminResetPassScreen from './screens/adminScreens/ResetPassScreen';
import AdminDoctorDetailsScreen from './screens/adminScreens/DoctorDetails';
import AdminManageUsers from './screens/adminScreens/ManageUsers';
import AdminManageDoctors from './screens/adminScreens/ManageDoctors';
import AllDoctorsAppointments from './screens/adminScreens/AllDoctorsAppointments';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={ROUTES.HOME} element={<App />}>
      <Route index element={<HomeScreen />} />
      <Route path={ROUTES.LIST_DOCTORS} element={<DoctorListingScreen />} />
      <Route path={ROUTES.VIEW_DOCTOR} element={<ViewDoctorScreen />} />

      {/* User Routes */}
      <Route path={ROUTES.USER.REGISTER} element={<RegisterScreen />} />
      <Route path={ROUTES.USER.OTP} element={<OtpScreen />} />
      <Route path={ROUTES.USER.LOGIN} element={<LoginScreen />} />
      <Route path={ROUTES.USER.FORGOT_PASSWORD} element={<ForgotPasswordScreen />} />
      <Route path={ROUTES.USER.RESET_PASSWORD} element={<ResetPasswordScreen />} />
      <Route path={ROUTES.USER.PROFILE} element={<UserProtectedRoute><ProfileScreen /></UserProtectedRoute>} />
      <Route path={ROUTES.USER.BOOK_SLOT} element={<UserProtectedRoute><AppointmentBookingScreen /></UserProtectedRoute>} />
      <Route path={ROUTES.USER.PAYMENT} element={<UserProtectedRoute><PaymentScreen /></UserProtectedRoute>} />
      <Route path={ROUTES.USER.THANK_YOU} element={<UserProtectedRoute><ThankyouScreen /></UserProtectedRoute>} />
      <Route path={ROUTES.USER.WALLET} element={<UserProtectedRoute><WalletScreen /></UserProtectedRoute>} />
      <Route path={ROUTES.USER.VIEW_PRESCRIPTION(':preId')} element={<UserProtectedRoute><UserViewPrescription /></UserProtectedRoute>} />
      <Route path={ROUTES.USER.CHAT} element={<UserProtectedRoute><ChatScreen /></UserProtectedRoute>} />

      {/* Doctor Routes */}
      <Route path={ROUTES.DOCTOR.REGISTER} element={<DoctorRegisterScreen />} />
      <Route path={ROUTES.DOCTOR.OTP} element={<DoctorOtpScreen />} />
      <Route path={ROUTES.DOCTOR.REG_CONFIRM} element={<ConfirmationScreen />} />
      <Route path={ROUTES.DOCTOR.LOGIN} element={<DoctorLoginScreen />} />
      <Route path={ROUTES.DOCTOR.FORGOT_PASSWORD} element={<DoctorForgotPassScreen />} />
      <Route path={ROUTES.DOCTOR.RESET_PASSWORD} element={<DoctorResetPassScreen />} />
      <Route path={ROUTES.DOCTOR.PROFILE} element={<DoctorProtectedRoute><DoctorProfileScreen /></DoctorProtectedRoute>} />
      <Route path={ROUTES.DOCTOR.AVAILABILITIES} element={<DoctorProtectedRoute><DoctorAvailabilityScreen /></DoctorProtectedRoute>} />
      <Route path={ROUTES.DOCTOR.ADD_PRESCRIPTION} element={<DoctorProtectedRoute><AddPrescription /></DoctorProtectedRoute>} />
      <Route path={ROUTES.DOCTOR.VIEW_PRESCRIPTION(':preId')} element={<DoctorProtectedRoute><ViewPrescription /></DoctorProtectedRoute>} />
      <Route path={ROUTES.DOCTOR.CHAT_LIST(':doctorId')} element={<DoctorProtectedRoute><DoctorChatList /></DoctorProtectedRoute>} />
      <Route path={ROUTES.DOCTOR.SINGLE_CHAT} element={<DoctorProtectedRoute><ChatScreen /></DoctorProtectedRoute>} />

      {/* Admin Routes */}
      <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLoginScreen />} />
      <Route path={ROUTES.ADMIN.FORGOT_PASSWORD} element={<AdminForgotPassScreen />} />
      <Route path={ROUTES.ADMIN.RESET_PASSWORD} element={<AdminResetPassScreen />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN.LIST_UNAPPROVED_DOCTORS} element={<ManageDoctorRequests />} />
        <Route path={ROUTES.ADMIN.DOCTOR_DETAILS} element={<AdminDoctorDetailsScreen />} />
        <Route path={ROUTES.ADMIN.LIST_USERS} element={<AdminManageUsers />} />
        <Route path={ROUTES.ADMIN.LIST_DOCTORS} element={<AdminManageDoctors />} />
        <Route path={ROUTES.ADMIN.DOCTORS_APPOINTMENTS} element={<AllDoctorsAppointments />} />
      </Route>
    </Route>
  )
) 

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
  </Provider>
 
)


