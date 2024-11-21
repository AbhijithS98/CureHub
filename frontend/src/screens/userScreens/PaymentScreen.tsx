import React,{ useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.js';
import { Button, Container, Row, Col, Card, ListGroup} from 'react-bootstrap';
import { toast } from 'react-toastify';
import Swal from "sweetalert2"; 
import { useUserBookSlotMutation,
         useUserGetWalletQuery,
       } from '../../slices/userSlices/userApiSlice.js';
import { IWallet } from '../../types/walletInterface';
import './style.css';


const PaymentScreen: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.userAuth);
  const { data, error, isLoading:walletLoading } = useUserGetWalletQuery({});
  const wallet: IWallet | null = data?.wallet;
  const [bookSlot,isLoading] = useUserBookSlotMutation();
  const location = useLocation();
  const navigate = useNavigate();

  type PaymentMethod = 'Razorpay' | 'Wallet';
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Razorpay');
  const { doctor, selectedDate, selectedSlot } = location.state;

  
  const doctorFee = doctor.consultationFee; 
  const applicationCharge = 70; 
  const gst = (doctorFee + applicationCharge) * 0.10; 
  const finalAmount:number = doctorFee + applicationCharge + gst;

  // Payment handler (Razorpay integration)
  const handlePayment = async () => {

    if(paymentMethod === 'Wallet'){
      //WALLET PAYMENT
        if (!wallet || wallet.balance < finalAmount) {
          toast.error('Insufficient wallet balance!');
          return;
        }
        
      try {
        const result = await Swal.fire({
          title: "Confirmation on booking!",
          text: `You are about to pay Rs.${finalAmount} from your wallet.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, I confirm!",
          cancelButtonText: "Cancel",
        });

        if(result.isConfirmed){
          const bookingDetails = {
            userEmail: userInfo?.email,
            slotId: selectedDate._id,
            timeSlotId: selectedSlot._id,
            doctorId: doctor._id,
            paymentMethod,
            amount: finalAmount,
          };
  
          await bookSlot({bookingDetails}).unwrap();
          toast.success('Payment successful via wallet!');
          navigate('/user/thank-you');
        }       
      } catch (error:any) {
        toast.error(error.data.message || 'Failed to complete payment!');
      }

    }else{
      //RAZORPAY PAYMENT
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
            
            const bookingDetails = { userEmail: userInfo?.email,
                                     slotId: selectedDate._id,
                                     timeSlotId: selectedSlot._id, 
                                     doctorId: doctor._id,
                                     paymentMethod,
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
                  <strong>GST (10%):</strong> ₹{gst.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4><strong>Total Amount:</strong> ₹{finalAmount.toFixed(2)}</h4>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <div>
            <label htmlFor="paymentMethod" className="form-label">
              Select Payment Method
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
          </div>
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
