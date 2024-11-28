import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/userComponents/Loader";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useRegisterMutation } from "../../slices/userSlices/userApiSlice";
import { validateRegistration } from "../../utils/ValidateUserRegister";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "react-toastify/dist/ReactToastify.css";

const RegisterScreen: React.FC = () => {
 
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  
  const [register, {isLoading}] = useRegisterMutation();
  const navigate = useNavigate()

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = validateRegistration(name, email, password, confirmPassword, profilePicture);
    if (!validationResult.isValid) {
      toast.error(validationResult.message);
      return;
    }

    const formData = new FormData(); 
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("profilePicture", profilePicture!);

    try {
      await register(formData).unwrap();
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

        <Form.Group className="my-2" controlId="profilePicture">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            className="border-primary"
            type="file"
            accept="image/*"
            name="profilePicture"
            onChange={(e) => {
              const target = e.target as HTMLInputElement; 
              setProfilePicture(target.files?.[0] || null); 
            }}
          />
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
