import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { IDoc } from '../../../../shared/doctor.interface';
import { useUserListDoctorsQuery,
         useUserGetDocSpecializationsQuery
       } from '../../slices/userSlices/userApiSlice';
import { useNavigate } from 'react-router-dom';
import './style.css' 

const DoctorListing = () => {
  const [doctors, setDoctors] = useState<IDoc[]>([]);
  const [specializations, setSpecializations] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState<IDoc[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const navigate = useNavigate();

  const {data:list,error:listingError,isLoading:listLoading} = useUserListDoctorsQuery({});
  const {data:specs,error:specsError,isLoading:specsLoading} = useUserGetDocSpecializationsQuery({});

  
  useEffect(() => {
    if(list){
      setDoctors(list)
      setFilteredDoctors(list)
    }
    if(specs){
      setSpecializations(specs);
    }
  }, [list,specs]);

  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    ); 
    setFilteredDoctors(filtered);
  };

  const handleFilterApply = () => {
    const filtered = doctors.filter(doctor => 
      selectedSpecialization ? doctor.specialization === selectedSpecialization : true
    );
    setFilteredDoctors(filtered);
  };
  
  return (
    <Container>
      
      <div className="search-section">
        <h1>Find a Doctor</h1>
        <Form onSubmit={handleSearch} className="mt-3 d-inline-flex flex-column align-items-center">
          <Form.Group controlId="search" className="w-100">
            <Form.Control
              type="text"
              placeholder="Name or specialization"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-2">Search</Button>
        </Form>
      </div>


      <Row className="mt-4">
        
        <Col md={3} >
          <h5>Filter by Specialization</h5>
          <Form>
            {specializations.map((spec, index) => (
              <Form.Check
                key={index}
                type="radio"
                label={spec}
                name="specialization"
                checked={selectedSpecialization === spec}
                onChange={() => setSelectedSpecialization(spec)}
              />
            ))}
            <Form.Check
              type="radio"
              label="All Specializations"
              name="specialization"
              checked={selectedSpecialization === ''}
              onChange={() => setSelectedSpecialization('')}
            />
            <Button variant="primary" onClick={handleFilterApply} className="mt-3">Apply</Button>
          </Form>
        </Col>

       
        <Col md={9}>
          <Row>
            {filteredDoctors.map((doctor) => (
              <Col md={4} key={doctor.email} className="mb-4">
                <Card className="text-center">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000/${doctor.profilePicture}`}
                    style={{ borderRadius: '10px', height: '300px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>Dr. {doctor.name}</Card.Title>
                    <Card.Text>
                      <strong>Specialization:</strong> {doctor.specialization} <br />
                      <strong>Consultation Fee:</strong> ${doctor.consultationFee}
                    </Card.Text>
                    <Button 
                      variant="info" 
                      className="text-dark"
                      onClick={() => navigate("/view-doctor", { state: { email: doctor.email } })}
                    > 
                      View <FaArrowRight />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorListing;
