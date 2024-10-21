import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import FormContainer from '../../components/FormContainer';
import { usePassResetLinkMutation } from '../../slices/userSlices/userApiSlice';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [sendResetLink,{isLoading}] = usePassResetLinkMutation()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
 
      await sendResetLink({ email }).unwrap();
      toast.success('Reset password link has been sent to your email.');
    } catch (err: any) {
      toast.error(err?.data?.message || err.message ||'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
        <FormContainer>
          <h2 className="text-center my-4">Forgot Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Form>
        </FormContainer>
  );
};

export default ForgotPasswordScreen;
