import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Button, Carousel } from 'react-bootstrap';
import { useUserListDoctorsQuery,
  useUserListTopRatedDoctorsQuery,
  useUserGetDocSpecializationsQuery
} from '../slices/userSlices/userApiSlice';
import './userScreens/style.css';
import { IDoc } from '../types/doctorInterface';
import { useNavigate } from 'react-router-dom';
const backendURL = import.meta.env.VITE_BACKEND_URL;


const HomeScreen: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoc[]>([]);
  const {data:docList,error:listingError,isLoading:listLoading} = useUserListDoctorsQuery({});
  const {data:topRatedDocs} = useUserListTopRatedDoctorsQuery({});
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
              <img src={`/assets/home_page_cover1.jpg`} alt="Doctor 1" className="doctor-img" />
   
            </div>
          </Col>
        </Row>
      </section>

      {/* Medical Services Section */}
      <section className="services-section text-center py-5">
  <h2 className="mb-4">Our Medical Services</h2>
  <Carousel 
  interval={null} 
  controls={true} 
  indicators={true} 
  className="custom-carousel"
>
  {specs &&
    specs.reduce((acc: any[][], spec: any, index: number) => {
      if (index % 2 === 0) acc.push([spec]);
      else acc[acc.length - 1].push(spec);
      return acc;
    }, []).map((specPair:any, index:number) => (
      <Carousel.Item key={index}>
        <div className="d-flex justify-content-center flex-wrap gap-3">
          {specPair.map((spec: any, cardIndex: number) => (
            <Card
              key={cardIndex}
              className="service-card p-3 shadow-sm"
              style={{ width: "22rem", height: "100%" }}
            >
              <Card.Img
                variant="top"
                src={`/assets/heart_inhand.jpg`}
                alt="Service"
              />
              <Card.Body>
                <h5 className="fw-bold">{spec}</h5>
                <p>{`Expert ${spec} care to monitor and treat your health.`}</p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Carousel.Item>
    ))}
</Carousel>


</section>

      {/* Our Doctors Section */}
      <section className="doctors-section text-center py-5">
        <h2 className="mb-4">Our Great Doctors</h2>
        <Row className="g-4">
        {topRatedDocs?.map((doctor:IDoc) => (
          <Col md={4}>
            <Card className="doctor-card p-3 shadow-sm" onClick={() => navigate("/view-doctor", { state: { email: doctor.email } })}>
              <Card.Img 
                variant="top" 
                src={`${backendURL}/${doctor.profilePicture}`} alt="Doctor Profile 1"
                className='doctor-profile-img mb-3' />
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


      <section className="testimonials-section text-center py-5 bg-light">
        <h2 className="mb-4">What Our Patients Say</h2>
        <Carousel className="testimonials-carousel">
          <Carousel.Item>
            <p className="lead">
              "The doctors at CureHub are amazing! Their attention to detail and care changed my life for the better."
            </p>
            <h5 className="fw-bold">- John Doe</h5>
          </Carousel.Item>
          <Carousel.Item>
            <p className="lead">
              "Exceptional service and compassionate care. Highly recommend CureHub!"
            </p>
            <h5 className="fw-bold">- Jane Smith</h5>
          </Carousel.Item>
        </Carousel>
      </section>

      <Button
        variant="primary"
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </Button>

    </Container>
  );
};

export default HomeScreen;
