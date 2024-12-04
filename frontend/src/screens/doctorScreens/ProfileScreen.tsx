import React, { useEffect, useState } from 'react';
import { Card, Button, Image, Table, Form, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IDoc } from '../../types/doctorInterface'
import { toast } from 'react-toastify';
import Swal from "sweetalert2"; 
import IconLoader from "../../components/Spinner";
import { FaTrash } from 'react-icons/fa';
import { useDoctorGetProfileQuery,
         useDoctorGetAvailabilityQuery,
         useDoctorUpdateProfileMutation,
         useDoctorLogoutMutation, 
         useDoctorDeleteSlotMutation,
         useDoctorDeleteTimeSlotMutation,
         useDoctorGetAppointmentsQuery,
         useDoctorCancelAppointmentMutation } from '../../slices/doctorSlices/doctorApiSlice';
import { clearDoctorCredentials } from "../../slices/doctorSlices/doctorAuthSlice.js";
import { ObjectId, Types } from 'mongoose';
import CancelAppointmentModal from '../../components/doctorComponents/CancelAppointmentModal';
import TableWithPagination,{ Column } from '../../components/PaginatedTable';
import { IAppointmentPd } from '../../types/IAppointmentPd';
import { IPrescription } from '../../types/prescriptionInterface';

interface AvailabilitySlot {
  _id: ObjectId,
  doctor: ObjectId; 
  date: Date;
  timeSlots: {
    time: string;  
    status: 'Available' | 'Booked' ;
    _id: ObjectId; 
  }[]; 
}

interface Appointment {
  _id: ObjectId;
  user: {name:string} 
  doctor: ObjectId; 
  date: Date; 
  time: string; 
  slotId: ObjectId; 
  timeSlotId: ObjectId; 
  payment: ObjectId | null; 
  status: 'Booked' | 'Cancelled' | 'Completed'; 
  createdAt: Date; 
  updatedAt: Date;
}

const ProfileScreen: React.FC = () => { 

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('');

  const location = useLocation();
  const { email, _id } = location.state || {};
  const [selectedTab, setSelectedTab] = useState('overview');
  const {data:profileData, error, isLoading, refetch:profileRefetch} = useDoctorGetProfileQuery(email);
  const doctorInfo:IDoc = profileData?.doctor;
  const {data:availabilityData, refetch:availabilityRefetch} = useDoctorGetAvailabilityQuery(_id);
  const {data:appointmentsData, refetch:appointmentsRefetch} = useDoctorGetAppointmentsQuery({});
  
  const [updateDoctorProfile, {isLoading:updateLoading}] = useDoctorUpdateProfileMutation();
  const [removeSlot] = useDoctorDeleteSlotMutation();
  const [removeTimeSlot] = useDoctorDeleteTimeSlotMutation();
  const [cancelBooking] = useDoctorCancelAppointmentMutation();
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
    if(availabilityData){
      console.log("avls : ",availabilityData);
    }
    if(appointmentsData){
      console.log("apmts : ",appointmentsData);
    }
    
  },[doctorInfo,availabilityData,appointmentsData])


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
      try{
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you really want to delete this slot? This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
        });

        if(result.isConfirmed){
          await removeSlot({slotId}).unwrap();
          toast.success("Slot deleted successfully!");
          availabilityRefetch();
        }
      }catch (error:any) {
        console.error("Error deleting slot: ", error);
        toast.error(error.message || "Error deleting slot.")
      }
  }

  
  const deleteTimeSlot = async (slotId:ObjectId, timeSlotId:ObjectId) => {  

    try{
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this Time slot? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if(result.isConfirmed){
        await removeTimeSlot({slotId, timeSlotId}).unwrap();
        toast.success("Time Slot deleted successfully!");
        availabilityRefetch();
        setViewingDate(null)
      }
    }catch (error:any) {
      console.error("Error deleting time slot: ", error);
      toast.error(error.message || "Error deleting time slot.")
    }
  }

  const cancelAppointment = async (appointmentId:string, reason: string) => {
      
    try{
      await cancelBooking({appointmentId, reason}).unwrap();
      toast.success("Booking cancelled successfully!");
      appointmentsRefetch();
      
    }catch (error:any) {
      console.error("Error cancelling appointment: ", error);
      toast.error(error.message || "Error cancelling appointment")
    }
  }

  const handleCancelButtonClick = (appointmentId: Types.ObjectId) => {
    setSelectedAppointmentId(appointmentId.toString());
    setShowModal(true);
  };

  const handleClick = () => {  
    if (!doctorInfo.consultationFee || !doctorInfo.address || !doctorInfo.bio) {
      toast.error("You need to complete your profile before setting availability.");
      return; 
    }
  
    navigate("/doctor/availabilities", {
      state: { docEmail: doctorInfo.email },
    });
  };

  const addPrescription = (appointmentId: Types.ObjectId, patientId: Types.ObjectId) => {
    navigate('/doctor/add-prescription', { state: { appointmentId, patientId } });
  };
  
  const viewPrescription = (preId: Types.ObjectId) => {
    navigate(`/doctor/view-prescription/${preId}`);
  };

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
      profileRefetch();
      setSelectedTab('overview')
    } catch (error:any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Error updating profile.")
    }
  };

  const ApmntsColumns: Column<IAppointmentPd>[] = [
    {
      key: 'date',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString('en-GB'),
    },
    {
      key: 'time',
      label: 'Time',
    },
    {
      key: 'user',
      label: 'Patient',
      render: (_: any, row: IAppointmentPd) => {
        if(typeof row.user === 'object' && 'name' in row.user){
          return row.user.name
        }
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string, row: IAppointmentPd) =>
        value === 'Cancelled' && row.cancellationReason
          ? `Cancelled Myself: ${row.cancellationReason}`
          : value,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: IAppointmentPd) => (
        <div className="d-flex gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleCancelButtonClick(row._id!)}
            disabled={row.status === 'Cancelled'}
          >
            Cancel
          </Button>
          
          {row.status === 'Completed' ? 
            <Button
            variant="info"
            size="sm"
            onClick={() => viewPrescription(row.prescription!)}
            >
            View Prescription
            </Button>
           :  
           <Button
            variant="primary"
            size="sm"
            onClick={() => addPrescription(row._id,row.user._id)}
            disabled={row.status !== 'Booked'} 
           >
            Add Prescription
           </Button>          
          }
          
        </div>
      ),
    },
  ];


  const renderContent = () => {
    if (isLoading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Failed to load profile.</Alert>;
    if (!profileData) return <Alert variant="warning">Doctor profile not found.</Alert>;

    
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
                onClick={handleClick} 
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
                {availabilityData.availability.map((slot:AvailabilitySlot, index:number) => {
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
                    <td><Button 
                          className="btn btn-danger" 
                          onClick={()=>deleteSlot(slot._id)}
                          disabled={slot.timeSlots.some((timeSlot: any) => timeSlot.status === 'Booked')}
                        >
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
                              disabled={timeSlot.status==='Booked'}
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
          <TableWithPagination data={appointmentsData.appointments} columns={ApmntsColumns} rowsPerPage={5}/>
          
          {/* Show the CancelAppointmentModal when needed */}
          <CancelAppointmentModal
            appointmentId={selectedAppointmentId}
            onCancelConfirm={cancelAppointment}
            showModal={showModal}
            onHide={() => setShowModal(false)} 
          />
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
