import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import IconLoader from "../../components/Spinner";
import { Form, Button } from 'react-bootstrap';
import { useDoctorRegisterMutation } from "../../slices/doctorSlices/doctorApiSlice";


interface FormData {
  name: string;
  email: string;
  specialization: string;
  medicalLicenseNumber: string;
  experience: string;
  phone: string;
  gender: string;
  password: string;
  confirmPassword: string;
  profilePicture: File | null;
  medicalDegree: File | null;
  idProof: File | null;
}

const RegisterScreen: React.FC = () => {
 
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    specialization: "",
    medicalLicenseNumber: "",
    experience: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
    medicalDegree: null,
    idProof: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register,{isLoading}] = useDoctorRegisterMutation();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFormData = (newData: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
    const target = e.target as HTMLInputElement;
    const selectedFile = target.files ? target.files[0] : null;
  
    if (selectedFile) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Please upload a valid image file (jpeg, jpg, png).");
        return;
      }
  
      handleFormData({ [field]: selectedFile } as Partial<FormData>);
    }
  };


  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    if (!nameRegex.test(formData.name)) {
      toast.error("Please enter a valid name");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.idProof) {
      toast.error("ID Proof is required");
      return;
    }

    if (!formData.medicalDegree) {
      toast.error("Medical degree certificate is required");
      return;
    }

    if (!formData.profilePicture) {
      toast.error("Please upload a profile picture");
      return;
    }

    if (!formData.phone) {
      toast.error("phone number is required");
      return;
    }

    if (!formData.specialization) {
      toast.error("Specialization is required");
      return;
    }

    if (!formData.medicalLicenseNumber) {
      toast.error("Medical license number is required");
      return;
    }

    if (!formData.experience) {
      toast.error("Experience is required")
    }
   

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("password", formData.password);
    data.append("gender", formData.gender);
    data.append("specialization", formData.specialization);
    data.append("medicalLicenseNumber", formData.medicalLicenseNumber);
    data.append("experience", formData.experience);
    data.append("idProof", formData.idProof); 
    data.append("medicalDegree", formData.medicalDegree); 
    data.append("profilePicture", formData.profilePicture); 

    try {
     
      await register(data).unwrap();
      toast.success("OTP has sent to your email!");
      navigate("/doctor/otp", { state: { email:formData.email } });

      // Reseting form
      setFormData({
        name: "",
        email: "",
        specialization: "",
        medicalLicenseNumber: "",
        experience: "",
        phone: "",
        gender: "",
        password: "",
        confirmPassword: "",
        profilePicture: null,
        medicalDegree: null,
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
    <h2 className="text-dark text-center">Register As Doctor</h2>
    <Form onSubmit={submitForm}>

      <Form.Group className="my-2" controlId="name">
        <Form.Label>Enter Name</Form.Label>
          <Form.Control
            className="border-primary"
            type="text"
            placeholder="Enter Name"
            value={formData.name}
            onChange={(e) => handleFormData({ name: e.target.value })}        
          ></Form.Control>
      </Form.Group>

      <Form.Group className="my-2" controlId="email">
        <Form.Label>Enter Email</Form.Label>
        <Form.Control
          className="border-primary"
          type="text"
          placeholder="Enter Email"
          value={formData.email}
          onChange={(e) => handleFormData({ email: e.target.value })}
        />
      </Form.Group>
     
      <Form.Group className="my-2" controlId="phone">
        <Form.Label>Enter Mobile Number</Form.Label>
        <Form.Control
          className="border-primary"
          type="text"
          placeholder="Enter Mobile"
          value={formData.phone}
          onChange={(e) => handleFormData({ phone: e.target.value })}
        />
      </Form.Group>
      
      <Form.Group className="my-2" controlId="gender">
        <Form.Label>Select Gender</Form.Label>
        <div>
          <Form.Check
            type="radio"
            id="male"
            label="Male"
            name="gender"
            value="male"
            checked={formData.gender === 'male'}
            onChange={(e) => handleFormData({ gender: e.target.value })}
          />
          <Form.Check
            type="radio"
            id="female"
            label="Female"
            name="gender"
            value="female"
            checked={formData.gender === 'female'}
            onChange={(e) => handleFormData({ gender: e.target.value })}
          />
        </div>
      </Form.Group>


      <Form.Group className="my-2" controlId="specialization">
        <Form.Label>Specialization</Form.Label>
        <Form.Control
          className="border-primary"
          type="text"
          placeholder="Enter Specialization"
          value={formData.specialization}
          onChange={(e) => handleFormData({ specialization: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="my-2" controlId="medicalLicenseNumber">
        <Form.Label>Medical License Number</Form.Label>
        <Form.Control
          className="border-primary"
          type="text"
          placeholder="Enter Medical License Number"
          value={formData.medicalLicenseNumber}
          onChange={(e) => handleFormData({ medicalLicenseNumber: e.target.value })}
        />
      </Form.Group>
      
      <Form.Group className="my-2" controlId="experience">
        <Form.Label>Experience</Form.Label>
        <Form.Control
          className="border-primary"
          type="text"
          placeholder="Enter Experience"
          value={formData.experience}
          onChange={(e) => handleFormData({ experience: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="my-2" controlId="profilePicture">
        <Form.Label>Profile Picture</Form.Label>
        <Form.Control
          className="border-primary"
          type="file"
          name="profilePicture"
          onChange={(e) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>, 'profilePicture')}
        />
      </Form.Group>

      <Form.Group className="my-2" controlId="medicalDegree">
        <Form.Label>Medical Degree</Form.Label>
        <Form.Control
          className="border-primary"
          type="file"
          name="medicalDegree"
          onChange={(e) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>, 'medicalDegree')}
        />
      </Form.Group>

      <Form.Group className="my-2" controlId="idProof">
        <Form.Label>ID Proof</Form.Label>
        <Form.Control
          className="border-primary"
          type="file"
          name="idProof" 
          onChange={(e) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>, 'idProof')} 
        />
      </Form.Group>

      <Form.Group className="my-2" controlId="password">
        <Form.Label>Password</Form.Label>
        <div className="input-group">
        <Form.Control
          className="border-primary"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter Password"
          value={formData.password}
          onChange={(e) => handleFormData({ password: e.target.value })}
        />
        <Button
            className="border-primary"
            variant="outline-secondary"
            onClick={togglePasswordVisibility}
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
        </Button>
        </div>
      </Form.Group>
      
      <Form.Group className="my-2" controlId="confirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <div className="input-group">
        <Form.Control
          className="border-primary"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => handleFormData({ confirmPassword: e.target.value })}
        />
        <Button
            className="border-primary"
            variant="outline-secondary"
            onClick={toggleConfirmPasswordVisibility}
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </Button>
        </div>
      </Form.Group>

      <div className="d-flex justify-content-center mt-3">
        <Button  type="submit" variant="primary">
          Submit
        </Button>
      </div>
      {isLoading && <IconLoader />}
    </Form>
  </FormContainer>
  );
};

export default RegisterScreen;
