import React, { useEffect, useState } from "react";
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
import userAdmin from "../../assets/user-admin.png";
import "./index.css";
import Logo from "../../assets/logo.png";

const NavScrollExample = ({ onSearchResults, onLogout }) => {
  const idAdmin = localStorage.getItem("idAdmin");
  const [admin, setAdmin] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable or fallback to localhost
  const url = `${apiUrl}/api/v1/admin/${idAdmin}`;

  useEffect(() => {
    getAdmin();
  }, []);

  const getAdmin = async () => {
    const respuesta = await axios.get(url);
    setAdmin(respuesta.data);
  };

  const [searchParams, setSearchParams] = useState({
    nombre: "",
    apellido: "",
    correo: "",
  });

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
        `${apiUrl}/buscarEntrenadores/${idAdmin}/`,
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
      {/*Navbar*/}
      <Navbar expand="lg" className="navbar-dark bg-dark">
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
          <Navbar.Brand href="navbar-title">CAMPOS FITNESS</Navbar.Brand>

          {/* Toggle for mobile view */}
          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll">
            {/* Main navigation with ms-auto to push it to the right */}
            <Nav className="ms-auto">
              <NavDropdown
                title={
                  <span className="profile-section">
                    <span className="admin-name me-2">
                      {admin.nombre + " " + admin.apellido + "  " || "Admin"}
                    </span>
                    <Image
                      src={userAdmin}
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

      {/*Searchbar*/}
      <Container className="mt-4">
        <Row
          className="justify-content-center align-items-center"
          style={{ marginTop: "45px" }}
        >
          <Col
            xs={12}
            md={{ span: 12, offset: 2 }}
            className="text-center d-md-none"
          >
            <h3 className="mb-4">Lista de Entrenadores</h3>
          </Col>

          <Col xs={12} md={10}>
            <Form onSubmit={handleSearch} className="d-flex search-bar">
              <Form.Control
                type="search"
                name="nombre"
                placeholder="Nombre"
                className="me-2 rounded-input"
                aria-label="Buscar nombre"
                value={searchParams.nombre}
                onChange={handleInputChange}
              />
              <Form.Control
                type="search"
                name="apellido"
                placeholder="Apellido"
                className="me-2 rounded-input"
                aria-label="Buscar apellido"
                value={searchParams.apellido}
                onChange={handleInputChange}
              />
              <Form.Control
                type="search"
                name="cedula"
                placeholder="Cédula"
                className="me-2 rounded-input"
                aria-label="Buscar cedula"
                value={searchParams.cedula}
                onChange={handleInputChange}
              />
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
