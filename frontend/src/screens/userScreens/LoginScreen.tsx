import React, { useState } from 'react';
import FormContainer from '../../components/userComponents/FormContainer';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Add your login logic here (API call or state management action)
    if (email === 'test@example.com' && password === 'password123') {
      toast.success('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
      <FormContainer>
        <h2>Login</h2>
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
        </Form>
      </FormContainer>
  );
};

export default LoginScreen;
