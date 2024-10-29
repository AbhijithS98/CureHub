import React, { useEffect, useState } from 'react';
import { Card, Button, Image, Table, Form, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useDoctorGetProfileQuery } from '../../slices/doctorSlices/doctorApiSlice';
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IDoc } from '../../../../shared/doctor.interface';
import { toast } from 'react-toastify';
import IconLoader from "../../components/Spinner";
import { useDoctorUpdateProfileMutation } from '../../slices/doctorSlices/doctorApiSlice';
import { useDoctorLogoutMutation } from "../../slices/doctorSlices/doctorApiSlice.js";
import { clearDoctorCredentials } from "../../slices/doctorSlices/doctorAuthSlice.js";

interface AvailabilitySlot {
  date: Date;
  startTime: string;
  endTime: string;
}

const ProfileScreen: React.FC = () => {

  const location = useLocation();
  const { email } = location.state || {};
  const [selectedTab, setSelectedTab] = useState('overview');
  const {data, error, isLoading, refetch} = useDoctorGetProfileQuery(email);
  const doctorInfo:IDoc = data?.doctor;
  const [updateDoctorProfile, {isLoading:updateLoading}] = useDoctorUpdateProfileMutation();
  const [logout] = useDoctorLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(doctorInfo?.availability || []);
  const [formData, setFormData] = useState({
    name:  '',
    email: '',
    phone: '',
    specialization: '',
    medicalLicenseNumber: '',
    gender: '',
    dob: '',
    experience: 0,
    consultationFee: 0,
    clinicName: '',
    district: '',
    city: '',
    bio: '',
  });
   
  useEffect(()=>{
    if(doctorInfo){
      setFormData({
        name: doctorInfo?.name || '',
        email: doctorInfo?.email || '',
        phone: doctorInfo?.phone || '',
        specialization: doctorInfo?.specialization || '',
        medicalLicenseNumber: doctorInfo?.medicalLicenseNumber || '',
        gender: doctorInfo?.gender || '',
        dob: doctorInfo?.dob ? new Date(doctorInfo.dob).toISOString().split('T')[0] : '',
        experience: doctorInfo?.experience || 0,
        consultationFee: doctorInfo?.consultationFee || 0,
        clinicName: doctorInfo?.address?.clinicName || '',
        district: doctorInfo?.address?.district || '',
        city: doctorInfo?.address?.city || '',
        bio: doctorInfo?.bio || '',
      })
    }
    
  },[doctorInfo])

  const handleLogout = async(e: React.FormEvent)=>{
    try{
       await logout().unwrap();
       dispatch(clearDoctorCredentials());
       toast.success("Logged out successfully")
       navigate("/doctor/login")
 
    } catch(err:any){
       toast.error(err.message || "Logout failed. Please try again.")
    }
   }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleAvailabilityChange = (index:number, field:keyof AvailabilitySlot, value:string) => {
    const updatedAvailability = [...availability];
    if (field === 'date') {
      updatedAvailability[index][field] = new Date(value); 
    } else {
      updatedAvailability[index][field] = value; 
    }
    setAvailability(updatedAvailability);
  };


  const addAvailabilitySlot = () => {
    setAvailability([...availability, { date: new Date(), startTime: '', endTime: '' }]);
  };

  
  const removeAvailabilitySlot = (index:number) => {
    const updatedAvailability = availability.filter((_, i) => i !== index);
    setAvailability(updatedAvailability);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = { ...formData, availability };

    try {
      
      await updateDoctorProfile(updatedData).unwrap();
      toast.success("Profile updated successfully!");
      refetch();
      setSelectedTab('overview')
    } catch (error:any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Error updating profile.")
    }
  };


  const renderContent = () => {
    if (isLoading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Failed to load profile.</Alert>;
    if (!data) return <Alert variant="warning">Doctor profile not found.</Alert>;

    
    switch (selectedTab) {
      case 'overview':
        return (
          <div >
            
            <Image 
            src={`http://localhost:5000/${doctorInfo.profilePicture}`} 
            roundedCircle
            className="img-fluid mb-3 border border-primary p-1" 
            style={{ maxWidth: '200px', height: 'auto' }} 
            />
            <h4 className="fw-bold">Dr. {doctorInfo.name}</h4>
            <p><strong>Specialization:</strong> {doctorInfo.specialization}</p>
            <p><strong>About:</strong> {doctorInfo.bio}</p>
            <p><strong>Experience:</strong> {doctorInfo.experience}</p>
          </div>
        );
      case 'appointments':
        return (
          <div>
            <h3>Appointments</h3>
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Patient</th>
                </tr>
              </thead>
              <tbody>
                {/* {doctorInfo.appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.patientName}</td>
                  </tr>
                ))} */}
              </tbody>
            </Table>
          </div>
        );
      case 'profile':
        return (
          <div>
            <h3>Profile Information</h3>

            <Form className="mt-4" onSubmit={handleSubmit}>

              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Name*</Form.Label>
                <Form.Control 
                  type="text" 
                  value={formData.name} 
                  onChange={handleInputChange}
                />
              </Form.Group>
              
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email*</Form.Label>
                <Form.Control 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                />
              </Form.Group>
             
              <Form.Group controlId="phone" className="mb-3">
                <Form.Label>Phone*</Form.Label>
                <Form.Control 
                  type="text" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                />
              </Form.Group>
            
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="specialization">
                    <Form.Label>Specialization*</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={formData.specialization} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="medicalLicenseNumber">
                    <Form.Label>Medical License Number*</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={formData.medicalLicenseNumber} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select value={formData.gender || ''} onChange={handleInputChange}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="dob">
                    <Form.Label>Date of Birth*</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="experience">
                    <Form.Label>Experience  <span className="text-muted">(in years)</span>*</Form.Label>
                    <Form.Control type="number" value={formData.experience} onChange={handleInputChange}/>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="consultationFee">
                    <Form.Label>Consultation Fee  <span className="text-muted">(in Rupees)</span>*</Form.Label>
                    <Form.Control type="number" value={formData.consultationFee} onChange={handleInputChange}/>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="clinicName">
                    <Form.Label>Clinic Name*</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.clinicName || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group controlId="district">
                    <Form.Label>District*</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.district || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group controlId="city">
                    <Form.Label>City*</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.city || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            
              <h5>Availability*</h5>
              <br/>
              {availability.map((slot, index) => (
                <Row key={index} className="mb-3">
                  <Col md={4}>
                    <Form.Group controlId={`availabilityDate-${index}`}>
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={slot.date ? slot.date.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleAvailabilityChange(index, 'date', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId={`availabilityStartTime-${index}`}>
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId={`availabilityEndTime-${index}`}>
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col className="text-end mt-2 ">
                    <Button variant="danger" size="sm" onClick={() => removeAvailabilitySlot(index)}>
                      Remove
                    </Button>
                    
                  </Col>
                </Row>  
              ))}
              <Button className="mb-2 " variant="secondary" size="sm" onClick={addAvailabilitySlot}>
                Add new Slot
              </Button>
              
              <Form.Group controlId="bio" className="mb-3">
                    <Form.Label>Bio*</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      style={{ height: '200px' }}
                    />
              </Form.Group>
              
              <Button 
                variant="primary" 
                type='submit' 
                className="mt-3 "
              >
                Update Profile
              </Button>
              {updateLoading && <IconLoader />}
            </Form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={3}>
          <Card className="p-3 shadow-sm mb-3 bg-light">
            <Card.Body>
              <Button variant="outline-primary" onClick={() => setSelectedTab('overview')} className="w-100 text-center mb-2">Overview</Button>
              <Button variant="outline-primary" onClick={() => setSelectedTab('appointments')} className="w-100 text-center mb-2">Appointments</Button>
              <Button variant="outline-primary" onClick={() => setSelectedTab('profile')} className="w-100 text-center mb-2">Profile</Button>
              <Button variant="danger" onClick={handleLogout} className="w-100 text-center mt-5">Logout</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          <Card className="p-4 shadow-sm">
            {renderContent()}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;
