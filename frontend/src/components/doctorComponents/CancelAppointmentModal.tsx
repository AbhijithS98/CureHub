import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"; // Assuming you're using react-bootstrap for modal
import { toast } from "react-toastify"; // For showing notifications

interface ICancelAppointmentProps {
  appointmentId: string;
  onCancelConfirm: (appointmentId: string, reason: string) => void;
  showModal: boolean;
  onHide: () => void;
}

const CancelAppointmentModal: React.FC<ICancelAppointmentProps> = ({ appointmentId, onCancelConfirm, showModal, onHide }) => {
  const [cancellationReason, setCancellationReason] = useState<string>('');

  const handleSubmit = () => {
    if (!cancellationReason) {
      toast.error("Please select a reason for cancellation.");
      return;
    }
    onCancelConfirm(appointmentId, cancellationReason);
    onHide(); // Close modal
  };

  return (
    <Modal show={showModal} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cancel Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="cancellationReason">
            <Form.Label>Reason for Cancellation</Form.Label>
            <Form.Control
              as="select"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            >
              <option value="">Select a reason...</option>
              <option value="Medical Emergency">Medical Emergency</option>
              <option value="Personal Reasons">Personal Reasons</option>
              <option value="Operational Issues">Operational Issues</option>
              
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="danger" onClick={handleSubmit}>
          Confirm Cancellation
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelAppointmentModal;
