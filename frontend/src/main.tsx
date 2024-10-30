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
import 'bootstrap/dist/css/bootstrap.min.css';
{/* User screens imports */}
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/userScreens/RegisterScreen';
import OtpScreen from './screens/userScreens/OtpScreen';
import LoginScreen from './screens/userScreens/LoginScreen';
import ForgotPasswordScreen from './screens/userScreens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/userScreens/ResetPasswordScreen';
import DoctorListingScreen from './screens/userScreens/DoctorListingScreen';
import ViewDoctorScreen from './screens/userScreens/ViewDoctorScreen';
{/* Doctor screens imports */}
import DoctorRegisterScreen from './screens/doctorScreens/RegisterScreen';
import DoctorOtpScreen from './screens/doctorScreens/OtpScreen';
import ConfirmationScreen from './screens/doctorScreens/ConfirmationScreen';
import DoctorLoginScreen from './screens/doctorScreens/LoginScreen';
import DoctorDashboard from './screens/doctorScreens/DoctorDashboard';
import DoctorForgotPassScreen from './screens/doctorScreens/ForgotPassScreen'
import DoctorResetPassScreen from './screens/doctorScreens/ResetPassScreen';
import DoctorProfileScreen from './screens/doctorScreens/ProfileScreen';
{/* Admin screens imports */}
import AdminLoginScreen from './screens/adminScreens/LoginScreen';
import AdminDashboard from './screens/adminScreens/Dashboard';
import ManageDoctorRequests from './screens/adminScreens/ManageDoctorRequests';
import AdminForgotPassScreen from './screens/adminScreens/ForgotPassScreen';
import AdminResetPassScreen from './screens/adminScreens/ResetPassScreen';
import AdminDoctorDetailsScreen from './screens/adminScreens/DoctorDetails';
import AdminManageUsers from './screens/adminScreens/ManageUsers';
import AdminManageDoctors from './screens/adminScreens/ManageDoctors';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<HomeScreen />}></Route>
      <Route path="list-doctors" element={<DoctorListingScreen />}></Route>
      <Route path="view-doctor" element={<ViewDoctorScreen />}></Route>
      
      {/* User Routes */}
      <Route path="user">
        <Route path="register" element={<RegisterScreen />}></Route>
        <Route path="otp" element={<OtpScreen />}></Route>
        <Route path="login" element={<LoginScreen />}></Route>
        <Route path="forgot-password" element={<ForgotPasswordScreen />}></Route>
        <Route path="reset-password" element={<ResetPasswordScreen />}></Route>
      </Route>

      {/* Doctor Routes */}
      <Route path="doctor">
        <Route path="register" element={<DoctorRegisterScreen />}></Route>
        <Route path="otp" element={<DoctorOtpScreen />}></Route>
        <Route path="reg-confirm" element={<ConfirmationScreen />}></Route>
        <Route path="login" element={<DoctorLoginScreen />}></Route>
        <Route path="forgot-password" element={<DoctorForgotPassScreen />}></Route>
        <Route path="reset-password" element={<DoctorResetPassScreen />}></Route>
        <Route path="profile" element={<DoctorProfileScreen />}></Route>
      </Route>

      {/* Admin Routes */}
      <Route path="admin">
        <Route path="login" element={<AdminLoginScreen />}></Route>
        <Route path="dashboard" element={<AdminDashboard />}></Route>
        <Route path="list-unapproved-doctors" element={<ManageDoctorRequests />}></Route>
        <Route path="forgot-password" element={<AdminForgotPassScreen />}></Route>
        <Route path="reset-password" element={<AdminResetPassScreen />}></Route>
        <Route path="doctor-details" element={<AdminDoctorDetailsScreen />}></Route>
        <Route path="list-users" element={<AdminManageUsers />}></Route>
        <Route path="list-doctors" element={<AdminManageDoctors />}></Route>
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


