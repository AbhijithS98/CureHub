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
import HomeScreen from './screens/userScreens/HomeScreen';
import RegisterScreen from './screens/userScreens/RegisterScreen';
import OtpScreen from './screens/userScreens/OtpScreen';
import LoginScreen from './screens/userScreens/LoginScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<HomeScreen />}></Route>
      <Route path="/register" element={<RegisterScreen />}></Route>
      <Route path="/otp" element={<OtpScreen />}></Route>
      <Route path="/login" element={<LoginScreen />}></Route>
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


