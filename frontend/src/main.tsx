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
        <Route path="profile" element={<UserProtectedRoute><ProfileScreen /></UserProtectedRoute>}/>
        <Route path="book-slot" element={<UserProtectedRoute><AppointmentBookingScreen /></UserProtectedRoute>}/>
        <Route path="payment" element={<UserProtectedRoute><PaymentScreen /></UserProtectedRoute>}/>
        <Route path="thank-you" element={<UserProtectedRoute><ThankyouScreen /></UserProtectedRoute>}/>
        <Route path="wallet" element={<UserProtectedRoute><WalletScreen /></UserProtectedRoute>}/>
      </Route>

      {/* Doctor Routes */}
      <Route path="doctor">
        <Route path="register" element={<DoctorRegisterScreen />}></Route>
        <Route path="otp" element={<DoctorOtpScreen />}></Route>
        <Route path="reg-confirm" element={<ConfirmationScreen />}></Route>
        <Route path="login" element={<DoctorLoginScreen />}></Route>
        <Route path="forgot-password" element={<DoctorForgotPassScreen />}></Route>
        <Route path="reset-password" element={<DoctorResetPassScreen />}></Route>
        <Route path="profile" element={<DoctorProtectedRoute><DoctorProfileScreen /></DoctorProtectedRoute>}/>
        <Route path="availabilities" element={<DoctorProtectedRoute><DoctorAvailabilityScreen /></DoctorProtectedRoute>}/>
        <Route path="add-prescription" element={<DoctorProtectedRoute><AddPrescription /></DoctorProtectedRoute>}/>
        <Route path="view-prescription/:prescriptionId" element={<DoctorProtectedRoute><ViewPrescription /></DoctorProtectedRoute>}/>
      </Route>

      {/* Admin Routes */}
      <Route path="admin">
        <Route path="login" element={<AdminLoginScreen />}></Route>
        <Route path="forgot-password" element={<AdminForgotPassScreen />}></Route>
        <Route path="reset-password" element={<AdminResetPassScreen />}></Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoute/>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="list-unapproved-doctors" element={<ManageDoctorRequests />} />
          <Route path="doctor-details" element={<AdminDoctorDetailsScreen />} />
          <Route path="list-users" element={<AdminManageUsers />} />
          <Route path="list-doctors" element={<AdminManageDoctors />} />
          <Route path="doctors-appointments" element={<AllDoctorsAppointments />} />
          
        </Route>

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


