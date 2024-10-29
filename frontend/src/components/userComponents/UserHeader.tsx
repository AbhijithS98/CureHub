import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { BsPersonFill } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { RootState } from '../../store.js';
import { useLogoutMutation } from "../../slices/userSlices/userApiSlice.js";
import { clearCredentials } from "../../slices/userSlices/userAuthSlice.js";
import { useNavigate } from "react-router-dom";

function UserHeader() {
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
        style={{ backgroundColor: "rgb(21, 43, 67)" }}
        variant="dark"
        expand="lg"
        collapseOnSelect
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
              {userInfo? (
                <>
                  <Nav className="ml-auto">
                    <LinkContainer to="/user/profile">
                      <Nav.Link className="mx-2">
                        <BsPersonFill />Profile
                      </Nav.Link>
                    </LinkContainer>
                    <Nav.Link className="mx-2" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </Nav.Link>
                  </Nav>
                </>
              ):(
                <>  
                  <LinkContainer to="/user/login">
                   <Nav.Link className="mx-2">
                    <FaSignInAlt /> Login
                   </Nav.Link>
                  </LinkContainer>
              
                  <LinkContainer to="/user/register">
                    <Nav.Link className="mx-2">
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

export default UserHeader;
