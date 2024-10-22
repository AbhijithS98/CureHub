import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toast } from 'react-toastify';
import { useDoctorLogoutMutation } from "../../slices/doctorSlices/doctorApiSlice.js";
import { clearDoctorCredentials } from "../../slices/doctorSlices/doctorAuthSlice.js";


const DoctorDashboard: React.FC = () => {
  const { doctorInfo } = useSelector((state: RootState) => state.doctorAuth);
  const navigate = useNavigate();
  const [logout] = useDoctorLogoutMutation();
  const dispatch = useDispatch();
 

  const LogoutHandler = async(e: React.FormEvent)=>{
    try{
       await logout().unwrap();
       dispatch(clearDoctorCredentials());
       toast.success("Logged out successfully")
       navigate("/doctor/login")
 
    } catch(err:any){
       toast.error(err.message || "Logout failed. Please try again.")
    }
   }



  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-3">
            <Card.Body>
              <h2 className="text-center mb-4">Welcome, Dr. {doctorInfo?.name}</h2>
              <p>Email: {doctorInfo?.email}</p>
              <p>Specialization: {doctorInfo?.specialization}</p>
              <p>Experience: {doctorInfo?.experience} years</p>
              <Row className="mt-4">
                <Col>
                  <Button variant="primary" className="w-100" onClick={LogoutHandler}>
                    Logout
                  </Button>
                </Col>

              </Row>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorDashboard;
