import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Navbar,
  Nav,
} from "react-bootstrap";
import styles from "./home.module.css"; // Import CSS Module
import adminImage from "../../assets/admin-image.jpg";
import trainerImage from "../../assets/trainer-image.png";
import clientImage from "../../assets/client-image.jpg";
import aboutUs from "../../assets/about-us-image.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavScrollExample from "../Otros/Navbar";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = (url) => {
    navigate(url);
  };

  useEffect(() => {
    // Apply styles to the body only when Home is mounted
    document.body.style.margin = "0";
    document.body.style.padding = "0px 0px";
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.overflowX = "hidden";
    document.body.style.backgroundColor = "black"; // Specific to Home
    document.body.style.color = "white"; // Specific to Home

    // Clean up styles when Home is unmounted
    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.fontFamily = "";
      document.body.style.overflowX = "";
      document.body.style.backgroundColor = ""; // Reset to default
      document.body.style.color = ""; // Reset to default
    };
  }, []);

  return (
    <div className={styles.home}>
      {" "}
      {/* Use scoped class here */}
      {/*Navbar*/}
      <NavScrollExample />
      {/* Hero Section */}
      <div className={`${styles.heroSection} text-center text-white`}>
        <h1>Work hard or go home</h1>
        <p>
          Tu salud y bienestar es nuestra prioridad. Únete a nosotros para
          alcanzar tus objetivos de fitness
        </p>
      </div>
      {/* Login Option */}
      <Container className={`${styles.loginOptions} text-center my-4`}>
        <h2>Iniciar sesión como:</h2>
        <Row className="justify-content-center">
          <Col xs={12} md={4} lg={3} className="text-center">
            <Image src={adminImage} className={styles.loginImage} />
            <h5>ADMINISTRADOR</h5>
            <Button
              variant="warning"
              className="mt-3"
              onClick={() => handleLogin("/loginAdmin")}
            >
              ÚNETE HOY
            </Button>
          </Col>
          <Col xs={12} md={4} lg={3} className="text-center">
            <Image src={trainerImage} className={styles.loginImage} />
            <h5>ENTRENADOR</h5>
            <Button
              variant="warning"
              className="mt-3"
              onClick={() => handleLogin("/loginEntrenador")}
            >
              ÚNETE HOY
            </Button>
          </Col>
          <Col xs={12} md={4} lg={3} className="text-center">
            <Image src={clientImage} className={styles.loginImage} />
            <h5>CLIENTE</h5>
            <Button
              variant="warning"
              className="mt-3"
              onClick={() => handleLogin("/loginCliente")}
            >
              ÚNETE HOY
            </Button>
          </Col>
        </Row>
      </Container>
      {/* About Us Section */}
      <Container
        id="sobre-nosotros"
        className={`${styles.aboutUs} my-5 text-white`}
      >
        <Row className="align-items-center">
          <Col xs={12} md={6} className="text-left">
            <h3 className={styles.aboutTitle}>¿Quiénes somos?</h3>
            <h2 className={styles.aboutSubtitle}>SOBRE NOSOTROS</h2>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </p>
          </Col>
          <Col xs={12} md={6} className="text-center">
            <Image src={aboutUs} fluid rounded className={styles.aboutImage} />
          </Col>
        </Row>
      </Container>
      {/* Contact section */}
      <Container className={`${styles.contactSection} text-center my-5`}>
        <Row className="align-items-center">
          <Col xs={12} md={8} className="text-md-left text-center">
            <h3 className={styles.contactSubtitle}>Ponte en contacto</h3>
            <h2 className={styles.contactTitle}>¿NECESITAS MAS INFORMACION?</h2>
          </Col>
          <Col xs={12} md={4} className="text-md-right text-center">
            <Button
              variant="warning"
              className={`mt-3 ${styles.contactButton}`}
            >
              Contáctanos
            </Button>
          </Col>
        </Row>
      </Container>
      {/* Footer */}
      <footer className={styles.footer}>
        <Container>
          <Row>
            <Col xs={12} md={4}>
              <h5>CAMPOS FITNESS</h5>
            </Col>
            <Col xs={12} md={4}>
              <p>
                <Nav.Link as={Link} to="/">
                  INICIO
                </Nav.Link>
                <Nav.Link as={Link} to="/loginCliente">
                  INICIAR SESIÓN
                </Nav.Link>
                <Nav.Link as={Link} to="/about">
                  SOBRE NOSOTROS
                </Nav.Link>
              </p>
            </Col>
            <hr
              style={{ margin: "30px 0", borderTop: "3.5px solid #f0a500" }}
            />
            <Col xs={12} md={12} className="text-center">
              <p>Copyright 2024 | Campos Fitness Website</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
