// components/Otros/Footer.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "./footer.css"; // Archivo CSS para estilos personalizados

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white mt-5">
      <Container>
        <Row className="py-4">
          <Col md={4} className="text-center text-md-left">
            <h5 className="mb-3">CAMPOS FITNESS</h5>
            <p>
              Tu salud y bienestar es nuestra prioridad. Únete a nosotros para
              alcanzar tus objetivos de fitness.
            </p>
          </Col>
          <Col md={4} className="text-center">
            <h5 className="mb-3">Síguenos</h5>
            <div className="social-icons">
              <a href="#" className="text-white me-3">
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a href="#" className="text-white me-3">
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
              <a href="#" className="text-white">
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
            </div>
          </Col>
          <Col md={4} className="text-center text-md-right">
            <h5 className="mb-3">Contacto</h5>
            <p>Email: info@camposfitness.com</p>
            <p>Teléfono: +123 456 7890</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              © 2024 CAMPOS FITNESS. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
