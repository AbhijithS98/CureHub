import React, { useState } from "react";
import { toast } from 'react-toastify';
import FormContainer from "../../components/FormContainer";
import { Form, Button } from "react-bootstrap";

interface StepTwoProps {
  handleFormData: (data: Partial<FormData>) => void;
  submitForm: () => void;
}

interface FormData {
  specialization: string;
  medicalLicenseNumber: string;
  experience: string;
  idProof: File | null;
}

const StepTwo: React.FC<StepTwoProps> = ({ handleFormData, submitForm }) => {
  const [formData, setFormData] = useState<FormData>({
    specialization: "",
    medicalLicenseNumber: "",
    experience: "",
    idProof: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    handleFormData({ [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prevData) => ({ ...prevData, idProof: file }));
      handleFormData({ idProof: file });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.idProof) {
      toast.error("Please upload a valid ID proof.");
      return;
    }
    submitForm();
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-2" controlId="specialization">
          <Form.Label>Specialization</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Specialization"
            value={formData.specialization}
            name="specialization"
            onChange={handleChange}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="medicalLicenseNumber">
          <Form.Label>Medical License Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Medical License Number"
            value={formData.medicalLicenseNumber}
            name="medicalLicenseNumber"
            onChange={handleChange}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="experience">
          <Form.Label>Years of Experience</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Experience"
            value={formData.experience}
            name="experience"
            onChange={handleChange}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="idProof">
          <Form.Label>Upload ID Proof</Form.Label>
          <Form.Control
            type="file"
            name="idProof"
            onChange={handleFileChange}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default StepTwo;
