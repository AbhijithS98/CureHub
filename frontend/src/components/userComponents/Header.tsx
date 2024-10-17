import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";

function Header() {
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
                  <LinkContainer to="/login">
                    <NavDropdown.Item>As Patient</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/doctor/login">
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
                  <LinkContainer to="/register">
                    <NavDropdown.Item>As Patient</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/doctor/register">
                    <NavDropdown.Item>As Doctor</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              </>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
