import React from 'react';
import { Container, Row, Col, Button, Image, Card } from 'react-bootstrap';

const ConfirmationScreen: React.FC = () => {
    return (
        <Container fluid className="d-flex min-vh-100 align-items-center justify-content-center bg-light">
            <Row>
                <Col md={8} lg={6} className="mx-auto">
                    <Card className="shadow-lg text-center">
                        <Card.Body className="p-5">
                            <Image
                                src="/assets/thank-you.svg" // Add a custom SVG or image path here
                                alt="Thank You"
                                className="mb-4"
                                style={{ width: '100px', height: '100px' }}
                            />
                            <Card.Title className="mb-4" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
                                Thank you for registering!
                            </Card.Title>
                            <Card.Text className="mb-4 text-muted">
                                Your details have been submitted for admin approval. You will be notified by email once the admin approves your request.
                            </Card.Text>
                            <Button
                                variant="primary"
                                size="lg"
                                className="px-5"
                                onClick={() => window.location.href = '/'}
                            >
                                Go to Home
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ConfirmationScreen;

