import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { RootState } from '../store.js';
import { useLogoutMutation } from "../slices/userSlices/userApiSlice.js";
import { clearCredentials } from "../slices/userSlices/userAuthSlice.js";
import { useNavigate } from "react-router-dom";

function Header() {
  const { userInfo } = useSelector((state: RootState) => state.userAuth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

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

  return (
    <header>
      <Navbar
        style={{ backgroundColor: "rgb(52, 137, 103)" }}
        variant="dark"
        expand="lg"
        collapseOnSelect
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <h1 >CUREHUB</h1>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo? (
                <>
                  <Nav className="ml-auto">
                    <LinkContainer to="/profile">
                      <Nav.Link>Profile</Nav.Link>
                    </LinkContainer>
                    <Nav.Link onClick={handleLogout}>
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
