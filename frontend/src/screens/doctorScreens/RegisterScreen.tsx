import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/userComponents/Loader";
import { Form, Button } from 'react-bootstrap';
import { useDoctorRegisterMutation } from "../../slices/doctorSlices/doctorApiSlice";


interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  specialization: string;
  medicalLicenseNumber: string;
  experience: string;
  idProof: File | null;
}

const RegisterScreen: React.FC = () => {
 
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    medicalLicenseNumber: "",
    experience: "",
    idProof: null,
  });

  const [register,{isLoading}] = useDoctorRegisterMutation();
  const navigate = useNavigate();

  const handleFormData = (newData: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const selectedFile = target.files ? target.files[0] : null;
  
    if (selectedFile) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Please upload a valid image file (jpeg, jpg, png).");
        return;
      }
  
      handleFormData({ idProof: selectedFile });
    }
  };


  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    if (!formData.idProof) {
      toast.error("ID Proof is required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("password", formData.password);
    data.append("specialization", formData.specialization);
    data.append("medicalLicenseNumber", formData.medicalLicenseNumber);
    data.append("experience", formData.experience);
    data.append("idProof", formData.idProof); 

    try {
     
      await register(data).unwrap();
      toast.success("OTP has sent to your email!");
      navigate("/doctor/otp", { state: { email:formData.email } });

      // Reseting form
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        specialization: "",
        medicalLicenseNumber: "",
        experience: "",
        idProof: null,
      });

    } catch (err:any) {
      console.error("Error during doctor registration: ",err);
      toast.error(err?.data?.message || "Registration failed!");
    }
  }
  
  useEffect(() => {
    console.log('Updated idProof:', formData?.idProof?.name);
  }, [formData]);
  return (
    <FormContainer>
    <h1>Register As Doctor</h1>
    <Form onSubmit={submitForm}>

      <Form.Group className="my-2" controlId="name">
        <Form.Label>Enter Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            value={formData.name}
            onChange={(e) => handleFormData({ name: e.target.value })}
            required
          ></Form.Control>
      </Form.Group>

      <Form.Group className="my-2" controlId="email">
        <Form.Label>Enter Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={(e) => handleFormData({ email: e.target.value })}
          required
        />
      </Form.Group>
     
      <Form.Group className="my-2" controlId="phone">
        <Form.Label>Enter Mobile Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Mobile"
          value={formData.phone}
          onChange={(e) => handleFormData({ phone: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group className="my-2" controlId="specialization">
        <Form.Label>Specialization</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Specialization"
          value={formData.specialization}
          onChange={(e) => handleFormData({ specialization: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group className="my-2" controlId="medicalLicenseNumber">
        <Form.Label>Medical License Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Medical License Number"
          value={formData.medicalLicenseNumber}
          onChange={(e) => handleFormData({ medicalLicenseNumber: e.target.value })}
          required
        />
      </Form.Group>
      
      <Form.Group className="my-2" controlId="experience">
        <Form.Label>Experience</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Experience"
          value={formData.experience}
          onChange={(e) => handleFormData({ experience: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group className="my-2" controlId="idProof">
        <Form.Label>ID Proof</Form.Label>
        <Form.Control
          type="file"
          name="idProof" 
          onChange={handleFileChange}
          required  
        />
      </Form.Group>

      <Form.Group className="my-2" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={(e) => handleFormData({ password: e.target.value })}
          required
        />
      </Form.Group>
      
      <Form.Group className="my-2" controlId="confirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => handleFormData({ confirmPassword: e.target.value })}
          required
        />
      </Form.Group>
        {isLoading && <Loader />}
        <Button type="submit" variant="primary">
          Register
        </Button>
    
    </Form>
  </FormContainer>
  );
};

export default RegisterScreen;
