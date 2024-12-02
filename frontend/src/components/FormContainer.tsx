import React,{ReactNode} from "react";
import { Container, Row, Col } from "react-bootstrap";

interface FormContainerProps {
  children: ReactNode
}
const FormContainer = ({ children }:FormContainerProps) => {
  return (
    <Container style={{marginTop: 90}}>
      <Row className="justify-content-md-center  mt-5">
        <Col xs={12} md={6} className="card p-5 border-secondary">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
