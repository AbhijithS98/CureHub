import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
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
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h3>Loading...</h3>
      </Container>
    );
  }

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Card.Body>
          <Card.Title>
            <h2>Thank You for Your Booking!</h2>
          </Card.Title>
          <Card.Text className="mt-4">
            <p>Your appointment have been successfully booked.</p>
            <p>
              An email with the booking details has been sent to your email
              address.
            </p>
          </Card.Text>
          <Card.Text className="mt-4">
            <h4>Get well soon !</h4>
          </Card.Text>
          <div className="d-flex justify-content-center mt-4">
            <Button variant="dark" onClick={handleHomeClick}>
              Go to Home
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ThankyouScreen;
