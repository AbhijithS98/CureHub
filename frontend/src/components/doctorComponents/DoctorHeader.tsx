import { Navbar, Nav, Container, } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { RootState } from '../../store.js';
import { useNavigate } from "react-router-dom";
import { useDoctorLogoutMutation } from "../../slices/doctorSlices/doctorApiSlice.js";
import { clearDoctorCredentials } from "../../slices/doctorSlices/doctorAuthSlice.js";


function DoctorHeader() {
  const { doctorInfo } = useSelector((state: RootState) => state.doctorAuth);
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

  return (
    <header>
      <Navbar
        style={{ backgroundColor: "rgb(8, 161, 162)" }}
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
             {doctorInfo? (
              <>
              <Nav className="ml-auto">
                <LinkContainer to="/doctor/profile">
                  <Nav.Link>Profile</Nav.Link>
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
