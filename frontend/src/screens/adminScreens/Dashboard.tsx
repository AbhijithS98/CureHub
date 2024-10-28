import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AdminDashboard: React.FC = () => {
  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4 text-primary">Admin Dashboard</h1>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow p-3 bg-white rounded">
            <Card.Body>
              <Card.Title>Doctor Approval Requests</Card.Title>
              <Card.Text>
                View and manage all doctor's request.
              </Card.Text>
              <Card.Link href="/admin/list-doctors">Manage Requests</Card.Link>
            </Card.Body>
          </Card> 
        </Col>

        <Col md={4}>
          <Card className="shadow p-3 bg-white rounded">
            <Card.Body>
              <Card.Title>Manage Users</Card.Title>
              <Card.Text>
                View and manage all users.
              </Card.Text>
              <Card.Link href="/admin/list-users">Manage Users</Card.Link>
            </Card.Body>
          </Card> 
        </Col>
      
      </Row>
    </Container>
  );
};

export default AdminDashboard;
