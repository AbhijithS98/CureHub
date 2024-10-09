import './App.css'
import "react-toastify/dist/ReactToastify.css";
import Header from './components/userComponents/Header';
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";


const App: React.FC = () => {

  return (
    <>
     <Header />
     <ToastContainer />
     <Container className="my-2">
        <Outlet />
      </Container>
    </>
  )
}

export default App
