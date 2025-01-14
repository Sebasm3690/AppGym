import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { show_alerta } from "../../functions";
import { useLocation } from "react-router-dom";
import NavScrollExample from "../Otros/Navbar";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Extract the query parameter
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userType = params.get("userType");
  // Conditional logic based on the userType

  const userTypeText =
    userType === "admin"
      ? "Administrador"
      : userType === "trainer"
      ? "Entrenador"
      : "Cliente";

  const userTypeLogin =
    userType === "admin"
      ? "Admin"
      : userType === "trainer"
      ? "Entrenador"
      : "Cliente";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/reset-password-request/",
        {
          email,
          userType: userTypeText,
        }
      );
      setMessage(response.data.mensaje);
      setError("");
    } catch (error) {
      setError(error.response?.data?.error || "Algo ocurrió inesperadamente");
      setMessage("");
    }
  };

  return (
    <div>
      <NavScrollExample />
      <div className="maincontainer">
        <Container fluid className="h-100">
          <Row className="no-gutters h-100 align-items-center">
            <Col
              md={6}
              className="d-flex bg-image align-items-center justify-content-center"
            ></Col>
            <Col
              md={6}
              className="bg-light d-flex align-items-center justify-content-center"
            >
              <div className="login px-4 py-5 d-flex flex-column justify-content-center">
                <Container>
                  <Row>
                    <Col lg={9} md={11} sm={10} className="mx-auto">
                      <Form onSubmit={handleSubmit}>
                        <h3 className="display-5 mb-4 text-center">
                          ¿Olvidaste tu Contraseña?
                        </h3>
                        <p className="text-muted mb-4 text-center">
                          Introduzca sus datos o credenciales
                        </p>
                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group controlId="email" className="mb-3">
                          <Form.Control
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            className="rounded-5 border-0 shadow px-4"
                          />
                        </Form.Group>
                        <div className="w-100 d-flex justify-content-center">
                          <Button
                            type="submit"
                            className="btn-primary btn-block text-uppercase mb-2 rounded-5 shadow-sm"
                            style={{ width: "85%" }} // Ajustar ancho del botón para mejor estética
                          >
                            Recuperar Contraseña
                          </Button>
                        </div>
                        <a
                          href={`/login${userTypeLogin}`}
                          className="text-primary mt-3 d-block d-flex justify-content-center"
                        >
                          ¿Iniciar sesión como {userTypeText.toLowerCase()}?
                        </a>
                      </Form>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ForgotPassword;
