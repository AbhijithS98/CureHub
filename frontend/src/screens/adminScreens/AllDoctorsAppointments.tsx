import React,{useState, useEffect} from "react";
import { Container, Table, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { IAppointmentPd, IPopulatedDoctor, IPopulatedUser } from "../../types/IAppointmentPd";
import { useAdminListAppointmentsQuery } from "../../slices/adminSlices/adminApiSlice";

const AllDoctorsAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointmentPd[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<IAppointmentPd[]>([]);
  const [filter, setFilter] = useState<string>("");
  const {data, error, isLoading, refetch} = useAdminListAppointmentsQuery({})



  useEffect(() => {
    if (data) {   
      console.log("Fetched data:", data);
      setAppointments(data);
      setFilteredAppointments(data);

    } else if (error) {
      console.error("Error fetching doctors:", error); 
      toast.error("failed to fetch doctors");
    }
  }, [data,error]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);

      setFilteredAppointments(
      appointments.filter((appointment) => {
        const doctorName = (appointment.doctor as IPopulatedDoctor)?.name?.toLowerCase() || "";
        const userName = (appointment.user as IPopulatedUser)?.name?.toLowerCase() || "";
        const appointmentDate = new Date(appointment.date).toLocaleDateString('en-GB').toLowerCase();
        const status = appointment.status.toLowerCase();

        // Match the filter value with any of the fields
        return (
          doctorName.includes(value) ||
          userName.includes(value) ||
          appointmentDate.includes(value) ||
          status.includes(value)
        );
      })
    );
  };


  if (isLoading) {
    return <p className="text-center text-primary fs-4 mt-5">Loading doctor's appointments...</p>;
  }
  return (
    <Container style={{marginTop: 90}}>
    <div className="container mt-5">
      <h2 className="text-center text-primary">All Doctor Appointments</h2>

      <Form.Group className="mb-3">
        <Form.Label>Filter by Doctor, Patient, Date, or Status</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter search term..."
          value={filter}
          onChange={handleFilterChange}
        />
      </Form.Group>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Index</th>
            <th>Doctor Name</th>
            <th>Patient Name</th>  
            <th>Date</th>
            <th>Time slot</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment,index) => (
            <tr key={appointment._id.toString()}>
              <td>{index+1}</td>
              <td>{(appointment.doctor as IPopulatedDoctor).name}</td>
              <td>{(appointment.user as IPopulatedUser).name}</td>
              <td>{new Date(appointment.date).toLocaleDateString('en-GB')}</td>
              <td>{appointment.time}</td>
              <td>{appointment.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </Container>
  );
};

export default AllDoctorsAppointments;
