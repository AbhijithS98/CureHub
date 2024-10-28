import { Navbar, Nav, Container } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import { useAdminLogoutMutation } from "../../slices/adminSlices/adminApiSlice";
import { clearAdminCredentials } from "../../slices/adminSlices/adminAuthSlice";


function AdminHeader() {
  const {adminInfo} = useSelector((state: RootState) => state.adminAuth);
  const [logout,{isLoading}] = useAdminLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e: React.FormEvent) => {
    try {
         await logout().unwrap();
         dispatch(clearAdminCredentials());
         toast.success("Logged Out Successfully")
         navigate("admin/login")

    } catch (err: any) {
      toast.error(err.message || "Logout failed. Please try again.");
    }
  };

  return (
    <header>
      <Navbar
        style={{ backgroundColor: "rgb(52, 58, 64)" }} 
        variant="dark"
        expand="lg"
        collapseOnSelect
      >
        <Container>
          <LinkContainer to="/admin/dashboard">
            <Navbar.Brand>
              <h2>CUREHUB ADMIN</h2>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {adminInfo? (
              <>
                <Nav.Link onClick={handleLogout}>
                    <FaSignOutAlt /> Logout                
                </Nav.Link>
              </>
              ) : (
              <>
                <LinkContainer to="/admin/login">
                  <Nav.Link>
                    <FaSignInAlt /> Login
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

export default AdminHeader;
