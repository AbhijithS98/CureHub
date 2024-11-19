import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.js';
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useUserBookSlotMutation } from '../../slices/userSlices/userApiSlice.js';
import './style.css';


const PaymentScreen: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.userAuth);
  const [bookSlot,isLoading] = useUserBookSlotMutation();
  const location = useLocation();
  const navigate = useNavigate();

  const { doctor, selectedDate, selectedSlot } = location.state;

  
  const doctorFee = doctor.consultationFee; 
  const applicationCharge = 100; 
  const gst = (doctorFee + applicationCharge) * 0.18; 
  const finalAmount:number = doctorFee + applicationCharge + gst;

  // Payment handler (Razorpay integration)
  const handlePayment = async () => {
    const response = await fetch('http://localhost:5000/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: finalAmount, currency: 'INR' }),
    });

    const data = await response.json();
    if(data.success){
      const options = {
        key: 'rzp_test_SLWTHwkkbKB9bv',
        amount: finalAmount * 100, 
        currency: 'INR',
        name: 'CURE HUB',
        description: `Payment for appointment with Dr. ${doctor.name}`,
        order_id: data.order.id,
        handler: async function (response: any) {
          
          const bookingDetails = { slotId: selectedDate._id,
                                   timeSlotId: selectedSlot._id, 
                                   doctorId: doctor._id,
                                   amount: finalAmount
                                 }
                                 console.log("bd: ",bookingDetails);
          await bookSlot({bookingDetails}).unwrap();
          toast.success('Payment successful!');
          navigate("/user/thank-you")
        
        },
        prefill: {
          name: userInfo?.name, 
          email: userInfo?.email,
          contact: userInfo?.phone,
        },
        theme: {
          color: '#0d6efd',
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    
    }else {
      toast.error('Failed to create Razorpay order');
    }
  };

  return (
    <Container className="payment-screen mt-5">
      <Row className="mb-4 text-center">
        <Col>
          <h3 className="text-primary">Payment Details</h3>
          <p className="text-muted">You are about to pay for an appointment with Dr. {doctor.name}</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h6>Selected Date: {new Date(selectedDate.date).toDateString()}</h6>
              <h6>Selected Time: {selectedSlot.time}</h6>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Doctor's Fee:</strong> ₹{doctor.consultationFee.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Application Fee:</strong> ₹{applicationCharge.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>GST (18%):</strong> ₹{gst.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4><strong>Total Amount:</strong> ₹{finalAmount.toFixed(2)}</h4>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <Button variant="primary" onClick={handlePayment}>
            Pay Now
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentScreen;
