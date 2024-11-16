import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.js';
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import './style.css';
import { toast } from 'react-toastify';

const PaymentScreen: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.userAuth);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract doctor, selected slot, and totalAmount from location state
  const { doctor, selectedSlot } = location.state;

  // Calculating detailed breakdown
  const doctorFee = doctor.consultationFee; // Assuming doctor fee is part of doctor data
  const applicationCharge = 100; // Example application fee
  const gst = (doctorFee + applicationCharge) * 0.18; // 18% GST
  const finalAmount:number = doctorFee + applicationCharge + gst;

  // Payment handler (e.g., Razorpay integration)
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
        key: 'rzp_test_SLWTHwkkbKB9bv', // Replace with your Razorpay key
        amount: finalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'CURE HUB',
        description: `Payment for appointment with Dr. ${doctor.name}`,
        order_id: data.order.id,
        handler: async function (response: any) {
          // On successful payment, you can confirm the appointment
          toast.success('Payment successful!');
          navigate("/user/thank-you")
          // // Proceed with booking logic here (e.g., update database, send confirmation)
          // navigate('/confirmation', { state: { doctor, selectedSlot, response } });
        },
        prefill: {
          name: userInfo?.name, // You can fill user details here
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
              <h5>Selected Slot: {selectedSlot}</h5>
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
