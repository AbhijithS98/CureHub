import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { downloadPrescriptionPDF } from "../../utils/PdfDownloader";
import { useUserGetPrescriptionQuery } from "../../slices/userSlices/userApiSlice";

const UserViewPrescription = () => {
  const { preId } = useParams<{ preId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useUserGetPrescriptionQuery(preId!);

  // Prescription data
  const [prescription, setPrescription] = useState(data?.result || null);

  useEffect(() => {
    if (data) {
      setPrescription(data.result);
    }
    if (error) {
      toast.error("Failed to fetch the prescription details.");
    }
  }, [data, error]);

  if (isLoading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (!prescription) {
    return <div className="text-center mt-4">No prescription found.</div>;
  }


  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="bg-light">
            <Card.Header className="text-center bg-primary text-white">
              <h4>Prescription Details</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <Row>
                  {/* Left Column: Appointment & Patient Details */}
                  <Col md={6}>
                    <div className="p-3 border rounded bg-white shadow-sm">
                      <h5 className="text-primary">Appointment Details:</h5>
                      <p className="mb-2">
                        <strong>Date:</strong>{" "}
                        {new Date(prescription.appointment?.date).toLocaleDateString("en-GB")}
                      </p>
                      <p>
                        <strong>Time:</strong> {prescription.appointment?.time}
                      </p>
                      <hr />
                      <h5 className="text-primary">Patient Details:</h5>
                      <p className="mb-2">
                        <strong>Name:</strong> {prescription.patient?.name}
                      </p>
                      <p>
                        <strong>Phone:</strong> {prescription.patient?.phone}
                      </p>
                    </div>
                  </Col>

                  {/* Right Column: Doctor Details */}
                  <Col md={6}>
                    <div className="p-3 border rounded bg-white shadow-sm">
                      <h5 className="text-primary">Doctor Details:</h5>
                      <p className="mb-2">
                        <strong>Name:</strong> {prescription.doctor?.name}
                      </p>
                      <p className="mb-2">
                        <strong>Specialization:</strong> {prescription.doctor?.specialization}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {prescription.doctor?.address?.clinicName},{" "}
                        {prescription.doctor?.address?.district},{" "}
                        {prescription.doctor?.address?.city}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Diagnosis */}
              <div className="mb-4">
                <h5 className="text-primary">Diagnosis</h5>
                <p>{prescription.diagnosis}</p>
              </div>

              {/* Medications */}
              <div className="mb-4">
                <h5 className="text-primary">Medications</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescription.medications.map((medication: any, index: number) => (
                      <tr key={index}>
                        <td>{medication.name}</td>
                        <td>{medication.dosage}</td>
                        <td>{medication.frequency}</td>
                        <td>{medication.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Additional Advice */}
              {prescription.advice && (
                <div className="mb-4">
                  <h5 className="text-primary">Additional Advice</h5>
                  <p>{prescription.advice}</p>
                </div>
              )}

              {/* Back Button */}
              <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Back
                </Button>
                <Button variant="primary" onClick={() => downloadPrescriptionPDF(prescription)}>
                  Download PDF
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserViewPrescription;
