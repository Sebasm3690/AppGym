import React, { useState } from "react";
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
import "../Otros/navBar.css";

const NavScrollExample = ({ onSearchResults, onLogout }) => {
  const idEntrenador = localStorage.getItem("idEntrenador");
  const [searchParams, setSearchParams] = useState({
    nombre: "",
    enfoque: "",
    tipo: "",
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
        `http://127.0.0.1:8000/buscarRutinas/${idEntrenador}/`,
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
      <Navbar expand="lg" className="navbar-dark bg-dark">
        <Container fluid>
          <Navbar.Brand href="#">
            <img
              src={
                "https://png.pngtree.com/png-clipart/20220620/original/pngtree-orange-gym-logo-design-templete-png-png-image_8128901.png"
              }
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Campos Fitness Logo"
            />
          </Navbar.Brand>
          <Navbar.Brand href="#">CAMPOS FITNESS</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll />
            <Nav>
              <NavDropdown
                title={
                  <Image
                    src="https://previews.123rf.com/images/metelsky/metelsky1809/metelsky180900233/109815470-man-avatar-profile-male-face-icon-vector-illustration.jpg"
                    roundedCircle
                    width="45"
                    height="45"
                    className="d-inline-block align-top"
                    alt="Profile"
                  />
                }
                id="navbarScrollingDropdown"
                align="end"
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
        <Row className="justify-content-center" style={{ marginTop: "120px" }}>
          <Col xs={12} md={10} className="search-container">
            <Form onSubmit={handleSearch} className="search-form">
              <Form.Control
                type="search"
                name="nombre"
                placeholder="Buscar por nombre"
                className="search-input"
                aria-label="Buscar por nombre"
                value={searchParams.nombre}
                onChange={handleInputChange}
              />
              <Form.Control
                type="search"
                name="enfoque"
                placeholder="Buscar por enfoque"
                className="search-input"
                aria-label="Buscar por enfoque"
                value={searchParams.enfoque}
                onChange={handleInputChange}
              />
              <Form.Control
                type="search"
                name="tipo"
                placeholder="Buscar por tipo"
                className="search-input"
                aria-label="Buscar por tipo"
                value={searchParams.tipo}
                onChange={handleInputChange}
              />
              <Button variant="primary" type="submit">
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
