import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toast } from 'react-toastify';


const DoctorDashboard: React.FC = () => {
  const { doctorInfo } = useSelector((state: RootState) => state.doctorAuth);
  const navigate = useNavigate();

  const handleProfile = () => {
    toast.info('Navigating to profile...');
    navigate('/doctor/profile');
  };



  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-3">
            <Card.Body>
              <h2 className="text-center mb-4">Welcome, Dr. {doctorInfo?.name}</h2>
              <p>Email: {doctorInfo?.email}</p>
              <p>Specialization: {doctorInfo?.specialization}</p>
              <p>Experience: {doctorInfo?.experience} years</p>
              <Row className="mt-4">
                <Col>
                  <Button variant="primary" className="w-100" onClick={handleProfile}>
                    View Profile
                  </Button>
                </Col>

              </Row>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorDashboard;
