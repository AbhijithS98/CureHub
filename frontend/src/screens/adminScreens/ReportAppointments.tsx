import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useLazyAdminAppointmentReportQuery, 
         useAdminListDoctorsQuery,
         useAdminListUsersQuery
       } from '../../slices/adminSlices/adminApiSlice';
import { IAppointmentPd, IPopulatedDoctor, IPopulatedUser } from '../../types/IAppointmentPd';
import { IDoc } from '../../types/doctorInterface';
import { Iuser } from '../../types/userInterface';
import { downloadAptReportPDF } from '../../utils/AptReportPdfDownloader';

const AppointmentReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [reportData,setReportData] = useState<IAppointmentPd[] | []>([]);

  const [fetchAppointmentReport, { data, isLoading, error }] = useLazyAdminAppointmentReportQuery();
  const { data:users, isLoading: usersLoading } = useAdminListUsersQuery({});
  const { data:doctors, isLoading: doctorsLoading } = useAdminListDoctorsQuery({});

  const handleGenerateReport = () => {
    console.log("dId:",doctorId);
    console.log("pId:",patientId);
    
    fetchAppointmentReport({ startDate, endDate, doctorId, patientId });
  };

  useEffect(()=>{
    if(data){
      console.log("data here is: ",data.Result);
      setReportData(data.Result)
    }
  },[data])

  return (
    <Container style={{marginTop: 90}}>
    
      <h2 className="mb-4 text-center">Appointment Report</h2>

      {/* Filter Form */}
      <form className="row g-3 mb-4 align-items-end">
        <div className="col-md-3">
          <label htmlFor="startDate" className="form-label">Start Date</label>
          <input
            type="date"
            id="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="endDate" className="form-label">End Date</label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
            <label htmlFor="doctorId" className="form-label">Select Doctor</label>
              <select
                id="doctorId"
                className="form-select"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                disabled={doctorsLoading}
              >
                <option value="">All Doctors</option>
                {doctors?.map((doctor: IDoc) => (
                  <option key={doctor._id.toString()} value={doctor._id.toString()}>
                    {doctor.name}
                  </option>
                ))}
              </select>
        </div>
        <div className="col-md-3">
            <label htmlFor="patientId" className="form-label">Select Patient</label>
            <select
              id="patientId"
              className="form-select"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={usersLoading}
            >
              <option value="">All Patients</option>
              {users?.map((user: Iuser) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
        </div>
        <div className="col-12 text-end">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleGenerateReport}
          >
            Generate Report
          </button>
        </div>
      </form>

      {/* Report Table */}
      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-danger">Error fetching reports.</p>}

      {!isLoading && !error && reportData.length > 0 ? (
        <>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Index</th>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>              
              </tr>
            </thead>
            <tbody>
              {reportData.map((appointment:IAppointmentPd, index:number) => (
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
          </table>
        </div>
        {/* Export Button */}
        <div className="text-end mt-3">
          <button className="btn btn-success" onClick={() => downloadAptReportPDF(reportData,startDate,endDate)}>
            Export as PDF
          </button>
        </div>
        </>
      ):(
        <div className="text-center mt-3">
          <h3 className='text-danger'>No data available</h3>
        </div>
      )}
    </Container>
  );
};

export default AppointmentReport;
