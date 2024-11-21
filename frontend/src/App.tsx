import './App.css'
import "react-toastify/dist/ReactToastify.css";
import Header from './components/Header';
import DoctorHeader from './components/doctorComponents/DoctorHeader';
import AdminHeader from './components/adminComponents/AdminHeader';
import Footer from './screens/Footer';
import { Outlet, useLocation  } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { RootState } from './store.js';
import { useSelector } from "react-redux";
import NotificationHandler from './components/NotificationHandler';

const App: React.FC = () => {
  let location = useLocation();
  let isAdminPage = location.pathname.startsWith("/admin");
  let isDoctorPage = location.pathname.startsWith("/doctor");

  let isDoctorAuthPage = ["/doctor/login", "/doctor/register", "/doctor/otp"].includes(location.pathname);

  const { doctorInfo } = useSelector((state: RootState) => state.doctorAuth);



  return (
    <>
     { doctorInfo || isDoctorPage && !isDoctorAuthPage ? (
        <DoctorHeader />
      ) : isAdminPage ? (
        <AdminHeader />
      ) : (
        <Header />
      )}
     <ToastContainer />
     <NotificationHandler />
     <Container className="my-2">
        <Outlet />
      </Container>
      {!isAdminPage && <Footer />} 
    </>
  )
}

export default App
