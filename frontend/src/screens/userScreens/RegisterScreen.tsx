import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/userComponents/Loader";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useRegisterMutation } from "../../slices/userSlices/userApiSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "react-toastify/dist/ReactToastify.css";

const RegisterScreen: React.FC = () => {
 
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const [register, {isLoading}] = useRegisterMutation();
  const navigate = useNavigate()

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    if (!nameRegex.test(name)) {
      toast.error("Please enter a valid name");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await register({name,email,phone,password}).unwrap();
      toast.success("OTP has sent to your email!");
      navigate("/user/otp", { state: { email } })

    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Registration failed!");
    }
  };

  return (
    <FormContainer>
        <h2 className="text-center text-dark">Register As Patient</h2>
      <Form onSubmit={submitHandler} >
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Enter Name</Form.Label>
          <Form.Control
            className="border-primary"
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            className="border-primary"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="phone">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            className="border-primary"
            type="text"
            placeholder="Enter Mobile"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <div className="input-group">
          <Form.Control
            className="border-primary"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          ></Form.Control>
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

        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <div className="input-group">
          <Form.Control
            className="border-primary"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            
          ></Form.Control>
          <Button
            className="border-primary"
            variant="outline-secondary"
            onClick={toggleConfirmPasswordVisibility}
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </Button>
          </div>
        </Form.Group>
        
        {isLoading && <Loader />}
        <div className="d-flex justify-content-center mt-3">
        <Button  type="submit" variant="primary">
          Submit
        </Button>
        </div>
      </Form>   
    </FormContainer>
  )
}

export default RegisterScreen;
