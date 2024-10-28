import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch,useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAdminLoginMutation } from "../../slices/adminSlices/adminApiSlice";
import Loader from "../../components/userComponents/Loader";
import { setAdminCredentials } from "../../slices/adminSlices/adminAuthSlice";
import { RootState } from "../../store";


const AdminLoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = ()=>{
    setShowPassword(!showPassword);
  }
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login,{isLoading}] = useAdminLoginMutation();

  const {adminInfo} = useSelector((state: RootState) => state.adminAuth)

  useEffect(() => {
    if (adminInfo) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate, adminInfo]);
  

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

      try{

        const res = await login({email,password}).unwrap();
        toast.success("Login successful!");
        dispatch(setAdminCredentials({ id: res.adminId, token: res.token }));
        navigate("/admin/dashboard");

      } catch(err:any){
        console.error("Error during admin login: ",err);
        toast.error(err?.data?.message || "Login failed!");
      }
  };  

  useEffect(()=>{
   console.log("adminInfo: ",adminInfo);
  },[])
  
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg p-5 bg-light rounded">
            <h1 className="text-center mb-4 text-primary">Admin Sign In</h1>
            
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-primary rounded"
                  required
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                <Form.Control
                  type={showPassword? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-primary rounded"
                  required
                />
                <Button 
                  className="border-primary"
                  variant="outline-secondary"
                  onClick={togglePasswordVisibility}
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                </div>
              </Form.Group>

              {isLoading && <Loader/>}
              <div className="d-grid gap-2">
                <Button type="submit" variant="primary" className="mt-3">
                  Sign In
                </Button>
              </div>
              <Row className="py-3 text-center">
              <Col>
                <Link to="/admin/forgot-password">Forgot Password?</Link>
              </Col>
              </Row>

            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLoginScreen;
