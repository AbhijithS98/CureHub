import React, { useState } from 'react';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/userComponents/Loader';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store.js';
import { toast } from 'react-toastify';
import { setCredentials } from '../../slices/userSlices/userAuthSlice.js';
import { useLoginMutation, useResendOtpMutation } from '../../slices/userSlices/userApiSlice.js';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state : RootState) => state.userAuth);
  const [login, {isLoading:loginLoading}] = useLoginMutation();
  const [resendOtp, {isLoading:resendLoading}] = useResendOtpMutation();

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
      <FormContainer>
        <h2>Login As Patient</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId='email' className='my-3'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='password' className='my-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
