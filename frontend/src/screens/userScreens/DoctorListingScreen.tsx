import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col, Container, Pagination } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { IDoc } from '../../types/doctorInterface';
import { useUserListDoctorsQuery,
         useUserGetDocSpecializationsQuery
       } from '../../slices/userSlices/userApiSlice';
import { useNavigate } from 'react-router-dom';
const backendURL = import.meta.env.VITE_BACKEND_URL;
import './style.css' 

const DoctorListing = () => {
  const [doctors, setDoctors] = useState<IDoc[]>([]);
  const [specializations, setSpecializations] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState<IDoc[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [minFee, setMinFee] = useState(0);
  const [maxFee, setMaxFee] = useState(1000);
  const doctorsPerPage = 3;

  const navigate = useNavigate();

  const {data:list} = useUserListDoctorsQuery({});
  const {data:specs} = useUserGetDocSpecializationsQuery({});

  
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
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.address?.city.toLowerCase().includes(searchQuery.toLowerCase()) 

    ); 
    setFilteredDoctors(filtered);
  };

  const handleFilterApply = () => {
    const filtered = doctors.filter(doctor => 
      selectedSpecialization ? doctor.specialization === selectedSpecialization : true &&
      doctor.consultationFee! >= minFee &&
      doctor.consultationFee! <= maxFee
    );
    setFilteredDoctors(filtered);
    setCurrentPage(1);
  };

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>    
      <div className="search-section">
        <h1>Find a Doctor</h1>
        <Form onSubmit={handleSearch} className="mt-3 d-inline-flex flex-column align-items-center">
          <Form.Group controlId="search" className="w-100">
            <h6 className='text-muted'>Search by Name, Specialization or location</h6>
            <Form.Control
              type="text"
              placeholder="Type here"
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

          <h5 className="mt-4">Filter by Consultation Fee</h5>
          <Form>
            <Form.Group controlId="minFee">
              <Form.Label>Min Fee</Form.Label>
              <Form.Control
                type="number"
                value={minFee}
                onChange={(e) => setMinFee(Number(e.target.value))}
                min={0}
              />
            </Form.Group>

            <Form.Group controlId="maxFee" className="mt-3">
              <Form.Label>Max Fee</Form.Label>
              <Form.Control
                type="number"
                value={maxFee}
                onChange={(e) => setMaxFee(Number(e.target.value))}
                min={0}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleFilterApply} className="mt-3">Apply Filters</Button>
          </Form>
        </Col>

       
        <Col md={9}>
          <Row>
            {currentDoctors.length === 0 ? (
              <Col md={12} className="text-center mt-5">
                <Card className="p-4">
                  <Card.Body>
                    <h3>No Doctors Found</h3>
                    <p>Sorry, no doctors match your search or filters. Please try again with different criteria.</p>
                  </Card.Body>
                </Card>
              </Col>
            )
            :
            (currentDoctors.map((doctor) => (
              <Col md={4} key={doctor.email} className="mb-4">
                <Card className="text-center">
                  <Card.Img
                    variant="top"
                    src={`${backendURL}/${doctor.profilePicture}`}
                    style={{ borderRadius: '10px', height: '300px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>
                      Dr. {doctor.name}
                    </Card.Title>
                    <Card.Text>
                      <span className="star-rating">
                                  {[...Array(5)].map((_, index) => (
                                    <span key={index} className={index < doctor.ratingInfo.average ? 'star-filled' : 'star-empty' }>
                                      ★
                                    </span> 
                                  ))}
                      </span><br />
                      <strong>Specialization:</strong> {doctor.specialization} <br />
                      <strong>Consultation Fee:</strong> ${doctor.consultationFee} <br />
                      <strong>Location:</strong> {doctor.address?.city}
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
            ))
            )}
          </Row>

          <Pagination className="justify-content-center mt-4">
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorListing;
