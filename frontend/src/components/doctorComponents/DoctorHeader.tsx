import { useState, useEffect } from "react";
import { Navbar, Nav, Container, } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { BsPersonFill } from "react-icons/bs";
import { FaComments } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { RootState } from '../../store.js';
import { useNavigate } from "react-router-dom";
import { useDoctorLogoutMutation } from "../../slices/doctorSlices/doctorApiSlice.js";
import { clearDoctorCredentials } from "../../slices/doctorSlices/doctorAuthSlice.js";
import socket from "../../services/socketService";
import './style.css'


function DoctorHeader() {
  const { doctorInfo } = useSelector((state: RootState) => state.doctorAuth);
  const [unreadCount, setUnreadCount] = useState(0);
  const [logout] = useDoctorLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async(e: React.FormEvent)=>{
   try{
      await logout().unwrap();
      dispatch(clearDoctorCredentials());
      toast.success("Logged out successfully")
      navigate("/doctor/login")

   } catch(err:any){
      toast.error(err.message || "Logout failed. Please try again.")
   }
  }

  useEffect(() => {    
    if (!doctorInfo?._id) return;
    
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/chat/unread-count?doctorId=${doctorInfo?._id}`
        );
        const data = await response.json();
        console.log("Initial unread count:", data.unreadCount);
        setUnreadCount(data.unreadCount || 0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };
  
    fetchUnreadCount();

    // Listen for new messages via socket
    socket.on("receiveMessage", (message) => {
      console.log("New message received:", message);
      if (message.doctorId === doctorInfo?._id) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [doctorInfo]);

  return (  
    <header>
      <Navbar
        style={{ backgroundColor: "rgb(21, 43, 67)", zIndex: 9999 }}
        variant="dark"
        expand="lg"
        collapseOnSelect
        className="sticky-top mb-5"
      >
        <Container>
          <LinkContainer to="/">
          <Navbar.Brand className="d-flex align-items-center">
            <img
              src={"http://localhost:5173/src/assets/app-logo.png"}
              alt="CureHub Logo"
              width="60"
              height="60"
              className="me-2"
            />
              <h2 >CUREHUB</h2>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
                <Nav className="ml-auto">
                  <LinkContainer to="/list-doctors">
                      <Nav.Link className="mx-2">
                        <FaUserDoctor />Find a Doctor
                      </Nav.Link>
                  </LinkContainer>
                </Nav>
             {doctorInfo? (
              <>
              <Nav className="ml-auto">
                <LinkContainer to="/doctor/profile" state={{ email: doctorInfo.email, _id: doctorInfo._id }}>
                  <Nav.Link>
                    <BsPersonFill />Profile
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to={`/doctor/chats/${doctorInfo._id}`}>
                  <Nav.Link>
                    <FaComments />Chats
                    {unreadCount > 0 && (
                      <span className="badge badge-danger ml-1">{unreadCount}</span>
                    )}
                  </Nav.Link>
                </LinkContainer>

                <Nav.Link onClick={handleLogout}>
                  <FaSignOutAlt />
                  Logout
                </Nav.Link>
              </Nav>
             </>
             ):(
                <>  
                  <LinkContainer to="/doctor/login">
                   <Nav.Link>
                    <FaSignInAlt /> Login
                   </Nav.Link>
                  </LinkContainer>
              
                  <LinkContainer to="/doctor/register">
                    <Nav.Link>
                      <FaUserPlus /> Sign Up 
                    </Nav.Link>
                  </LinkContainer>
                </>
             )}
                
                 
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default DoctorHeader;
