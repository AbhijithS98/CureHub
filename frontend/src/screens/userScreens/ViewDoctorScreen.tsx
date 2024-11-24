import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, } from 'react-router-dom';
import { Container, Card, Button, Spinner, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.js';
import { IDoc } from '../../../../shared/doctor.interface';
import { useUserViewDoctorQuery } from '../../slices/userSlices/userApiSlice';

import './style.css';

const ViewDoctorScreen: React.FC = () => {
  const { doctorInfo } = useSelector((state: RootState) => state.doctorAuth);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [doctor, setDoctor] = useState<IDoc | null>(null);

  const { data, error, isLoading } = useUserViewDoctorQuery(email);

  useEffect(() => {
    if (data) {
      setDoctor(data);
    }
  }, [data]);

  if (isLoading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <h2 className="text-danger text-center my-5">Failed to load doctor details.</h2>;

  return (
    <Container fluid className="view-doctor-screen d-flex align-items-center mt-5">
      {doctor && (
        <Card className="doctor-card shadow w-100">
          <Row>
            {/* Left side - Profile Picture */}
            <Col md={4} className="text-center">
              <img
                src={`http://localhost:5000/${doctor.profilePicture}`}
                alt={`${doctor.name}'s profile`}
                className="doctor-profile-img mb-3"
              />
            </Col>

            {/*  Right side - Personal Details & Appointment Box  */}
            <Col md={8}>
              <h2 className="display-6 mb-3">Dr. {doctor.name}</h2>

                {/* Personal Details with Appointment Box */}
                <Row>
                {/* Personal Details */}
                <Col md={7}>
                    <section className="doctor-details mb-4">
                      <h4>Personal Details</h4>
                      <p><strong>Specialization:</strong> {doctor.specialization}</p>
                      <p><strong>Experience:</strong> {doctor.experience} years</p>
                    </section>

                    {/* Contact Details */}
                    <section className="doctor-details mb-4">
                      <h4>Contact Details</h4>
                      <p><strong>Email:</strong> {doctor.email}</p>
                      <p><strong>Phone:</strong> {doctor.phone}</p>
                      <p><strong>Address:</strong> {doctor.address?.clinicName}, {doctor.address?.district}, {doctor.address?.city}</p>
                    </section>

                    {/* About */}
                   
                </Col>
                
            {/* Right section - Ticket Price & Time Slots */}
            <Col md={5}>
              <Card className="p-4 shadow-lg rounded border-0">
                  {/* Ticket Price */}
                  <div className="text-center mb-4">
                    <h5 className="text-uppercase text-muted">Ticket Price</h5>
                    <p className="display-4 text-primary fw-bold">₹ {doctor.consultationFee}</p>
                  </div>

                  {/* Book Button */}
                  <Button 
                    variant="primary" 
                    className="w-100 py-2 shadow rounded-pill"
                    disabled={doctorInfo !== null}
                    onClick={() => navigate("/user/book-slot", { state: { doctor } })}>
                    <i className="bi bi-calendar-plus me-2"></i> Book an Appointment
                  </Button>
              </Card>
            </Col>
          </Row>
         </Col>
           
          </Row>
          <Row>
          <section className="doctor-details mb-4">
                      <h4>About</h4>
                      <p>{doctor.bio}</p>
                    </section>

                   
          </Row>
          <Row>
             {/* Educational Certificates */}
             <section className="doctor-details mb-4">
                      <h4>Educational Certificates</h4>
                      {doctor.documents.medicalDegree ? (
                        <img
                          src={`http://localhost:5000/${doctor.documents.medicalDegree}`}
                          alt="Degree Certificate"
                          className="degree-certificate-img"
                        />
                      ) : (
                        <p>No certificate available</p>
                      )}
                    </section>
          </Row>
        </Card>
      )}
    </Container>
  );
};

export default ViewDoctorScreen;
