import React from "react";
import { useNavigate } from "react-router-dom";
import { Col } from "react-bootstrap";
import Rutinas from "../../assets/Rutinas.jpg";
import ControlCalorico from "../../assets/ControlCalorico.jpg"; // Replace with your image path
import "./styles.css";

const HomeClient = () => {
  const navigate = useNavigate();

  const handleImageClick = (route) => {
    navigate(route);
  };

  return (
    <>
      <Col xs={12} md={6} className="mb-2 mb-md-0">
        <img
          src={Rutinas}
          alt="Rutinas"
          width="500px"
          style={{ cursor: "pointer" }}
          onClick={() => handleImageClick()}
        />
      </Col>
      <Col xs={12} md={6}>
        <img
          src={ControlCalorico}
          alt="ControlCalorico"
          width="480px"
          style={{ cursor: "pointer" }}
          onClick={() => handleImageClick("/dashboardControlCalorico/")}
        />
      </Col>
    </>
  );
};

export default HomeClient;
