import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  Form,
  Button,
  NavDropdown,
  Image,
  Row,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./index.css";
import Logo from "../../assets/logo.png";

const NavScrollExample = ({ onSearchResults, onLogout }) => {
  const idEntrenador = localStorage.getItem("idEntrenador");
  const [trainer, setTrainer] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable or fallback to localhost
  const url = `${apiUrl}/api/v1/trainer/${idEntrenador}`;
  const [searchParams, setSearchParams] = useState({
    nombre: "",
    enfoque: "",
    tipo: "",
  });

  useEffect(() => {
    getTrainer();
  }, []);

  const getTrainer = async () => {
    const respuesta = await axios.get(url);
    setTrainer(respuesta.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `${apiUrl}/buscarRutinas/${idEntrenador}/`,
        {
          params: searchParams,
        }
      );
      onSearchResults(response.data);
    } catch (error) {
      console.error("Error al realizar la busqueda", error);
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="navbar-dark bg-dark" /*style={{ background: "#000C17" }}*/
        fixed="top"
      >
        <Container fluid>
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <img
              src={Logo}
              width="50"
              height="50"
              className="d-inline-block align-top me-2"
              alt="Campos Fitness Logo"
            />
          </Navbar.Brand>
          <Navbar.Brand href="#">CAMPOS FITNESS</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            {/* Toggle for mobile view */}
            <Nav className="me-auto my-2 my-lg-0" navbarScroll />
            <Nav className="ms-auto">
              <NavDropdown
                title={
                  <span className="profile-section">
                    <span className="admin-name me-2">
                      {trainer.nombre + " " + trainer.apellido}
                    </span>
                    <Image
                      src={trainer.imagen}
                      roundedCircle
                      width="45"
                      height="45"
                      className="profile-avatar me-2"
                      alt="Profile"
                    />
                  </span>
                }
                id="navbarScrollingDropdown"
                align="end"
                className="profile-menu"
              >
                <NavDropdown.Item href="#action3">Cuenta</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLogout}>
                  <i className="fas fa-sign-out-alt fa-fw"></i> Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Row
          className="justify-content-center align-items-center"
          style={{ marginTop: "120px" }}
        >
          {/* Page Title */}
          <Col xs={12} md={{ span: 12, offset: 2 }} className="text-center">
            <h3 className="mb-4">Lista de rutinas</h3>
          </Col>
          {/* Search Bar */}
          <Col xs={12} md={{ span: 8, offset: 3 }} lg={{ span: 5, offset: 2 }}>
            <Form onSubmit={handleSearch} className="d-flex search-bar">
              <Form.Control
                type="search"
                name="nombre"
                placeholder="Nombre"
                className="me-2 rounded-input"
                aria-label="Buscar por nombre"
                value={searchParams.nombre}
                onChange={handleInputChange}
              />
              <Form.Control
                type="search"
                name="enfoque"
                placeholder="Enfoque"
                className="me-2 rounded-input"
                aria-label="Buscar por enfoque"
                value={searchParams.enfoque}
                onChange={handleInputChange}
              />
              {/*<Form.Control
                type="search"
                name="tipo"
                placeholder="Tipo"
                className="me-2 rounded-input"
                aria-label="Buscar por tipo"
                value={searchParams.tipo}
                onChange={handleInputChange}
              /> */}
              <Button variant="primary" type="submit" className="search-button">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NavScrollExample;
