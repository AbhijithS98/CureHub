import React, { useState } from "react";
import { toast } from 'react-toastify';
import FormContainer from "../../components/FormContainer";
import { Form, Button } from "react-bootstrap";

interface StepOneProps {
  nextStep: () => void;
  handleFormData: (data: Partial<FormData>) => void;
}

interface FormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

const StepOne: React.FC<StepOneProps> = ({ nextStep, handleFormData }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    handleFormData({ [name]: value });
  };

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    nextStep();
  };      

  return (
  <FormContainer>
    <h1>Register As Doctor</h1>
    <Form onSubmit={handleSubmit}>

      <Form.Group className="my-2" controlId="name">
        <Form.Label>Enter Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            required
          ></Form.Control>
      </Form.Group>

      <Form.Group className="my-2" controlId="email">
        <Form.Label>Enter email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          ></Form.Control>
      </Form.Group>
     
      <Form.Group className="my-2" controlId="mobile">
        <Form.Label>Enter mobile number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          ></Form.Control>
      </Form.Group>
      
      <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          ></Form.Control>
        </Form.Group>
      
        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          ></Form.Control>
        </Form.Group>
      
        <Button type="submit" variant="primary">
          Next
        </Button>
    
    </Form>
  </FormContainer>
  );
};

export default StepOne;
