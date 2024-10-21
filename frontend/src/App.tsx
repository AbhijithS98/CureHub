import './App.css'
import "react-toastify/dist/ReactToastify.css";
import Header from './components/Header';
import UserHeader from './components/userComponents/UserHeader';
import DoctorHeader from './components/doctorComponents/DoctorHeader';
import AdminHeader from './components/adminComponents/AdminHeader';
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";


const App: React.FC = () => {
  const location = useLocation();
  const isUserPage = location.pathname.startsWith("/user");
  const isDoctorPage = location.pathname.startsWith("/doctor")
  const isAdminPage = location.pathname.startsWith("/admin")

  return (
    <>
     {isUserPage ? (
        <UserHeader />
      ) : isDoctorPage ? (
        <DoctorHeader />
      ) : isAdminPage ? (
        <AdminHeader />
      ) : (
        <Header />
      )}
     <ToastContainer />
     <Container className="my-2">
        <Outlet />
      </Container>
    </>
  )
}

export default App
