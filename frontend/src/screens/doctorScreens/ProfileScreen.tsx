import React, { useEffect, useState } from 'react';
import { Card, Button, Image, Table, Form, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useDoctorGetProfileQuery } from '../../slices/doctorSlices/doctorApiSlice';
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IDoc } from '../../../../shared/doctor.interface';
import { toast } from 'react-toastify';
import IconLoader from "../../components/Spinner";
import { FaTrash } from 'react-icons/fa';
import { useDoctorUpdateProfileMutation } from '../../slices/doctorSlices/doctorApiSlice';
import { useDoctorAddSlotsMutation, 
         useDoctorLogoutMutation, 
         useDoctorDeleteSlotMutation } from '../../slices/doctorSlices/doctorApiSlice';
import { clearDoctorCredentials } from "../../slices/doctorSlices/doctorAuthSlice.js";
import { ObjectId } from 'mongoose';

interface AvailabilitySlot {
  date: Date;
  startTime: string;
  endTime: string;
  _id?: ObjectId;
}

const ProfileScreen: React.FC = () => { 

  const location = useLocation();
  const { email } = location.state || {};
  const [selectedTab, setSelectedTab] = useState('overview');
  const {data, error, isLoading, refetch} = useDoctorGetProfileQuery(email);
  const doctorInfo:IDoc = data?.doctor;
  const [updateDoctorProfile, {isLoading:updateLoading}] = useDoctorUpdateProfileMutation();
  const [removeSlot, {isLoading:deleteSlotLoading}] = useDoctorDeleteSlotMutation();
  const [addSlots, {isLoading:addSlotLoading}] = useDoctorAddSlotsMutation();
  const [logout] = useDoctorLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
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
    } else if(field === 'startTime' || field === 'endTime'){
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

  const updateSlots = async () => {
    if(availability.length){
      const docEmail = doctorInfo.email
      const newSlots = availability;
      
      try{
        await addSlots({ docEmail, newSlots }).unwrap();
        toast.success("Slots added successfully!");
        refetch();
        setAvailability([])
      }catch (error:any) {
        console.error("Error adding availability: ", error);
        toast.error(error.message || "Error adding availability.")
      }
    }
  }

  const deleteSlot = async (slotId:ObjectId) => {
      const docEmail = doctorInfo.email
      
      try{
        await removeSlot({slotId, docEmail}).unwrap();
        toast.success("Slot deleted successfully!");
        refetch();

      }catch (error:any) {
        console.error("Error deleting slot: ", error);
        toast.error(error.message || "Error deleting slot.")
      }
    
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required")
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required")
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Enter a valid email address")
      return;
    }
    
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number")
      return;
    }
    
    if (!formData.specialization.trim()) {
      toast.error("Specialization is required")
      return;
    }
    if (!formData.medicalLicenseNumber.trim()) {
      toast.error("Medical License Number is required")
      return;
    }
    
    if (!formData.gender) {
      toast.error("Gender is required")
      return;
    }
    if (!formData.dob) {
      toast.error("Date of Birth is required")
      return;
    }
    
    if (!formData.experience || formData.experience < 0) {
      toast.error("Experience must be a positive number")
      return;
    }
    
    if (!formData.consultationFee || formData.consultationFee < 0) {
      toast.error("Consultation Fee must be a positive number")
      return;
    }
    
    if (!formData.clinicName.trim()) { 
      toast.error("Clinic Name is required")
      return;
    }
    if (!formData.district.trim()) {
      toast.error("District is required")
      return;
    }
    if (!formData.city.trim()) {
      toast.error("City is required")
      return;
    }
    if (!formData.bio.trim()) {
      toast.error("Bio is required")
      return;
    }

    const updatedData = { ...formData };

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
      case 'availabilities':
        return (
          <div>
            <h3>Manage availabilities</h3>
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {doctorInfo.availability?.map((slot, index) => {
                  const date = new Date(slot.date);
                  return (
                  <tr key={index}>
                    <td>{date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td>{slot.startTime}</td>
                    <td>{slot.endTime}</td>
                    <td><Button className="btn btn-danger" onClick={()=>deleteSlot(slot._id)}>
                            <FaTrash />
                        </Button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </Table>
            {availability.map((slot, index) => (
                <Row key={index} className="mb-3">
                  <Col md={4}>
                    <Form.Group controlId={`availabilityDate-${index}`}>
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={slot.date ? new Date(slot.date).toISOString().split('T')[0] : ''}
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

              <div className="d-flex justify-content-between mb-2">
              <Button  variant="secondary" size="sm" onClick={addAvailabilitySlot}>
                Add new Slot
              </Button>
              {availability.length? (
                <Button  variant="success" size="sm" onClick={updateSlots}>
                  Save new Slot
                </Button> ) : null}
              </div>
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
                <Form.Label><strong>Name*</strong></Form.Label>
                <Form.Control 
                  type="text" 
                  value={formData.name} 
                  onChange={handleInputChange}
                />
              </Form.Group>
              
              <Form.Group controlId="email" className="mb-3">
                <Form.Label><strong>Email*</strong></Form.Label>
                <Form.Control 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                />
              </Form.Group>
             
              <Form.Group controlId="phone" className="mb-3">
                <Form.Label><strong>Phone*</strong></Form.Label>
                <Form.Control 
                  type="text" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                />
              </Form.Group>
            
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="specialization">
                    <Form.Label><strong>Specialization*</strong></Form.Label>
                    <Form.Control 
                      type="text" 
                      value={formData.specialization} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="medicalLicenseNumber">
                    <Form.Label><strong>Medical License Number*</strong></Form.Label>
                    <Form.Control 
                      type="text" 
                      value={formData.medicalLicenseNumber} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="gender">
                    <Form.Label><strong>Gender*</strong></Form.Label>
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
                    <Form.Label><strong>Date of Birth*</strong></Form.Label>
                    <Form.Control 
                      type="date" 
                      value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="experience">
                    <Form.Label><strong>Experience*</strong>  <span className="text-muted">(in years)</span></Form.Label>
                    <Form.Control type="number" value={formData.experience} onChange={handleInputChange}/>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="consultationFee">
                    <Form.Label><strong>Consultation Fee*</strong>  <span className="text-muted">(in Rupees)</span></Form.Label>
                    <Form.Control type="number" value={formData.consultationFee} onChange={handleInputChange}/>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="clinicName">
                    <Form.Label><strong>Clinic Name*</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.clinicName || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group controlId="district">
                    <Form.Label><strong>District*</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.district || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group controlId="city">
                    <Form.Label><strong>City*</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.city || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            
              <Form.Group controlId="bio" className="mb-3">
                    <Form.Label><strong>Bio*</strong></Form.Label>
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
              <Button variant="outline-primary" onClick={() => setSelectedTab('availabilities')} className="w-100 text-center mb-2">Availabilities</Button>
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
