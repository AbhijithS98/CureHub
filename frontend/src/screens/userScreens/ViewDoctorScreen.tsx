import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Card, Button, Spinner, Row, Col } from 'react-bootstrap';
import { IDoc } from '../../../../shared/doctor.interface';
import { useUserViewDoctorQuery } from '../../slices/userSlices/userApiSlice';

import './style.css';

const ViewDoctorScreen: React.FC = () => {
  const location = useLocation();
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
                    <section className="doctor-details mb-4">
                      <h4>About</h4>
                      <p>{doctor.bio}</p>
                    </section>

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
                </Col>
               {/* Right section - Ticket Price & Time Slots */}
            <Col md={5}>
              <Card className="p-3 shadow-sm appointment-box">
                <h5>Ticket Price </h5>
                <p className="display-6">₹ {doctor.consultationFee}</p>

                <h5>Available Time Slots</h5>
                <ul className="list-unstyled">
                {doctor.availability?.map((available, index) => {
                    const date = new Date(available.date);
                    return (
                      <li className='mb-2' key={index}>
                       *{date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} - {available.startTime} to {available.endTime}
                      </li>
                    );
                })}
                </ul>

                <Button variant="primary" className="w-100 mt-3" >
                  Book an Appointment
                </Button>
              </Card>
            </Col>
          </Row>
         </Col>
           
          </Row>
        </Card>
      )}
    </Container>
  );
};

export default ViewDoctorScreen;
