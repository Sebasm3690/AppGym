import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { show_alerta } from "../../functions";
import { useNavigate } from "react-router-dom";
import NavScrollExample from "../Otros/Navbar";

const ResetPassword = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable or fallback to localhost
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = "Admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      show_alerta("Las contraseñas no coinciden", "warning");
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/${uid}/${token}/`, {
        password,
      });
      show_alerta(response.data.mensaje, "success");
      navigate("/");
      setError("");
    } catch (err) {
      show_alerta(
        err.response?.data?.error || "Algo ocurrió inesperadamente",
        "error"
      );
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
                          Restablece tu Contraseña
                        </h3>
                        <p className="text-muted mb-4 text-center">
                          Introduce una nueva contraseña para tu cuenta.
                        </p>
                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form.Group className="mb-3">
                          <Form.Control
                            id="password"
                            type="password"
                            placeholder="Nueva contraseña"
                            //value={password}
                            className="rounded-5 border-0 shadow px-4 text-primary"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Control
                            id="password"
                            type="password"
                            placeholder="Confirmar contraseña"
                            //value={password}
                            className="rounded-5 border-0 shadow px-4 text-primary"
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                          />
                        </Form.Group>
                        <div className="w-100 d-flex justify-content-center">
                          <Button
                            type="submit"
                            className="btn-primary btn-block text-uppercase mb-2 rounded-5 shadow-sm"
                            style={{ width: "85%" }} // Ajustar ancho del botón para mejor estética
                          >
                            Cambiar contraseña
                          </Button>
                        </div>
                        <a
                          href="/loginAdmin"
                          className="text-primary mt-3 d-block d-flex justify-content-center"
                        >
                          ¿Iniciar sesión como administrador?
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

export default ResetPassword;
