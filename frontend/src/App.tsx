import './App.css'
import "react-toastify/dist/ReactToastify.css";
import Header from './components/Header';
import UserHeader from './components/userComponents/UserHeader';
import DoctorHeader from './components/doctorComponents/DoctorHeader';
import AdminHeader from './components/adminComponents/AdminHeader';
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { RootState } from './store.js';
import { useSelector } from "react-redux";

const App: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.userAuth);
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);
  const { doctorInfo } = useSelector((state: RootState) => state.doctorAuth);

  return (
    <>
     {userInfo ? (
        <UserHeader />
      ) : doctorInfo ? (
        <DoctorHeader />
      ) : adminInfo ? (
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
