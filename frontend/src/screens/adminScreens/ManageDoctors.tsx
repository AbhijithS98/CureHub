import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";
import { toast, Id, ToastPosition } from "react-toastify";
import { useAdminListDoctorsQuery,
         useAdminBlockDoctorMutation,
         useAdminUnblockDoctorMutation
       } from "../../slices/adminSlices/adminApiSlice";
import { IDoc } from '../../../../shared/doctor.interface'


const ManageDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoc[]>([]);
  const { data, error, isLoading, refetch } = useAdminListDoctorsQuery({});
  const [blockDoctor] = useAdminBlockDoctorMutation();
  const [unblockDoctor] = useAdminUnblockDoctorMutation();

  const navigate = useNavigate();

  const navigateToDoctorDetails = (doctor:IDoc) => {
    navigate("/admin/doctor-details", {state: {doctor}})
  }

  const confirmAndHandleAction = (email: string, action: "block" | "unblock") => {
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

  const handleAction = async (email:string, action: "block" | "unblock") => {
    
    try{
      if (action === "block") {
        await blockDoctor({email}).unwrap();
        toast.success('Doctor blocked successfully');

      } else if (action === "unblock") {
        await unblockDoctor({email}).unwrap();
        toast.success('Doctor unblocked successfully');
      }
      refetch();
    } catch(error:any){
      toast.error(error.message || "Action failed")
    }    
  };


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
      <h1 className="my-4 text-center">Manage Doctors</h1>
      {doctors?.length === 0 ? (
        <p className="text-center text-danger fs-4 mt-5">No Registered Doctors found</p>
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
              <th>Actions</th>
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
                <td>
                  {doctor.isBlocked ? (
                    <Button
                      variant="success"
                      className="btn-sm"
                      onClick={() => confirmAndHandleAction(doctor.email,'unblock')}
                    >
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => confirmAndHandleAction(doctor.email,'block')}
                    >
                      Block
                    </Button>
                  )}
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
