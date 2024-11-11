import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './userScreens/style.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-section text-white  py-5 mt-5">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold">CureHub</h5>
            <p className="text-muted">
              Empowering patients and healthcare providers to connect effortlessly and efficiently.
              At CureHub, we believe in a healthier future for all.
            </p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-muted text-decoration-none">About Us</a></li>
              <li><a href="/services" className="text-muted text-decoration-none">Our Services</a></li>
              <li><a href="/contact" className="text-muted text-decoration-none">Contact Us</a></li>
              <li><a href="/terms" className="text-muted text-decoration-none">Terms & Conditions</a></li>
              <li><a href="/privacy" className="text-muted text-decoration-none">Privacy Policy</a></li>
            </ul>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold">Contact Us</h5>
            <p className="text-muted">
              <strong>Email:</strong> support@curehub.com<br />
              <strong>Phone:</strong> +1 234 567 8901
            </p>
            <div className="social-icons d-flex">
              <a href="https://facebook.com" className="text-white me-3" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://twitter.com" className="text-white me-3" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" className="text-white me-3" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://linkedin.com" className="text-white" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </Col>
        </Row>
        <hr className="border-secondary" />
        <Row>
          <Col className="text-center">
            <p className="text-muted">&copy; {new Date().getFullYear()} CureHub. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;