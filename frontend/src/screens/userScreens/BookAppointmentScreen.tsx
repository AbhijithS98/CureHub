import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card, ListGroup, Form, Image } from 'react-bootstrap';
import './style.css';

interface Slot {
  date: Date;
  timeSlots: {
    time: string;
    isBooked: boolean;
    user: string | null; // Assuming `user` is a string (replace with `ObjectId` if required).
    _id: string; // Replace with `ObjectId` if required.
  }[];
  _id: string; // Replace with `ObjectId` if required.
}

const AppointmentBookingScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const doctor = location.state?.doctor;

  const [selectedDate, setSelectedDate] = useState<string | null>(null); // Selected date
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null); // Selected time slot
  const [slots, setSlots] = useState<Slot[] | null>(doctor?.availability || []);

  const handleDateSelection = (dateId: string) => {
    setSelectedDate(dateId);
    setSelectedSlot(null); // Reset slot selection when changing the date
  };

  const handleSlotSelection = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handleConfirmAppointment = () => {
    if (!selectedSlot) {
      alert('Please select a slot before proceeding.');
      return;
    }
    // Navigate to confirmation screen
    navigate('/user/payment', { state: { doctor, selectedSlot } });
  };

  return (
    <Container className="appointment-booking-screen mt-5">
      {/* Doctor Info */}
      <Row className="mb-4 text-center">
        <Col>
          <Image
            src={`http://localhost:5000/${doctor.profilePicture}`}
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
                    variant={selectedDate === slot._id ? 'primary' : 'outline-primary'}
                    className="m-2"
                    onClick={() => handleDateSelection(slot._id)}
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
                        .find((slot) => slot._id === selectedDate)
                        ?.timeSlots.map((timeSlot) => (
                          <ListGroup.Item
                            key={timeSlot._id}
                            className={`d-flex justify-content-between align-items-center ${
                              timeSlot.isBooked ? 'bg-light text-muted' : ''
                            }`}
                            style={{
                              cursor: timeSlot.isBooked ? 'not-allowed' : 'pointer',
                            }}
                            onClick={() =>
                              !timeSlot.isBooked && handleSlotSelection(timeSlot._id)
                            }
                          >
                            <span>{timeSlot.time}</span>
                            {!timeSlot.isBooked ? (
                              <Form.Check
                                type="radio"
                                name="slot"
                                checked={selectedSlot === timeSlot._id}
                                onChange={() => handleSlotSelection(timeSlot._id)}
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
            <p className="text-muted text-center">No slots available at the moment.</p>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AppointmentBookingScreen;
