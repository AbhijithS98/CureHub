import React, { useState,useEffect } from 'react';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/userComponents/Loader';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { useNavigate,useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store.js';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { setCredentials } from '../../slices/userSlices/userAuthSlice.js';
import { useLoginMutation, useResendOtpMutation } from '../../slices/userSlices/userApiSlice.js';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  
  const { userInfo } = useSelector((state : RootState) => state.userAuth);
  const [login, {isLoading:loginLoading}] = useLoginMutation();
  const [resendOtp, {isLoading:resendLoading}] = useResendOtpMutation();


  
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  useEffect(()=>{
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get('message');
    if (message) {
      toast.error(decodeURIComponent(message)); 
    }
  },[location]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      const res = await login({ email,password }).unwrap()
      dispatch(setCredentials(res));
      toast.success("Logged in successfully!");
      navigate('/')

    } catch(err:any){
      if(err?.status === 400){
        if (err.data.message === 'Please verify your email before logging in.') {
          //Resend the OTP
          await resendOtp({email}).unwrap();
          toast.error("You are not verified yet! An Otp has sent to your email")
          navigate("user/otp", { state: { email } })
        }else{
          toast.error(err.data.message)
        }
      }
      else{
        toast.error('Something went wrong')
      }
    }
  };

  return (
      <FormContainer >
        <h2 className='text-dark'>Login As Patient</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId='email' className='my-3'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              className='border-secondary'
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='password' className='my-3'>
            <Form.Label>Password</Form.Label>
            <div className="input-group">
            <Form.Control
              className='border-secondary'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
            variant="outline-secondary"
            onClick={togglePasswordVisibility}
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
            </div>
          </Form.Group>
    
          <Button type='submit' variant='primary'>
              Login
          </Button>
          
          <Col className="text-end">
            <Link to="/user/forgot-password">Forgot Password?</Link>
          </Col>
          
          {loginLoading || resendLoading && <Loader />}
        </Form>
      </FormContainer>
  );
};

export default LoginScreen;
