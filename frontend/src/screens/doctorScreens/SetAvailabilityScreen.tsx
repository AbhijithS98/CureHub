import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { RRule, Frequency } from 'rrule';
import TimePicker from 'react-time-picker';
import { Card, Button, Form, Table, Row, Col, Pagination } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { RootState } from '../../store.js';
import { useDoctorAddSlotsMutation } from '../../slices/doctorSlices/doctorApiSlice';
import 'react-time-picker/dist/TimePicker.css';

interface IAvailability {
  doctor: string; 
  date: Date;
  timeSlots: {
    time: string; 
    status: 'Available' | 'Booked';
  }[]; 
}

const SetAvailability: React.FC = () => {
  const { doctorInfo } = useSelector((state: RootState) => state.doctorAuth);
  const location = useLocation();
  const { docEmail } = location.state || {};
  const [frequency, setFrequency] = useState<Frequency>(RRule.WEEKLY);
  const [interval, setInterval] = useState<number>(1);
  const [weekdays, setWeekdays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [slotDuration, setSlotDuration] = useState<number>(15);
  const [generatedSlots, setGeneratedSlots] = useState<IAvailability[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [viewingDate, setViewingDate] = useState<IAvailability | null>(null);
  const [addSlots,{isLoading}] = useDoctorAddSlotsMutation();

  const itemsPerPage = 10;

  const weekdaysMap = {
    MO: RRule.MO,
    TU: RRule.TU,
    WE: RRule.WE,
    TH: RRule.TH,
    FR: RRule.FR,
    SA: RRule.SA,
    SU: RRule.SU,
  };

  const validateInputs = () => {
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates.");
      return false;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be greater than start date.");
      return false;
    }
    if (frequency === RRule.WEEKLY && weekdays.length === 0) {
      toast.error("Please select at least one weekday for weekly frequency.");
      return false;
    }
    if (!startTime || !endTime) {
      toast.error("Please select start and end times.");
      return false;
    }
    if (slotDuration <= 0) {
      toast.error("Slot duration must be greater than 0.");
      return false;
    }
    return true;
  };

  const generateFinalSlots = () => {
    if(generatedSlots.length){
      toast.info("Clear the generated slots to generate new")
      return;
    }
    if (!validateInputs()) return;

    try {
      const rruleWeekdays = weekdays.map(
        (day) => weekdaysMap[day as keyof typeof weekdaysMap]
      );
      const rule = new RRule({
        freq: frequency,
        interval,
        byweekday: rruleWeekdays,
        dtstart: new Date(startDate),
        until: new Date(endDate),
      });
      const dates = rule.all();

      const toMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };
      const startMinutes = toMinutes(startTime!);
      const endMinutes = toMinutes(endTime!);

      if (startMinutes >= endMinutes) {
        toast.error("Start time must be earlier than end time.");
        return;
      }

      // Generate time slots
      const tSlots: string[] = [];
      for (let i = startMinutes; i < endMinutes; i += slotDuration) {
        const hours = Math.floor(i / 60)
          .toString()
          .padStart(2, "0");
        const minutes = (i % 60).toString().padStart(2, "0");
        const time = `${hours}:${minutes}`;
        tSlots.push(time);
      }

      const slotTimeObjects:{ time: string;                               
                              status: 'Available' | 'Booked';                             
                            }[] = tSlots.map((time) => (
      {
        time,
        status: 'Available',
      }));

      const FinalSlots: IAvailability[] = [];
      dates.forEach((date) => {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        FinalSlots.push({
          doctor: doctorInfo?._id as string,
          date: new Date(formattedDate), 
          timeSlots: slotTimeObjects,
        });
      });

      setGeneratedSlots(FinalSlots);
      setCurrentPage(1); 
      toast.success("Slots generated successfully!");
    } catch (error) {
      console.error("Error generating slots:", error);
      toast.error("Failed to generate slots.");
    }
  };


  const removeSlot = (viewingDate: IAvailability, timeSlotIndex: number) => {
    setGeneratedSlots((prevSlots) => {
      const updatedSlots = prevSlots.map((slot) => {
        if (slot.date.toISOString() === viewingDate.date.toISOString()) {
          return {
            ...slot,
            timeSlots: slot.timeSlots.filter((_, index) => index !== timeSlotIndex),
          };
        }
        return slot;
      }).filter((slot) => slot.timeSlots.length > 0); 
  
      if (updatedSlots.length !== prevSlots.length || updatedSlots.some(s => s.timeSlots.length < viewingDate.timeSlots.length)) {
        toast.success('Time slot removed successfully!');
      } else {
        toast.error('Failed to remove the time slot!');
      }
      return updatedSlots;
    });
  
    setViewingDate((prevViewingDate) => {
      if (!prevViewingDate) return null;
      const updatedTimeSlots = prevViewingDate.timeSlots.filter((_, index) => index !== timeSlotIndex);
      return updatedTimeSlots.length > 0
        ? {
            ...prevViewingDate,
            timeSlots: updatedTimeSlots,
          }
        : null;
    });
  };


  const paginateSlots = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return generatedSlots.slice(startIndex, endIndex);
  };

  const submitAvailability = async () => {
    if (generatedSlots.length === 0) {
      toast.error('No availability slots to save.');
      return;
    }
    console.log(generatedSlots);
    
    try {
      await addSlots({ docEmail, newSlots:generatedSlots }).unwrap();
      toast.success('Availability saved successfully!');
      setGeneratedSlots([]);
      setStartDate('');
      setEndDate('');
      setWeekdays([]);
      setStartTime(null);
      setEndTime(null);
      
    } catch (error: any) {
      console.error('Error saving availability:', error);
      toast.error(error.message || 'Failed to save availability.');
    }
  };

  useEffect(()=>{
    if(generatedSlots){
      console.log("generated slots: ",generatedSlots);
    }
  },[generatedSlots])

  return (
    <div>
      <Card className="shadow-sm rounded p-4 mb-5">
        <Card.Body>
          <h2 className="text-center mb-4">Set Availability Slots</h2>
          <Form>
            {/* Frequency and Interval */}
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="frequency">
                  <Form.Label>Frequency</Form.Label>
                  <Form.Select
                    value={frequency}
                    onChange={(e) => setFrequency(parseInt(e.target.value, 10) as Frequency)}
                  >
                    <option value={RRule.DAILY}>Daily</option>
                    <option value={RRule.WEEKLY}>Weekly</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="interval">
                  <Form.Label>Interval</Form.Label>
                  <Form.Control
                    type="number"
                    value={interval}
                    onChange={(e) => setInterval(Number(e.target.value))}
                    min="1"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Start and End Dates */}
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Weekdays for Weekly Frequency */}
            {frequency === RRule.WEEKLY && (
              <Row className="mb-4">
                <Col>
                  <Form.Group controlId="weekdays">
                    <Form.Label>Weekdays</Form.Label>
                    <div className="d-flex flex-wrap gap-3">
                      {Object.keys(weekdaysMap).map((day) => (
                        <Form.Check
                          key={day}
                          type="checkbox"
                          label={day}
                          value={day}
                          checked={weekdays.includes(day)}
                          onChange={(e) => {
                            const selectedDay = e.target.value;
                            setWeekdays((prev) =>
                              prev.includes(selectedDay)
                                ? prev.filter((day) => day !== selectedDay)
                                : [...prev, selectedDay]
                            );
                          }}
                          className="form-check-inline"
                        />
                      ))}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            )}

            {/* Time Slot Settings */}
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group controlId="startTime">
                  <Form.Label>Start Time</Form.Label>
                  <TimePicker
                    value={startTime}
                    onChange={setStartTime}
                    disableClock={true}
                    format="HH:mm"
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="endTime">
                  <Form.Label>End Time</Form.Label>
                  <TimePicker
                    value={endTime}
                    onChange={setEndTime}
                    disableClock={true}
                    format="HH:mm"
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="slotDuration">
                  <Form.Label>Slot Duration (Minutes)</Form.Label>
                  <Form.Select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(Number(e.target.value))}
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Generate Button */}
            <div className="d-flex justify-content-end">
              <Button 
                variant="primary" 
                className="px-4 shadow-sm" 
                onClick={generateFinalSlots}
              >
                Generate Slots
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {generatedSlots.length > 0 && (
        <div className="mt-4">
          <h2 className='pb-3 text-primary'>Generated Slots</h2>

            {viewingDate === null ? (          
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total Slots</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginateSlots().map((slot, index) => (
                    <tr key={index}>
                      <td>{new Date(slot.date).toLocaleDateString('en-GB')}</td>
                      <td>{slot.timeSlots.length}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setViewingDate(slot)}
                        >
                          View Slots
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              // Detail Table: Slots for the Selected Date
              <>             
                <div className="d-flex justify-content-between align-items-center"> 
                  <h4>
                      Slots for {new Date(viewingDate.date).toLocaleDateString('en-GB')} 
                  </h4>
                  <Button variant="secondary" onClick={() => setViewingDate(null)} className="mb-3">
                    Back
                  </Button>
                </div>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingDate.timeSlots.map((timeSlot, index) => (
                      <tr key={index}>
                        <td>{timeSlot.time}</td>
                        <td>{timeSlot.status}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeSlot(viewingDate, index)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}

            {/* Pagination */}
            <Pagination className="mt-3">
              {[...Array(Math.ceil(generatedSlots.length / itemsPerPage)).keys()]
                .map((page) => page + 1)
                .map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
            </Pagination>
    
          <div className="d-flex justify-content-between align-items-center">            
            <Button className="btn btn-danger" onClick={() => setGeneratedSlots([])} >
              Clear Slots
            </Button>
            <Button variant="success" onClick={submitAvailability}>
              Save Slots
            </Button>
          </div>
      </div>
      )}
    </div>
  );
  
};

export default SetAvailability;
