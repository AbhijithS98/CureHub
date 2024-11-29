import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaTrash } from 'react-icons/fa';
import TableWithPagination,{ Column} from "../../components/PaginatedTable";
import { useDoctorAddPrescriptionMutation } from "../../slices/doctorSlices/doctorApiSlice";

interface Imedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const AddPrescription = () => {
  const location = useLocation();
  const { appointmentId, patientId } = location.state || {};
  const [AddPrescription] = useDoctorAddPrescriptionMutation();

  const [diagnosis, setDiagnosis] = useState<string>("");
  const [medicine, setMedicine] = useState<Imedication>(
    {
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
    },
  );
  const [medications,setMedications] = useState<Imedication[]>([]);
  const [advice, setAdvice] = useState<string>("");

  const handleAddMedication = () => {
    if(!medicine.name || !medicine.dosage || !medicine.frequency || !medicine.duration){
      toast.error("Enter all medicine details")
      return;
    }
    setMedications([
      ...medications,
      medicine
    ]);
    setMedicine({
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
    })
  };

  const handleRemoveMedication = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!diagnosis || !medications.length){
      toast.error("Missing required fields")
      return;
    }
    const prescriptionData = {
      appointment: appointmentId,
      patient: patientId,
      diagnosis,
      medications,
      advice,
    };
    try{
      await AddPrescription({prescriptionData}).unwrap();
      toast.success("Prescription submitted successfully");
      window.history.back();

    }catch (error: any) {    
      const errorMessage = error.data?.message || error.error || "An unknown error occurred";       
      toast.error(errorMessage);
      console.error("Error submitting prescription:", error);
    }  
  };


  const Columns: Column<Imedication>[] = [
    {
      key: 'name',
      label: 'Medicine name'
    },
    {
      key: 'dosage',
      label: 'Dosage'
    },
    {
      key: 'frequency',
      label: 'Frequency'
    },
    {
      key: 'duration',
      label: 'Duration'
    },
    {
      key: 'remove',
      label: 'Remove',
      render: (_: any, row: Imedication) => {
        const index = medications.indexOf(row); 
        return (
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleRemoveMedication(index)}
          >
            <FaTrash />
          </Button>
        );
      }
    }
  ]

  useEffect(() => {
    if (appointmentId && patientId) {
      console.log("Appointment ID: ", appointmentId);
      console.log("Patient ID: ", patientId);
    }
  }, [appointmentId, patientId]);

  useEffect(() => {
    console.log("md: ",medications);
    
  }, [medications]);

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="bg-light">
            <Card.Header className="text-center bg-primary text-white">
              <h4>Add Prescription</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Diagnosis */}
                <Form.Group className="mb-3" controlId="formDiagnosis">
                  <Form.Label>Diagnosis</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </Form.Group>

                {/* Medications */}
                <h5>Enter Medicine details</h5>
            
                    <Form.Group className="mb-3" controlId={"medicineName"}>
                      <Form.Label>Medicine Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter medicine name"
                        name="name"
                        value={medicine.name}
                        onChange={(e) => setMedicine({ ...medicine, [e.target.name]: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="medicineDosage">
                      <Form.Label>Dosage</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter dosage (e.g., 500mg)"
                        name="dosage"
                        value={medicine.dosage}
                        onChange={(e) =>
                          setMedicine({ ...medicine, [e.target.name]: e.target.value })
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="medicineFrequency">
                      <Form.Label>Frequency</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter frequency (e.g., twice a day)"
                        name="frequency"
                        value={medicine.frequency}
                        onChange={(e) =>
                          setMedicine({ ...medicine, [e.target.name]: e.target.value })
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="medicineDuration">
                      <Form.Label>Duration</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter duration (e.g., 7 days)"
                        name="duration"
                        value={medicine.duration}
                        onChange={(e) =>
                          setMedicine({ ...medicine, [e.target.name]: e.target.value })
                        }
                      />
                    </Form.Group>
                

                {/* Add Medication Button */}
                <Button variant="outline-primary" onClick={handleAddMedication}>
                  Add Medication
                </Button>

                {/* Medications Table */}
                {medications.length ?
                  (
                  <>
                  <h5 className="mt-4">Added Medications</h5>
                  <TableWithPagination data={medications} columns={Columns} rowsPerPage={3}/>
                  </>
                  ) :
                  (
                    ''
                  )
                }

                {/* Additional Advice */}
                <Form.Group className="mb-3 mt-4" controlId="formAdvice">
                  <Form.Label>Additional Advice</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter general advice or follow-up instructions"
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                  />
                </Form.Group>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => window.history.back()}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Submit Prescription
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

export default AddPrescription;
