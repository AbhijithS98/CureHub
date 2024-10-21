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
import HomeScreen from './screens/userScreens/HomeScreen';
import RegisterScreen from './screens/userScreens/RegisterScreen';
import OtpScreen from './screens/userScreens/OtpScreen';
import LoginScreen from './screens/userScreens/LoginScreen';
import ForgotPasswordScreen from './screens/userScreens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/userScreens/ResetPasswordScreen';
{/* Doctor screens imports */}
import DoctorRegisterScreen from './screens/doctorScreens/RegisterScreen';
import DoctorOtpScreen from './screens/doctorScreens/OtpScreen';
import ConfirmationScreen from './screens/doctorScreens/ConfirmationScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<HomeScreen />}></Route>

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


