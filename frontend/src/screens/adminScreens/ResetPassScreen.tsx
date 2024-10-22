import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormContainer from "../../components/FormContainer";
import { Form, Button } from "react-bootstrap";
import { useAdminResetPasswordMutation } from "../../slices/adminSlices/adminApiSlice";

const ResetPassScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [resetPassword,{isLoading}] = useAdminResetPasswordMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token");
    }
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token is required to reset the password.");
      return;
    }
    if ( newPassword !== confirmPassword){
      toast.error("Passwords does not match")
      return;
    }
    
    try {
      await resetPassword({ token, newPassword }).unwrap();
      toast.success("Password reset successful!");
      navigate('/admin/login')
    } catch (err: any) {
      toast.error(err?.data?.message || err.message || 'An error occurred'); 
    }
  };

  return (
    <FormContainer>
      <h1>Reset Password</h1>
      <Form onSubmit={handleResetPassword}>
        <Form.Group controlId="forPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="forConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          {" "}
          Reset Password
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ResetPassScreen;
