import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAdminListDoctorsQuery } from "../../slices/adminSlices/adminApiSlice";
import { IDoc } from '../../../../shared/doctor.interface'


const ManageDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoc[]>([]);
  const { data, error, isLoading, refetch } = useAdminListDoctorsQuery({});

  const navigate = useNavigate();

  const navigateToDoctorDetails = (doctor:IDoc) => {
    navigate("/admin/doctor-details", {state: {doctor}})
  }


  useEffect(() => {
    console.log("runing useeffect");
    refetch();
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
            {doctors.map((doctor, index) => (
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

export default ManageDoctors;
