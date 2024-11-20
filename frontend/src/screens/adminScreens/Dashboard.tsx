import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUserMd, FaUser, FaClipboardList, FaCalendarAlt } from "react-icons/fa";
import "./style.css"; 

const AdminDashboard: React.FC = () => {
  return (
    <Container className="admin-dashboard mt-5">
      <h2 className="text-center mb-5 text-primary">Admin Dashboard</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card className="dashboard-card shadow-sm">
            <Card.Body>
              <FaClipboardList className="dashboard-icon text-primary" />
              <Card.Title className="mt-3">Doctor Approval Requests</Card.Title>
              <Card.Text>View and manage all doctor's request.</Card.Text>
              <Card.Link href="/admin/list-unapproved-doctors" className="btn btn-primary">
                View Requests
              </Card.Link>
            </Card.Body>
          </Card> 
        </Col>

        <Col md={4}>
          <Card className="dashboard-card shadow-sm">
            <Card.Body>
              <FaUser className="dashboard-icon text-primary" />
              <Card.Title className="mt-3">Manage Users</Card.Title>
              <Card.Text>View and manage all users.</Card.Text>
              <Card.Link href="/admin/list-users" className="btn btn-primary">
                View List
              </Card.Link>
            </Card.Body>
          </Card> 
        </Col>

        <Col md={4}>
          <Card className="dashboard-card shadow-sm">
            <Card.Body>
              <FaUserMd className="dashboard-icon text-primary" />
              <Card.Title className="mt-3">Manage Doctors</Card.Title>
              <Card.Text>View and manage all doctors.</Card.Text>
              <Card.Link href="/admin/list-doctors" className="btn btn-primary">
                View List
              </Card.Link>
            </Card.Body>
          </Card> 
        </Col>


        <Col md={3}>
          <Card className="dashboard-card shadow-sm">
            <Card.Body>
              <FaCalendarAlt className="dashboard-icon text-primary" />
              <Card.Title className="mt-3">Doctor's Appointments</Card.Title>
              <Card.Text>View and manage doctor appointments.</Card.Text>
              <Card.Link href="/admin/doctors-appointments" className="btn btn-primary">
                View Appointments
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>


      </Row>
    </Container>
  );
};

export default AdminDashboard;
