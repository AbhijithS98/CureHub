import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Container, Row, Table, Form, Card, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useUserGetProfileQuery } from '../../slices/userSlices/userApiSlice.js';
import './style.css';
import { Iuser } from '../../../../shared/user.interface.js';
import { useLogoutMutation, useUserUpdateProfileMutation } from "../../slices/userSlices/userApiSlice.js";
import { clearCredentials } from "../../slices/userSlices/userAuthSlice.js";

const ProfileScreen: React.FC = () => {

  const location = useLocation();
  const { email } = location.state || {};
  const [selectedTab, setSelectedTab] = useState('bookings');
  const {data, error, isLoading, refetch} = useUserGetProfileQuery(email);
  const userInfo:Iuser = data?.user;
  const [updateProfile, {isLoading:updateLoading}] = useUserUpdateProfileMutation();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: ''
  });
  
  
  useEffect(()=>{

    if(userInfo){
      setProfileData({
        name: userInfo?.name || '',
        email: userInfo?.email || '',
        phone: userInfo?.phone || '',
        address: userInfo?.address || '',
        dob: userInfo?.dob ? new Date(userInfo.dob).toISOString().split('T')[0] : ''
      })
    }
  },[userInfo]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

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
              <h5 className="fw-bold">{userInfo?.name}</h5>
              <p className="text-muted">{userInfo?.email}</p>
              <p className="text-muted">{userInfo?.phone}</p>
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
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Doctor</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  
                  <tr>
                    <td>2024-11-01</td>
                    <td>Dr. Smith</td>
                    <td>10:00 AM</td>
                    <td>Confirmed</td>
                  </tr>
                  <tr>
                    <td>2024-11-10</td>
                    <td>Dr. Lee</td>
                    <td>3:00 PM</td>
                    <td>Pending</td>
                  </tr>
                </tbody>
              </Table>
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