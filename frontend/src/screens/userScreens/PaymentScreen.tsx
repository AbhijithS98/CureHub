import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.js';
import { Button, Container, Row, Col, Card, ListGroup, Spinner} from 'react-bootstrap';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useUserBookSlotMutation, useUserGetWalletQuery } from '../../slices/userSlices/userApiSlice.js';
import { IWallet } from '../../types/walletInterface';
import './style.css';

const PaymentScreen: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.userAuth);
  const { data, error, isLoading: walletLoading } = useUserGetWalletQuery({});
  const wallet: IWallet | null = data?.wallet;
  const [bookSlot, {isLoading:bookingLoading}] = useUserBookSlotMutation();
  const location = useLocation();
  const navigate = useNavigate();

  type PaymentMethod = 'Razorpay' | 'Wallet';
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Razorpay');
  const { doctor, selectedDate, selectedSlot } = location.state;

  const doctorFee = doctor.consultationFee;
  const applicationCharge = 70;
  const gst = (doctorFee + applicationCharge) * 0.1;
  const finalAmount: number = doctorFee + applicationCharge + gst;

  // Payment handler (Razorpay integration)
  const handlePayment = async () => {
    if (paymentMethod === 'Wallet') {
      // Wallet payment
      if (!wallet || wallet.balance < finalAmount) {
        toast.error('Insufficient wallet balance!');
        return;
      }

      try {
        const result = await Swal.fire({
          title: 'Confirmation on booking!',
          text: `You are about to pay ₹${finalAmount} from your wallet.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, I confirm!',
          cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
          const bookingDetails = {
            userEmail: userInfo?.email,
            slotId: selectedDate._id,
            timeSlotId: selectedSlot._id,
            doctorId: doctor._id,
            paymentMethod,
            amount: finalAmount,
          };

          await bookSlot({ bookingDetails }).unwrap();
          toast.success('Payment successful via wallet!');
          navigate('/user/thank-you');
        }
      } catch (error: any) {
        toast.error(error.data.message || 'Failed to complete payment!');
      }
    } else {
      // Razorpay payment
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: finalAmount, currency: 'INR' }),
      });

      const data = await response.json();
      if (data.success) {
        const options = {
          key: 'rzp_test_SLWTHwkkbKB9bv',
          amount: finalAmount * 100,
          currency: 'INR',
          name: 'CURE HUB',
          description: `Payment for appointment with Dr. ${doctor.name}`,
          order_id: data.order.id,
          handler: async function (response: any) {
            const bookingDetails = {
              userEmail: userInfo?.email,
              slotId: selectedDate._id,
              timeSlotId: selectedSlot._id,
              doctorId: doctor._id,
              paymentMethod,
              amount: finalAmount,
            };
            await bookSlot({ bookingDetails }).unwrap();
            toast.success('Payment successful!');
            navigate('/user/thank-you');
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
      } else {
        toast.error('Failed to create Razorpay order');
      }
    }
  };

  return (
    <Container className="payment-screen bg-light p-4 rounded shadow-sm mt-5">
      <Row className="mb-4 text-center">
        <Col>
          <h3 className="text-primary fw-bold">Payment Details</h3>
          <p className="text-muted">
            You are about to pay for an appointment with <strong>Dr. {doctor.name}</strong>
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white text-center fw-bold">
              Appointment Summary
            </Card.Header>
            <Card.Body>
              <h6 className="mb-3">Selected Date:   {new Date(selectedDate.date).toDateString()}</h6>
              <h6 className="mb-3">Selected Time:   {selectedSlot.time}</h6>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Doctor :</strong> {doctor.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Specialized in:</strong> {doctor.specialization}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Doctor's Fee:</strong> ₹{doctor.consultationFee.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Application Fee:</strong> ₹{applicationCharge.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>GST (10%):</strong> ₹{gst.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item className="text-danger fw-bold">
                  <h4>Total Amount: ₹{finalAmount.toFixed(2)}</h4>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
            <label htmlFor="paymentMethod" className="form-label">
              Select Payment Method:
            </label>
            <select
              id="paymentMethod"
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            >
              <option value="Razorpay">Razorpay</option>
              <option value="Wallet">Wallet</option>
            </select>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <Button
            variant="primary"
            className="px-4 py-2 fw-bold"
            onClick={handlePayment}
            disabled={bookingLoading}
          >
            {bookingLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-currency-rupee"></i> Pay Now
              </>
            )}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentScreen;
