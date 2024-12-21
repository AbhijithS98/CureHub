import React  from "react";
import Sidebar from "../../components/adminComponents/Sidebar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";
import { useAdminListUnapprovedDoctorsQuery } from "../../slices/adminSlices/adminApiSlice";
import { IDoc } from '../../types/doctorInterface';


const ManageDoctorRequests: React.FC = () => {
  const { data: doctors, error, isLoading, refetch } = useAdminListUnapprovedDoctorsQuery({});

  const navigate = useNavigate();

  const navigateToDoctorDetails = (doctor:IDoc) => {
    navigate("/admin/doctor-details", {state: {doctor}})
  }

  if (error) {
    toast.error("Failed to fetch doctors");
  }

  return (
    <Container style={{marginTop: 90}}>
      <h1 className="my-4 text-center">Pending Doctor Requests</h1>
      {isLoading ? (
        <p className="text-center text-primary fs-4 mt-5">Loading doctors...</p>
      ) :
      doctors?.length === 0 ? (
        <p className="text-center text-danger fs-4 mt-5">No requests found</p>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>index</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Experience (Years)</th>
              <th>Medical License Number</th>
              <th>Email</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor:IDoc, index:number) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.experience}</td>
                <td>{doctor.medicalLicenseNumber}</td>
                <td>{doctor.email}</td>
                <td>
                  <Button
                    variant="info"
                    className="btn-sm"
                    onClick={() => navigateToDoctorDetails(doctor)} 
                  >
                    View More
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>    
      )}
    </Container>
  );
};

export default ManageDoctorRequests;
