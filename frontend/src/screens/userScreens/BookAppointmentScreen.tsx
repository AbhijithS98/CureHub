import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card, ListGroup, Form, Image } from 'react-bootstrap';
import { useDoctorGetAvailabilityQuery } from '../../slices/doctorSlices/doctorApiSlice';
const backendURL = import.meta.env.VITE_BACKEND_URL;
import './style.css';

interface Slot {
  _id: string,
  doctor: string; 
  date: Date;
  timeSlots: {
    time: string;  
    status: 'Available' | 'Booked' ;
    _id: string; 
  }[]; 
}

interface TimeSlot {
  time: string;  
  status: 'Available' | 'Booked' ;
  _id: string; 
}

const AppointmentBookingScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctor } = location.state;
  const {data, refetch:availabilityRefetch} = useDoctorGetAvailabilityQuery(doctor._id);
  const [selectedDate, setSelectedDate] = useState<Slot | null>(null); 
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null); 
  const [slots, setSlots] = useState<Slot[] | null>(data?.availability || []);

  const handleDateSelection = (slot: Slot) => {
    setSelectedDate(slot);
    setSelectedSlot(null); 
  };

  const handleSlotSelection = (timeSlot: TimeSlot) => {
    setSelectedSlot(timeSlot);
  };

  const handleConfirmAppointment = () => {
    if (!selectedSlot) {
      alert('Please select a slot before proceeding.');
      return;
    }
    // Navigate to confirmation screen
    navigate('/user/payment', { state: { doctor, selectedDate, selectedSlot } });
  };

  useEffect(()=>{
    if(data){
      setSlots(data.availability)
    }
    console.log("data isss: ",data);
    
  },[data])

  return (
    <Container className="appointment-booking-screen mt-5">
      {/* Doctor Info */}
      <Row className="mb-4 text-center">
        <Col>
          <Image
            src={`${backendURL}/${doctor.profilePicture}`}
            alt={`${doctor.name}'s profile`}
            roundedCircle
            className="doc-pro-img mb-3"
          />
          <h3 className="text-primary">Book Appointment with Dr. {doctor.name}</h3>
          <p className="text-muted">Specialization: {doctor.specialization}</p>
        </Col>
      </Row>

      {/* Check if slots are available */}
      {slots && slots.length > 0 ? (
        <>
          {/* Available Dates */}
          <Row className="mb-4">
            <Col>
              <h5 className="text-primary">Select a Date</h5>
              <div className="date-list">
                {slots.map((slot) => (
                  <Button
                    key={slot._id}
                    variant={selectedDate?._id === slot._id ? 'primary' : 'outline-primary'}
                    className="m-2"
                    onClick={() => handleDateSelection(slot)}
                  >
                    {new Date(slot.date).toDateString()}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>

          {/* Time Slots for Selected Date */}
          {selectedDate && (
            <Row>
              <Col>
                <h5 className="text-primary">Available Slots</h5>
                <Card className="shadow-sm">
                  <Card.Body>
                    <ListGroup>
                      {/* Find and display slots for the selected date */}
                      {slots
                        .find((slot) => slot._id === selectedDate._id)
                        ?.timeSlots.map((timeSlot) => (
                          <ListGroup.Item
                            key={timeSlot._id}
                            className={`d-flex justify-content-between align-items-center ${
                              timeSlot.status==='Booked' ? 'bg-light text-muted' : ''
                            }`}
                            style={{
                              cursor: timeSlot.status==='Booked' ? 'not-allowed' : 'pointer',
                            }}
                            onClick={() =>
                              timeSlot.status==='Available' && handleSlotSelection(timeSlot)
                            }
                          >
                            <span>{timeSlot.time}</span>
                            {timeSlot.status!=='Booked' ? (
                              <Form.Check
                                type="radio"
                                name="slot"
                                checked={selectedSlot?._id === timeSlot._id}
                                onChange={() => handleSlotSelection(timeSlot)}
                              />
                            ) : (
                              <small className="text-danger">Booked</small>
                            )}
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Confirm Button */}
          <Row>
            <Col className="text-center mt-4">
              <Button
                variant="success"
                disabled={!selectedSlot}
                onClick={handleConfirmAppointment}
              >
                Confirm Appointment
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <Row>
          <Col>
            <p className="text-danger text-center">No slots available at the moment.</p>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AppointmentBookingScreen;
