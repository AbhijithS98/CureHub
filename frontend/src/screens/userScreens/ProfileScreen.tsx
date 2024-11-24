import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Container, Row, Table, Form, Card, Spinner, Alert } from 'react-bootstrap';
import { toast, Id, ToastPosition } from 'react-toastify';
import { useUserGetProfileQuery, 
         useUserGetAppointmentsQuery, 
         useLogoutMutation, 
         useUserUpdateProfileMutation,
         useUserCancelBookingMutation } from '../../slices/userSlices/userApiSlice.js';
import { Iuser } from '../../../../shared/user.interface.js';
import { clearCredentials } from "../../slices/userSlices/userAuthSlice.js";
import { Ibooking } from '../../types/bookingInterface.js';
import TableWithPagination,{ Column } from '../../components/PaginatedTable';
import { ObjectId } from 'mongoose';
import './style.css';


const ProfileScreen: React.FC = () => {

  const location = useLocation();
  const { email } = location.state || {};
  const [selectedTab, setSelectedTab] = useState('bookings');
  const {data, error, isLoading, refetch} = useUserGetProfileQuery(email);
  const {data:bookingsData, refetch:bookingsRefetch} = useUserGetAppointmentsQuery({});
  const bookings: Ibooking[] | [] = bookingsData?.result;
  const userData:Iuser = data?.user;
  const [updateProfile] = useUserUpdateProfileMutation();
  const [cancelAppointment,{isLoading:cancelLoading}] = useUserCancelBookingMutation();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({name: '',
                                                  email: '',
                                                  phone: '',
                                                  address: '',
                                                  dob: ''});

  useEffect(()=>{
    if(userData){
      setProfileData({
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        address: userData?.address || '',
        dob: userData?.dob ? new Date(userData.dob).toISOString().split('T')[0] : ''
      })
    }
    if(bookingsData){
     console.log("res: ", bookingsData);
    }
  },[userData,bookingsData]);
  
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const confirmAndCancelBooking = (bookingId: ObjectId) => {
    const toastId: Id = toast.info(
      <span>
        Are you sure you want to cancel this appointment?
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            cancelBooking(bookingId);
            toast.dismiss(toastId);
          }}
          className="ms-3"
        >
          Confirm
        </Button>
      </span>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: "top-center" as ToastPosition,
      }
    );
  };

 
    const cancelBooking = async (bookingId:ObjectId) => {  
      const booking = bookings.find((b: Ibooking) => b._id === bookingId);
      if (!booking) return;

      const bookingDate = new Date(booking.date);
      const cancellationDeadline = new Date(bookingDate);
      const currentDate = new Date();
      cancellationDeadline.setDate(bookingDate.getDate() - 1); 
      cancellationDeadline.setHours(23, 59, 59, 999); 
      
      if (currentDate > cancellationDeadline) {
        toast.error('Cancellation period has passed. You cannot cancel anymore.');
        return;
      }

    try{
      await cancelAppointment({bookingId}).unwrap();
      toast.success("Booking cancelled successfully!");
      bookingsRefetch();
      
    }catch (error:any) {
      console.error("Error cancelling booking: ", error);
      toast.error(error.message || "Error cancelling booking")
    }
  }

  const handleLogout = async(e: React.FormEvent)=>{
    try{
       await logout().unwrap();
       dispatch(clearCredentials());
       toast.success("Logged Out Successfully")
       navigate("/user/login")
 
    } catch(err:any){
       toast.error(err.message || "Logout failed. Please try again.")
    }
   }

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = { ...profileData };
    try {

      await updateProfile(updatedData).unwrap(); 
      toast.success('Profile updated successfully!');
      refetch();
      setSelectedTab('bookings')
    } catch (error:any) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const columns: Column<Ibooking>[] = [
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
      key: 'doctor',
      label: 'Doctor',
      render: (_: any, row: Ibooking) => `Dr. ${row.doctor.name}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string, row: Ibooking) =>
        value === 'Cancelled' && row.cancellationReason
          ? `Cancelled by Doctor: ${row.cancellationReason}`
          : value,
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_: any, row: Ibooking) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => confirmAndCancelBooking(row._id)}
          disabled={row.status === 'Cancelled'}
        >
          Cancel
        </Button>
      ),
    },
  ];
  
 
if (isLoading) return <Spinner animation="border" />;
if (error) return <Alert variant="danger">Failed to load profile.</Alert>;
if (!data) return <Alert variant="warning">User profile not found.</Alert>;

  return (
    
    <Container className="profile-screen my-5">
      <Row>
        {/* Left Section: Profile Information */}
        <Col md={4}>
          <Card className="p-4 shadow-sm">
            <div className="text-center">
              {/* <img
                src={'/default-profile.png'}
                alt="User Profile"
                className="profile-photo mb-3"
              /> */}
              <h5 className="fw-bold">{userData?.name}</h5>
              <p className="text-muted">{userData?.email}</p>
              <p className="text-muted">{userData?.phone}</p>
              <Button variant="danger" className="mt-4 w-100" onClick={handleLogout}>Logout</Button>
            </div>
          </Card>
        </Col>

        {/* Right Section: Tabs and Content */}
        <Col md={8}>
          <div className="d-flex justify-content-between mb-3">
            <Button
              variant={selectedTab === 'bookings' ? 'primary' : 'outline-primary'}
              onClick={() => handleTabChange('bookings')}
            >
              My Bookings
            </Button>
            <Button
              variant={selectedTab === 'settings' ? 'primary' : 'outline-primary'}
              onClick={() => handleTabChange('settings')}
            >
              Settings
            </Button>
          </div>

          {/* Content Switching based on selected tab */}
          {selectedTab === 'bookings' ? (
            <Card className="p-4 shadow-sm">
              <h5 className="fw-bold mb-3">My Bookings</h5>
              <TableWithPagination data={bookings} columns={columns} rowsPerPage={5}/>
            </Card>
          ) : (
            <Card className="p-4 shadow-sm">
              <h5 className="fw-bold mb-3">Update Profile</h5>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control 
                  type="text" 
                  placeholder="Enter name" 
                  value={profileData.name} 
                  onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDOB">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={profileData.dob}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">Update Details</Button>
              </Form>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;
