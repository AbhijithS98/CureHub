import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, ListGroup, Badge, Image, Button, ListGroupItem } from 'react-bootstrap';
import { toast, ToastPosition, Id } from "react-toastify";
import { useAdminApproveDoctorMutation, useAdminRejectDoctorMutation } from "../../slices/adminSlices/adminApiSlice";
import Spinner from '../../components/Spinner'
import { IDoc } from '../../types/doctorInterface';


const DoctorDetails: React.FC = () => {
  const location = useLocation();
  const doctor:IDoc = location.state?.doctor;
  const [approve,{isLoading:approveLoading}] = useAdminApproveDoctorMutation();
  const [reject,{isLoading:rejectLoading}] = useAdminRejectDoctorMutation();
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

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
      navigate("/admin/list-unapproved-doctors")
      
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
        <Card className="shadow-sm" style={{marginTop: 90}}>
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
                  <Image 
                  src={`${backendURL}/${doctor.profilePicture}`} 
                  roundedCircle
                  className="img-fluid mb-3 border border-primary p-1" 
                  style={{ maxWidth: '200px', height: 'auto' }} 
                  />
                  </ListGroup.Item>
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
                    <strong>Medical License Number:</strong> {doctor.medicalLicenseNumber}
                  </ListGroup.Item>
                </ListGroup>
                <ListGroup.Item>
                  <ul className="mt-2">
                  <li>
                    <strong>ID Proof:</strong> 
                    <Image 
                        src={`${backendURL}/${doctor.documents.idProof}`} 
                        alt="ID Proof" 
                        fluid 
                        thumbnail 
                        className="my-2"
                      />
                  </li>                 
                  </ul>
                  </ListGroup.Item>
              </Col>

              <Col md={6}>
                <ListGroup variant="flush">
                
                  <ListGroup.Item>                 
                  <ul className="mt-2">
                    <li>
                      <strong>Medical Degree:</strong>
                      <Image 
                        src={`${backendURL}/${doctor.documents.medicalDegree}`} 
                        alt="Medical Degree" 
                        fluid 
                        thumbnail 
                        className="my-2"
                      />
                    </li>                 
                  </ul>
                  </ListGroup.Item>
                  {!doctor.isApproved ? (
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
                  ) : (
                    <ListGroupItem className="d-flex justify-content-end">
                      <Button  
                      variant="primary" 
                      className="btn-lg me-2"
                      onClick={() => navigate("/admin/list-doctors")}
                      >
                        GoBack
                      </Button>
                    </ListGroupItem>
                  )}
                         
                </ListGroup>
              </Col>

            </Row>
          </Card.Body>
        </Card>
      </Container>
    );
}



export default DoctorDetails;