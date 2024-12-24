import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './userScreens/style.css';

const Footer: React.FC = () => {
  return (
   <footer className="footer bg-dark text-white py-4">
  <Container>
    <Row>
      <Col md={4}>
        <h5>About CureHub</h5>
        <p>
          CureHub is your trusted platform for connecting with expert healthcare providers.
        </p>
      </Col>
      <Col md={4}>
        <h5>Quick Links</h5>
        <ul className="list-unstyled">
          <li><a href="/about" className="text-white">About Us</a></li>
          <li><a href="/contact" className="text-white">Contact</a></li>
          <li><a href="/privacy" className="text-white">Privacy Policy</a></li>
        </ul>
      </Col>
      <Col md={4}>
      <h5 className="fw-bold">Contact Us</h5>
            <p>
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
            <p className="text-white">&copy; {new Date().getFullYear()} CureHub. All rights reserved.</p>
          </Col>
        </Row>
  </Container>
</footer>

  );
};

export default Footer;
