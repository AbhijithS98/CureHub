import './App.css'
import "react-toastify/dist/ReactToastify.css";
import Header from './components/Header';
import UserHeader from './components/userComponents/UserHeader';
import DoctorHeader from './components/doctorComponents/DoctorHeader';
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";


const App: React.FC = () => {
  const location = useLocation();
  const isUserPage = location.pathname.startsWith("/user");
  const isDoctorPage = location.pathname.startsWith("/doctor")

  return (
    <>
     {isUserPage ? (
        <UserHeader />
      ) : isDoctorPage ? (
        <DoctorHeader />
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
