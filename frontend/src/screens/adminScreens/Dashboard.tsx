import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/adminComponents/Sidebar";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUserMd, FaUser, FaClipboardList, FaRupeeSign, FaChartBar } from "react-icons/fa";
import { Line } from "react-chartjs-2"; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useAdminStatsUsersQuery,
         useAdminStatsDoctorsQuery,
         useAdminStatsAppointmentsQuery,
         useAdminStatsRevenueQuery,
         useAdminStatsRefundQuery,
         useAdminAppointmentsChartQuery,
         useAdminRevenueChartQuery
       } from "../../slices/adminSlices/adminApiSlice";
import "./style.css"; 


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface IAppointmentChartData {
  count: number,
  _id: { month: number, year: number}
}

interface IRevenueChartData {
  total: number,
  _id: { month: number, year: number}
}


const AdminDashboard: React.FC = () => {
  const chartRef = useRef<any>(null); // Create a ref for the chart
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: UserStats } = useAdminStatsUsersQuery({});
  const { data: DoctorStats } = useAdminStatsDoctorsQuery({});
  const { data: BookingStats } = useAdminStatsAppointmentsQuery({});
  const { data: RevenueStats } = useAdminStatsRevenueQuery({});
  const { data: RefundStats } = useAdminStatsRefundQuery({});
  const { data: AppointmentTrend } = useAdminAppointmentsChartQuery({});
  const { data: RevenueTrend } = useAdminRevenueChartQuery({});

  const chartData = AppointmentTrend?.Result? AppointmentTrend.Result.map((data: IAppointmentChartData) => ({
    label: `${data._id.month}-${data._id.year}`, // Format: "Month-Year"
    count: data.count
  })) : [];

  const RevenueChartData = RevenueTrend?.Result? RevenueTrend.Result.map((data: IRevenueChartData) => ({
    label: `${data._id.month}-${data._id.year}`, // Format: "Month-Year"
    total: data.total
  })) : [];

  // Chart.js configuration
  const chartDataSet = {
    labels: [...new Set([...chartData?.map((d: any) => d.label), ...RevenueChartData?.map((d: any) => d.label)])],
    datasets: [
      {
        label: 'Appointments',
        data: chartData?.map((d:any) => d.count),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1
      },
      {
        label: 'Revenue',
        data: RevenueChartData?.map((d:any) => d.total),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.1
      }
    ]
  };

  useEffect(()=>{
    if(UserStats || DoctorStats || BookingStats || RevenueStats || RefundStats || AppointmentTrend || RevenueTrend){
      console.log("us:",UserStats);
      console.log("ds:",DoctorStats);
      console.log("as:",BookingStats);
      console.log("revs:",RevenueStats);
      console.log("refs:",RefundStats);
      console.log("at:",AppointmentTrend);
      console.log("rt:",RevenueTrend);
    }
  },[UserStats,DoctorStats,BookingStats,RevenueStats,RefundStats,AppointmentTrend])

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
          <Col md={4}>
            <Card className="dashboard-card shadow-sm">
              <Card.Body>
                <FaClipboardList className="dashboard-icon text-primary" />
                <Card.Title className="mt-3">Active Bookings</Card.Title>
                <Card.Text>{BookingStats?.AppointmentStats.active}</Card.Text>
              </Card.Body>
            </Card> 
          </Col>

          <Col md={4}>
            <Card className="dashboard-card shadow-sm">
              <Card.Body>
                <FaClipboardList className="dashboard-icon text-primary" />
                <Card.Title className="mt-3">Completed Bookings</Card.Title>
                <Card.Text>{BookingStats?.AppointmentStats.completed}</Card.Text>
              </Card.Body>
            </Card> 
          </Col>

          <Col md={4}>
            <Card className="dashboard-card shadow-sm">
              <Card.Body>
                <FaClipboardList className="dashboard-icon text-primary" />
                <Card.Title className="mt-3">Cancelled Bookings</Card.Title>
                <Card.Text>{BookingStats?.AppointmentStats.cancelled}</Card.Text>
              </Card.Body>
            </Card> 
          </Col>

          <Col md={4}>
            <Card className="dashboard-card shadow-sm">
              <Card.Body>
                <FaUserMd className="dashboard-icon text-primary" />
                <Card.Title className="mt-3">Total Doctors</Card.Title>
                <Card.Text>{DoctorStats?.DoctorsCount}</Card.Text>
              </Card.Body>
            </Card> 
          </Col>

          <Col md={4}>
            <Card className="dashboard-card shadow-sm">
              <Card.Body>
                <FaUser className="dashboard-icon text-primary" />
                <Card.Title className="mt-3">Total Users</Card.Title>
                <Card.Text>{UserStats?.usersCount}</Card.Text>
              </Card.Body>
            </Card> 
          </Col>

          <Col md={4}>
            <Card className="dashboard-card shadow-sm">
              <Card.Body>
                <FaRupeeSign className="dashboard-icon text-primary" />
                <Card.Title className="mt-3">Total Revenue</Card.Title>
                <Card.Text>{RevenueStats?.Result[0].total}.00</Card.Text>
              </Card.Body>
            </Card> 
          </Col>

          {/* Chart */}
          <Col md={12}>
            <Card className="dashboard-card shadow-sm">
              <Card.Body>
                <FaChartBar className="dashboard-icon text-primary" />
                <Card.Title className="mt-3">Appointment and Revenue History</Card.Title>
                <Line 
                  ref={chartRef}
                  data={chartDataSet} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Appointments & Revenue Trends' },
                    },
                  }} 
                />
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
