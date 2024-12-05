import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useLazyAdminRevenueReportQuery } from '../../slices/adminSlices/adminApiSlice';
import { Itransaction } from '../../types/transactionInterface';
import { downloadRevenueReportPDF } from '../../utils/RevenueReportPdf';

interface populatedDoc {
  _id: string,
  consultationFee: number
}

const RevenueReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData,setReportData] = useState<Itransaction[] | []>([]);
  const [fetchRevenueReport, { data, isLoading, error }] = useLazyAdminRevenueReportQuery();

  useEffect(() => {
    if (data) {
      console.log("Revenue data: ", data);
      setReportData(data.RevenueReports)
    }
    
  }, [data]);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      fetchRevenueReport({ startDate, endDate });
    }
  };

  return (
    <Container style={{ marginTop: '90px' }}>
      <h2 className="text-center mb-4">Revenue Report</h2>

      <Form onSubmit={handleGenerateReport} className="mb-4">
        <Row className="align-items-center">
          <Col md={4}>
            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          
        </Row>
        <div className="col-12 text-end mt-3">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleGenerateReport}
          >
            Generate Report
          </button>
        </div>
      </Form>

      {isLoading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">Error fetching reports.</Alert>}

      {!isLoading && !error && reportData.length > 0 ? (
        <>
          <Row className="mb-3">
            <Col>
              <h4>Total Revenue: ₹{data?.TotalRevenue.toFixed(2)}</h4>
              <h4>Total Profit: ₹{reportData.reduce((acc, curr) => acc + curr.appFee, 0)}</h4>
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead className="thead-dark">
              <tr>
                <th>Index</th>
                <th>Transaction Date</th>
                <th>Amount (₹)</th>
                <th>Profit (₹)</th>
                <th>Status</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((transaction: Itransaction, index:number) => (
                <tr key={transaction._id.toString()}>
                  <td>{index+1}</td>
                  <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                  <td>{transaction.amount.toFixed(2)}</td>
                  <td>{transaction.appFee}</td>      
                  <td>{transaction.status}</td>
                  <td>{transaction.method}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Export Button */}
          <div className="text-end mt-3">
            <button className="btn btn-success" onClick={() => downloadRevenueReportPDF(reportData,startDate,endDate)}>
              Export as PDF
            </button>
          </div>
        </>
      ) :
      (
        <div className="text-center mt-3">
          <h3 className='text-danger'>No data available</h3>
        </div>
      )
      }
    </Container>
  );
};

export default RevenueReport;
