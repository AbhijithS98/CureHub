import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
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
                  <LinkContainer to="/user/login">
                   <Nav.Link>
                    <FaSignInAlt /> Login
                   </Nav.Link>
                  </LinkContainer>
              
                  <LinkContainer to="/user/register">
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

export default UserHeader;
