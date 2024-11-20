import React, { useEffect, useState } from "react";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ThankyouScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Booking Confirmed!",
        showConfirmButton: false,
        timer: 1500,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleHomeClick = (): void => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <Container
        className="d-flex flex-column justify-content-center align-items-center bg-light"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <h3 className="mt-3 text-primary">Processing your booking...</h3>
      </Container>
    );
  }

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center bg-light"
      style={{ height: "100vh" }}
    >
      <Card
        className="shadow-lg"
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "20px",
          textAlign: "center",
          border: "none",
          borderRadius: "10px",
        }}
      >
        <Card.Body>
          <Card.Title>
            <h2 className="text-success fw-bold">Thank You for Your Booking!</h2>
          </Card.Title>
          <Card.Text className="mt-4">
            <p className="text-secondary">
              Your appointment has been successfully booked.
            </p>
            <p className="text-secondary">
              An email with the booking details has been sent to your email address.
            </p>
          </Card.Text>
          <Card.Text className="mt-4">
            <h4 className="text-primary fw-light">Get well soon!</h4>
          </Card.Text>
          <div className="d-flex justify-content-center mt-4">
            <Button variant="success" size="lg" onClick={handleHomeClick}>
              Go to Home
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ThankyouScreen;
