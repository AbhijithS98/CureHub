import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Container, Row, Col, Card, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { IPrescription } from "../../types/prescriptionInterface";

import { useDoctorGetPrescriptionQuery,
         useDoctorUpdatePrescriptionMutation,
         useDoctorGetSingleAppointmentQuery
       } from "../../slices/doctorSlices/doctorApiSlice";

interface Imedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const ViewPrescription = () => {
  const { preId } = useParams<{ preId: string; }>();
  const navigate = useNavigate();

  const {data} = useDoctorGetPrescriptionQuery(preId!);
  const [updatePrescription] = useDoctorUpdatePrescriptionMutation();
  const [prescription,setPrescription] = useState<IPrescription | null>(null);
  
  // State to hold the editable prescription data
  const [diagnosis, setDiagnosis] = useState<string>(prescription?.diagnosis || "");
  const [medications, setMedications] = useState<Imedication[]>(prescription?.medications || []);
  const [advice, setAdvice] = useState<string | undefined>(prescription?.advice || "");

  const handleAddMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (index: number, key: keyof Imedication, value: string) => {
    const updatedMedications = [...medications];
    updatedMedications[index][key] = value;
    setMedications(updatedMedications);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!diagnosis || medications.length === 0) {
      toast.error("Diagnosis and medications are required.");
      return;
    }
    const updatedPrescription = {
      diagnosis,
      medications,
      advice,
    };

    try {
      await updatePrescription({ id: preId!, updatedPrescription }).unwrap();
      toast.success("Prescription updated successfully!");
      navigate(-1);
      
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.data?.message || "Failed to update the prescription.");
    }
  };

  useEffect(()=>{
    if(data){
      console.log("data is: ", data);
      setPrescription(data.result);
    }
  },[data])
  useEffect(()=>{
    if(prescription){
      console.log("pres is: ", prescription);
      setDiagnosis(prescription.diagnosis);
      setMedications(prescription.medications);
      setAdvice(prescription.advice)
    }
  },[prescription])


  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="bg-light">
            <Card.Header className="text-center bg-primary text-white">
              <h4>View/Edit Prescription</h4>
            </Card.Header>
            <Card.Body>
                <div className="mb-4">
                  <Row>
                    {/* Left Column: Appointment & Patient Details */}
                    <Col md={6}>
                      <div className="p-3 border rounded bg-white shadow-sm">
                        <h5 className="text-primary">Appointment Details:</h5>
                        <p className="mb-2">
                          <strong>Date:</strong> {new Date(data?.result?.appointment?.date).toLocaleDateString('en-GB')}
                        </p>
                        <p>
                          <strong>Time:</strong> {data?.result?.appointment?.time}
                        </p>
                        <hr />
                        <h5 className="text-primary">Patient Details:</h5>
                        <p className="mb-2">
                          <strong>Name:</strong> {data?.result?.patient?.name}
                        </p>
                        <p>
                          <strong>Phone:</strong> {data?.result?.patient?.phone}
                        </p>
                      </div>
                    </Col>

                    {/* Right Column: Doctor Details */}
                    <Col md={6}>
                      <div className="p-3 border rounded bg-white shadow-sm">
                        <h5 className="text-primary">Doctor Details:</h5>
                        <p className="mb-2">
                          <strong>Name:</strong> {data?.result?.doctor?.name}
                        </p>
                        <p className="mb-2">
                          <strong>Specialization:</strong> {data?.result?.doctor?.specialization}
                        </p>
                        <p>
                          <strong>Address:</strong> {data?.result?.doctor?.address.clinicName},
                                                    {data?.result?.doctor?.address.district},
                                                    {data?.result?.doctor?.address.city}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>

              <Form onSubmit={handleSubmit}>
                {/* Diagnosis */}
                <Form.Group className="mb-3" controlId="formDiagnosis">
                  <Form.Label>Diagnosis</Form.Label>
                  <Form.Control
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Medications */}
                <h5>Medications</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map((medication, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Control
                            type="text"
                            value={medication.name}
                            onChange={(e) =>
                              handleMedicationChange(index, "name", e.target.value)
                            }
                            required
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={medication.dosage}
                            onChange={(e) =>
                              handleMedicationChange(index, "dosage", e.target.value)
                            }
                            required
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={medication.frequency}
                            onChange={(e) =>
                              handleMedicationChange(index, "frequency", e.target.value)
                            }
                            required
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={medication.duration}
                            onChange={(e) =>
                              handleMedicationChange(index, "duration", e.target.value)
                            }
                            required
                          />
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveMedication(index)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button variant="outline-primary" onClick={handleAddMedication}>
                  Add Another Medication
                </Button>

                {/* Advice */}
                <Form.Group className="mt-3" controlId="formAdvice">
                  <Form.Label>Additional Advice</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                  />
                </Form.Group>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Update Prescription
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewPrescription;
