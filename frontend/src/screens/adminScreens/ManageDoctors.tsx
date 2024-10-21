import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader";
import { useAdminListDoctorsQuery } from "../../slices/adminSlices/adminApiSlice";
import { IDoctor } from '../../../../shared/doctor.interface';
import { useAdminApproveDoctorMutation, useAdminRejectDoctorMutation } from "../../slices/adminSlices/adminApiSlice";


const ManageDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const { data, error, isLoading, refetch } = useAdminListDoctorsQuery({});
  const [approve,{isLoading:approveLoading}] = useAdminApproveDoctorMutation();
  const [reject,{isLoading:rejectLoading}] = useAdminRejectDoctorMutation();

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

      refetch();

    } catch(error:any){
      toast.error(error.message || "Action failed")
    }    
  };

  useEffect(() => {
    console.log("runing useeffect");
    
    if (data) {   
      setDoctors(data);
    } else if (error) {
      toast.error("failed to fetch doctors");
    }
  }, [data,error]);


  if (isLoading) {
    return <p className="text-center text-primary fs-4 mt-5">Loading doctors...</p>;
  }
  return (
    <Container>
      <h1 className="my-4 text-center">Pending Doctor Requests</h1>
      {doctors?.length === 0 ? (
        <p className="text-center text-danger fs-4 mt-5">No requests found</p>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Experience (Years)</th>
              <th>Medical License Number</th>
              <th>ID Proof</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={index}>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.experience}</td>
                <td>{doctor.medicalLicenseNumber}</td>
                <td>
                  <a href={doctor.idProof} target="_blank" rel="noopener noreferrer">
                    View ID Proof
                  </a>
                </td>
                <td>{doctor.email}</td>
                <td>
                  <Button  
                  variant="success" 
                  className="btn-sm"
                  onClick={() => handleAction(doctor.email,'approve')}
                  >
                    Approve
                  </Button>
                  {' '} 
                  <Button 
                  variant="danger"
                  className="btn-sm"
                  onClick={() => handleAction(doctor.email,'reject')}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>    
      )}
      {approveLoading || rejectLoading && <Loader />}
    </Container>
  );
};

export default ManageDoctors;
