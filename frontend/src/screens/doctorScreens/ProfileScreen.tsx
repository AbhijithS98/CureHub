import React, { useEffect, useState } from 'react';
import { Card, Button, Image, Table, Form, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IDoc } from '../../../../shared/doctor.interface';
import { toast } from 'react-toastify';
import IconLoader from "../../components/Spinner";
import { FaTrash } from 'react-icons/fa';
import { useDoctorGetProfileQuery,
         useDoctorGetAvailabilityQuery,
         useDoctorUpdateProfileMutation,
         useDoctorLogoutMutation, 
         useDoctorDeleteSlotMutation,
         useDoctorDeleteTimeSlotMutation } from '../../slices/doctorSlices/doctorApiSlice';
import { clearDoctorCredentials } from "../../slices/doctorSlices/doctorAuthSlice.js";
import { ObjectId } from 'mongoose';

interface AvailabilitySlot {
  _id: ObjectId,
  doctor: ObjectId; 
  date: Date;
  timeSlots: {
    time: string; 
    user: ObjectId | null; 
    status: 'Pending' | 'Booked' | 'Completed';
    payment: ObjectId | null;
    _id: ObjectId,
  }[];
}

const ProfileScreen: React.FC = () => { 

  const location = useLocation();
  const { email, _id } = location.state || {};
  const [selectedTab, setSelectedTab] = useState('overview');
  const {data, error, isLoading, refetch} = useDoctorGetProfileQuery(email);
  const {data:result, refetch:availabilityRefetch} = useDoctorGetAvailabilityQuery(_id);
  const doctorInfo:IDoc = data?.doctor;
  const [updateDoctorProfile, {isLoading:updateLoading}] = useDoctorUpdateProfileMutation();
  const [removeSlot, {isLoading:deleteSlotLoading}] = useDoctorDeleteSlotMutation();
  const [removeTimeSlot, {isLoading:deleteTimeSlotLoading}] = useDoctorDeleteTimeSlotMutation();
  const [logout] = useDoctorLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
   
  
  const [viewingDate, setViewingDate] = useState<AvailabilitySlot | null>(null);

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
    if(result){
      console.log("avls : ",result);
    }
    
  },[doctorInfo,result])

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

  const deleteTimeSlot = async (slotId:ObjectId, timeSlotId:ObjectId) => {
    const docEmail = doctorInfo.email
    
    try{
      await removeTimeSlot({slotId, timeSlotId, docEmail}).unwrap();
      toast.success("Time Slot deleted successfully!");
      refetch();

    }catch (error:any) {
      console.error("Error deleting time slot: ", error);
      toast.error(error.message || "Error deleting time slot.")
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
            <div className="d-flex justify-content-between align-items-center">
              <h3>Manage availabilities</h3>
              <Button 
                className="btn btn-success"
                onClick={() => navigate("/doctor/availabilities", {state : { docEmail: doctorInfo.email }} )} 
              >
                Set New Slots
              </Button>
            </div>
            {viewingDate === null ? ( 
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Slots</th>
                  <th>Actions</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {result.availability.map((slot:AvailabilitySlot, index:number) => {
                  const date = new Date(slot.date);
                  return (
                  <tr key={index}>
                    <td>{date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td>{slot.timeSlots.length}</td>
                    <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setViewingDate(slot)}
                        >
                          View Slots
                        </Button>
                      </td>
                    <td><Button className="btn btn-danger" onClick={()=>deleteSlot(slot._id)}>
                            <FaTrash />
                        </Button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </Table>
            ) : (
              <>
                <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingDate.timeSlots.map((timeSlot, index) => (
                        <tr key={index}>
                          <td>{new Date(viewingDate.date).toLocaleDateString('en-GB')}</td>
                          <td>{timeSlot.time}</td>
                          <td>{timeSlot.status==='Booked' ? <Button variant='danger' size='sm'>Booked</Button> : 
                                                   <Button variant='success' size='sm'>Available</Button>}
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deleteTimeSlot(viewingDate._id!, timeSlot._id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  <Button variant="secondary" size="sm" onClick={()=>setViewingDate(null)} className="mb-3">
                    Back
                  </Button>
                </tbody>
               </Table>
              </>
            )}
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
