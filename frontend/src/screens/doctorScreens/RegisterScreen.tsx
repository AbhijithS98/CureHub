import React, { useState } from "react";
import StepOne from "./StepOneRegister"
import StepTwo from "./StepTwoRegister";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  specialization: string;
  medicalLicenseNumber: string;
  experience: string;
  idProof: File | null;
}

const RegisterScreen: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    medicalLicenseNumber: "",
    experience: "",
    idProof: null,
  });

  const handleFormData = (newData: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const submitForm = async () => {
    try {
      // You can add form validation and submission logic here
      console.log("Form Data Submitted: ", formData);

      if (!formData.idProof) {
        toast.error("ID Proof is required");
        return;
      }

      // After successful validation
      toast.success("Doctor registered successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        specialization: "",
        medicalLicenseNumber: "",
        experience: "",
        idProof: null,
      });

      // Optionally, redirect or reset to first step
      setStep(1);
    } catch (error) {
      toast.error("An error occurred during registration");
      console.error("Error during form submission: ", error);
    }
  };

  return (
    <>
      {step === 1 && (
        <StepOne nextStep={nextStep} handleFormData={handleFormData} />
      )}
      {step === 2 && (
        <StepTwo
          handleFormData={handleFormData}
          submitForm={submitForm}
        />
      )}
    </>
  );
};

export default RegisterScreen;
