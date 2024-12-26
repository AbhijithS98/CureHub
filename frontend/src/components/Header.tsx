import { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { BsPersonFill } from "react-icons/bs";
import { FaComments } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { RootState } from '../store.js';
import { useLogoutMutation } from "../slices/userSlices/userApiSlice.js";
import { clearCredentials } from "../slices/userSlices/userAuthSlice.js";
import { useNavigate } from "react-router-dom";
import socket from "../services/socketService";


function Header() {
  const { userInfo } = useSelector((state: RootState) => state.userAuth);
  const [unreadCount, setUnreadCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const handleLogout = async(e: React.FormEvent)=>{
   try{
      await logout().unwrap();
      dispatch(clearCredentials());
      toast.success("Logged Out Successfully")
      navigate("user/login")

   } catch(err:any){
      toast.error(err.message || "Logout failed. Please try again.")
   }
  }


  useEffect(() => {    
    if (!userInfo?._id) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(
          `${backendURL}/api/chat/unread-count?patientId=${userInfo?._id}`
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
      if (message.patientId === userInfo?._id) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userInfo]);

  return (
    <header>
      <Navbar
        style={{ backgroundColor: "rgb(21, 43, 67)" }}
        variant="dark"
        expand="lg"
        collapseOnSelect
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center">
            <img
              src={`/assets/app-logo.png`}
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
              {userInfo? (
                <>
                  <Nav className="ml-auto">
                    <LinkContainer to="/user/profile" state={{ email: userInfo.email }}>
                        <Nav.Link className="mx-2">
                          <BsPersonFill />Profile
                        </Nav.Link>
                    </LinkContainer>

                    <LinkContainer to={`/user/chats/${userInfo._id}`}>
                      <Nav.Link>
                        <FaComments />Chats
                        {unreadCount > 0 && (
                          <span className="badge badge-danger ml-1">{unreadCount}</span>
                        )}
                      </Nav.Link>
                    </LinkContainer>

                    <LinkContainer to="/user/wallet">
                      <Nav.Link className="mx-2">
                        <BsPersonFill />My wallet
                      </Nav.Link>
                    </LinkContainer>

                    <Nav.Link className="mx-2" onClick={handleLogout}>
                      <FaSignOutAlt />
                      Logout</Nav.Link>
                  </Nav>
                </>
              ):(
                <>  
                <NavDropdown
                  title={
                    <>
                      {" "}
                      <FaSignInAlt /> Login{" "}
                    </>
                  }
                  id="login"
                >
                  <LinkContainer to="user/login">
                    <NavDropdown.Item>As Patient</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="doctor/login">
                    <NavDropdown.Item>As Doctor</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>

                <NavDropdown
                  title={
                    <>
                      {" "}
                      <FaSignOutAlt /> Sign Up{" "}
                    </>
                  }
                  id="signUp"
                >
                  <LinkContainer to="/user/register">
                    <NavDropdown.Item>As Patient</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/doctor/register">
                    <NavDropdown.Item>As Doctor</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              </>
              )}
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
