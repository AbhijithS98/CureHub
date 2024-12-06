import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Button } from 'react-bootstrap';
import { useUserListDoctorsQuery,
  useUserGetDocSpecializationsQuery
} from '../slices/userSlices/userApiSlice';
import './userScreens/style.css';
import { IDoc } from '../types/doctorInterface';
import { useNavigate } from 'react-router-dom';

const HomeScreen: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoc[]>([]);
  const {data:docList,error:listingError,isLoading:listLoading} = useUserListDoctorsQuery({});
  const {data:specs,error:specsError,isLoading:specsLoading} = useUserGetDocSpecializationsQuery({});
  const navigate = useNavigate();
  
  useEffect(()=>{
    if(docList){
      setDoctors(docList)
    }
  },docList)

  return (
    <Container className="home-container">
      {/* Welcome Section */}
      <section className="welcome-section text-center my-5">
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <h1 className="fw-bold display-5">We help patients live a healthy, longer life.</h1>
            <p className="lead mt-3">
              CureHub connects you to skilled doctors and personalized care, enhancing health outcomes
              and saving time. With us, scheduling consultations and accessing trusted health services
              is now easier than ever.
            </p>
            <Button variant="primary" className="mt-3" href='/list-doctors'>Get Started</Button>
          </Col>
          <Col md={6} className="d-flex justify-content-center">
            <div className="doctor-images">
              <img src="http://localhost:5173/src/assets/home_page_cover1.jpg" alt="Doctor 1" className="doctor-img" />
   
            </div>
          </Col>
        </Row>
      </section>

      {/* Medical Services Section */}
      <section className="services-section text-center py-5">
        <h2 className="mb-4">Our Medical Services</h2>
        <Row className="g-4">
        {specs?.map((spec:any) => (
          <Col sm={4}>
            <Card className="service-card p-3 shadow-sm">
              <Card.Img variant="top" src={"http://localhost:5173/src/assets/heart_inhand.jpg"} alt="Doctor Profile 1" />
              <Card.Body>
                <h5 className="fw-bold">{spec}</h5>
                <p>{`Expert ${spec} care to monitor and treat your heart health`}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
        
        </Row>
      </section>

      {/* Our Doctors Section */}
      <section className="doctors-section text-center py-5">
        <h2 className="mb-4">Our Great Doctors</h2>
        <Row className="g-4">
        {doctors.map((doctor) => (
          <Col md={3}>
            <Card className="doctor-card p-3 shadow-sm" onClick={() => navigate("/view-doctor", { state: { email: doctor.email } })}>
              <Card.Img variant="top" src={`http://localhost:5000/${doctor.profilePicture}`} alt="Doctor Profile 1" />
              <Card.Body>
                <h5 className="fw-bold">Dr. {doctor.name}</h5>
                <p>Experience: {doctor.experience} years</p>
                <p>Specialization: {doctor.specialization} - Dedicated to patient health and wellness.</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
          
        </Row>
      </section>
    </Container>
  );
};

export default HomeScreen;
