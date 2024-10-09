import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeScreen from './screens/userScreens/HomeScreen';
import RegisterScreen from './screens/userScreens/RegisterScreen';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<HomeScreen />}></Route>
      <Route path="/register" element={<RegisterScreen />}></Route>
    </Route>
  )
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)


