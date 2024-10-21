import React, { useState } from 'react';
import { Form, Button, Col, Row, Container, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store.js';
import { toast } from 'react-toastify';
import { setDoctorCredentials } from '../../slices/doctorSlices/doctorAuthSlice.js';
import { useDoctorLoginMutation } from '../../slices/doctorSlices/doctorApiSlice.js';
import Loader from '../../components/userComponents/Loader';

const DoctorLoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctorInfo } = useSelector((state: RootState) => state.doctorAuth);
  const [login, { isLoading }] = useDoctorLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setDoctorCredentials(res));
      toast.success("Logged in successfully!");
      navigate('/doctor/dashboard');

    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center">Doctor Login</h3>
        <Card.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="email" className="my-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="my-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" variant="primary" className="mt-2">
                Login
              </Button>
            </div>

            <Row className="py-3 text-center">
              <Col>
                <Link to="/doctor/forgot-password">Forgot Password?</Link>
              </Col>
            </Row>

            {isLoading && <Loader />}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DoctorLoginScreen;
