import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, ListGroup, Badge, Image, Button, ListGroupItem } from 'react-bootstrap';
import { toast, ToastPosition, Id } from "react-toastify";
import { useAdminApproveDoctorMutation, useAdminRejectDoctorMutation } from "../../slices/adminSlices/adminApiSlice";
import Spinner from '../../components/Spinner'


const DoctorDetails: React.FC = () => {
  const location = useLocation();
  const doctor = location.state?.doctor;
  const [approve,{isLoading:approveLoading}] = useAdminApproveDoctorMutation();
  const [reject,{isLoading:rejectLoading}] = useAdminRejectDoctorMutation();
  const navigate = useNavigate();

  const confirmAndHandleAction = (email: string, action: "approve" | "reject") => {
    const toastId: Id = toast.info(
      <span>
        Are you sure you want to {action} this doctor?
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            handleAction(email, action);
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
  
  const handleAction = async (email:string, action: "approve" | "reject") => {
    console.log('email:',email);
    
    try{
      if (action === "approve") {
        const res = await approve({email}).unwrap();        
        toast.success(res.message || 'Doctor approved')

      } else if (action === "reject") {
        const res = await reject({email}).unwrap();
        toast.success(res.message || 'Doctor rejected')
      }
      navigate("/admin/list-doctors")
      
    } catch(error:any){
      toast.error(error.message || "Action failed")
    }    
  };

  if(!doctor){
    return (
    <div>
      <p className="text-danger"> No doctor details found</p>
    </div>
    )
  }
    
  return (
      <Container className="my-5">
        <Card className="shadow-sm">
          <Card.Header className="text-center">
            <h2 className="mb-0">Dr. {doctor.name}</h2>
            <Badge bg="info" className="mt-2">
              {doctor.specialization}
            </Badge>
          </Card.Header>
          <Card.Body>

            <Row>
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Email:</strong> {doctor.email}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Phone:</strong> {doctor.phone}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Gender:</strong> {doctor.gender}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Experience:</strong> {doctor.experience} years
                  </ListGroup.Item>
                  <ListGroup.Item>
                  <ul className="mt-2">
                  <li>
                    <strong>ID Proof:</strong> 
                    <Image 
                        src={`http://localhost:5000/${doctor.documents.idProof}`} 
                        alt="ID Proof" 
                        fluid 
                        thumbnail 
                        className="my-2"
                      />
                  </li>                 
                  </ul>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Medical License Number:</strong> {doctor.medicalLicenseNumber}
                  </ListGroup.Item>
                  <ListGroup.Item>                 
                  <ul className="mt-2">
                    <li>
                      <strong>Medical Degree:</strong>
                      <Image 
                        src={`http://localhost:5000/${doctor.documents.medicalDegree}`} 
                        alt="Medical Degree" 
                        fluid 
                        thumbnail 
                        className="my-2"
                      />
                    </li>                 
                  </ul>
                </ListGroup.Item>
                  <ListGroupItem className="d-flex justify-content-end">
                  <Button  
                    variant="success" 
                    className="btn-lg me-2"
                    onClick={() => confirmAndHandleAction(doctor.email, 'approve')}
                    >
                      Approve
                    </Button>
                    {' '} 
                    <Button 
                    variant="danger"
                    className="btn-lg"
                    onClick={() => confirmAndHandleAction(doctor.email, 'reject')}
                    >
                      Reject
                    </Button>
                    {approveLoading || rejectLoading && <Spinner />}
                  </ListGroupItem>        
                </ListGroup>
              </Col>

            </Row>
          </Card.Body>
        </Card>
      </Container>
    );
}



export default DoctorDetails;