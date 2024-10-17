import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormContainer from '../../components/userComponents/FormContainer';
import Loader from '../../components/userComponents/Loader';
import { Form,Button } from 'react-bootstrap';
import { toast } from "react-toastify";
import { useVerifyOtpMutation } from '../../slices/userSlices/userApiSlice';

const OtpScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const { email } = location.state || {};

  const [verifyOtp, {isLoading}] = useVerifyOtpMutation();
  
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };


  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!otp) {
          toast.error('Please Enter OTP');
      } else {
          await verifyOtp({ otp, email }).unwrap(); 
          toast.success('OTP Verified, Please Login');
          navigate('/login');
      }
    } catch (error:any) {
      toast.error(error.message || 'OTP Verification failed');
    }
  };

  return (
    <FormContainer>
      <h1>OTP Verification</h1>
      {email ? (
        <p className="text-primary">An OTP has been sent to your email: <strong>{email}</strong></p>
      ) : (
        <p className="text-danger">No email provided.</p>
      )}
      <Form onSubmit={handleOtpSubmit}>
        <Form.Group className="my-2" controlId="otp">
                    <Form.Label>Enter Your OTP</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter OTP Here"
                        value={otp}
                        onChange={handleOtpChange}
                    />
        </Form.Group>

        {isLoading && <Loader />}
        <Button type="submit" variant="primary" className="mt-3">
         Verify Otp
        </Button>
      </Form>
    </FormContainer> 
  );
};

export default OtpScreen;
