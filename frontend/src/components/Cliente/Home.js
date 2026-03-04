import React from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container } from "react-bootstrap";
import Rutinas from "../../assets/Rutinas.jpg";
import ControlCalorico from "../../assets/ControlCalorico.jpg"; // Replace with your image path
import { Row } from "react-bootstrap";
import styles from "./home.module.css";
import NavScrollExample from "../Otros/NavBarCliente";
const HomeClient = () => {
  const navigate = useNavigate();

  const handleImageClick = (route) => {
    navigate(route);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idCliente");
    navigate("/loginCliente");
  };

  return (
    <Container className="d-flex flex-column vh-100">
      {/* NavBar */}
      <NavScrollExample onLogout={handleCerrarSesion} />

      {/* Main Content */}
      {/*It allows to occupies all avalable space below the Navbar flex-grow-1 -> allows to center the content*/}
      <Container className="d-flex flex-column justify-content-center flex-grow-1">
        {/* Title Section */}
        <Row className="text-center">
          <Col className={styles.containerTitle}>
            <h1 className={styles.mainTitle}>¡Bienvenido!</h1>
            <p className={styles.subtitle}>
              Seleccione una opción para continuar
            </p>
          </Col>
        </Row>

        {/* Content Cards */}
        <Row className={styles.mainContent}>
          <Col xs={12} md={6} className="mt-2">
            <div
              className={styles.cardContainer}
              onClick={() => handleImageClick("/dashboardSeguimientoRutina/")}
            >
              <img
                src={Rutinas}
                alt="Rutinas"
                width="500px"
                style={{ cursor: "pointer" }}
                className={styles.cardImage}
              />
              <h4 className={styles.cardTitle}>Rutinas</h4>
              <p className={styles.cardDescription}>
                Explora tus rutinas para mantenerte activo y en forma
              </p>
            </div>
          </Col>
          <Col xs={12} md={6} className="mt-3">
            <div
              className={styles.cardContainer}
              onClick={() => handleImageClick("/dashboardControlCalorico/")}
            >
              {" "}
              <img
                src={ControlCalorico}
                alt="ControlCalorico"
                width="500px"
                style={{ cursor: "pointer" }}
                className={styles.cardImage}
              />
              <h4 className={styles.cardTitle}>Control Calórico</h4>
              <p className={styles.cardDescription}>
                Explora tus rutinas para mantenerte activo y en forma
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default HomeClient;
