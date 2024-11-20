import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/userComponents/Loader';
import { Form,Button } from 'react-bootstrap';
import { toast } from "react-toastify";
import { useVerifyOtpMutation, useResendOtpMutation } from '../../slices/userSlices/userApiSlice';


const OtpScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(180);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { email } = location.state || {};
  const [verifyOtp, {isLoading:verifyLoading}] = useVerifyOtpMutation();
  const [resendOtp, {isLoading:resendLoading}] = useResendOtpMutation();

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
          toast.success('You have Successfully registered, Please Login');
          navigate('/user/login');
      }
    } catch (error:any) {
      toast.error(error.data.message || 'OTP Verification failed');
    }
  };

  const handleResendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      await resendOtp({email}).unwrap();
      toast.success('OTP Resent Successfully');
      setCanResend(false); 
      setOtpTimer(180); 
      setResendTimer(30);

    }catch (error:any) {
      toast.error(error.message || 'OTP Resend failed');
    }
     
  };

  useEffect(()=>{
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  },[otpTimer]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval); 
    } else {
      setCanResend(true); 
    }
  }, [resendTimer]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
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

        {verifyLoading || resendLoading && <Loader />}
        <p>OTP will expire in: {formatTime(otpTimer)}</p>

        <Button type="submit" variant="primary" className="mt-3" disabled={verifyLoading}>
         Verify Otp
        </Button>
      </Form>

      <Button
        variant="secondary"
        className="mt-3"
        onClick={handleResendOtp}
        disabled={!canResend}
      >
        {canResend ? 'Resend OTP' : `Resend OTP in ${resendTimer}s`}
      </Button>
    </FormContainer> 
  );
};

export default OtpScreen;
