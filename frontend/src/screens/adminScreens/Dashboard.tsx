import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/adminComponents/Sidebar";
import { Container, Row, Col, Card, Nav, Button } from "react-bootstrap";
import { FaUserMd, FaUser, FaClipboardList, FaCalendarAlt, FaDollarSign, FaChartBar } from "react-icons/fa";
import { Line } from "react-chartjs-2"; // Chart.js integration
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./style.css"; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Chart.js configuration
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Appointments',
      data: [65, 59, 80, 81, 56, 55],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }
  ]
};

const AdminDashboard: React.FC = () => {
  const chartRef = useRef<any>(null); // Create a ref for the chart
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Cleanup chart when component is unmounted
  useEffect(() => {
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance) {
        chartInstance.destroy(); // Destroy the chart instance on unmount
      }
    };
  }, []);

  return (
    <div className="admin-dashboard-container">

      {/* Sidebar Component */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <Container className="main-content">
        <h2 className="text-center mb-5 text-primary">Admin Dashboard</h2>
        <Row className="g-4">
          {/* Info Cards */}
          <Col md={3}>
            <Card className="dashboard-card shadow-sm">
              <Card.Body>
                <FaClipboardList className="dashboard-icon text-primary" />
                <Card.Title className="mt-3">Total Bookings</Card.Title>
                <Card.Text>1050</Card.Text>
              </Card.Body>
            </Card> 
          </Col>

          <Col md={3}>
            <Card className="dashboard-card shadow-sm">
              <Card.Body>
                <FaUserMd className="dashboard-icon text-primary" />
                <Card.Title className="mt-3">Total Doctors</Card.Title>
                <Card.Text>50</Card.Text>
              </Card.Body>
            </Card> 
          </Col>

          <Col md={3}>
            <Card className="dashboard-card shadow-sm">
              <Card.Body>
                <FaUser className="dashboard-icon text-primary" />
                <Card.Title className="mt-3">Total Users</Card.Title>
                <Card.Text>2000</Card.Text>
              </Card.Body>
            </Card> 
          </Col>

          <Col md={3}>
            <Card className="dashboard-card shadow-sm">
              <Card.Body>
                <FaDollarSign className="dashboard-icon text-primary" />
                <Card.Title className="mt-3">Total Revenue</Card.Title>
                <Card.Text>$50000</Card.Text>
              </Card.Body>
            </Card> 
          </Col>

          {/* Chart */}
          <Col md={12}>
            <Card className="dashboard-card shadow-sm">
              <Card.Body>
                <FaChartBar className="dashboard-icon text-primary" />
                <Card.Title className="mt-3">Appointment History</Card.Title>
                <Line data={chartData} />
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
