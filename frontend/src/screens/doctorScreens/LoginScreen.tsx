import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Container, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store.js';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { setDoctorCredentials } from '../../slices/doctorSlices/doctorAuthSlice.js';
import { useDoctorLoginMutation } from '../../slices/doctorSlices/doctorApiSlice.js';
import IconLoader from '../../components/Spinner.js';

const DoctorLoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctorInfo } = useSelector((state: RootState) => state.doctorAuth);
  const [login, { isLoading }] = useDoctorLoginMutation();

  useEffect(() => {
    if (doctorInfo) {
      navigate("/");
    }
  }, [navigate, doctorInfo]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setDoctorCredentials(res));
      toast.success("Logged in successfully!");
      navigate('/');

    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="p-4 border-secondary" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center">Doctor Login</h3>
        <Card.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="email" className="my-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
              className="border-secondary"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="my-3">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
              <Form.Control
                className="border-secondary"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
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

            {isLoading && <IconLoader />}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DoctorLoginScreen;
