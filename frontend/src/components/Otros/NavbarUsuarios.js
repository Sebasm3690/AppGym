import React, { useState } from "react";
import {
  Navbar,
  Container,
  Nav,
  Form,
  Button,
  NavDropdown,
  Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
//import "../Admin/NavBar.css";

//2.-Recibe el prop aqui
const NavScrollExample = ({ onSearchResults, onLogout }) => {
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
        "http://127.0.0.1:8000/api/v1/entrenador/",
        {
          params: searchParams,
        }
      );
      onSearchResults(response.data); //3.-Actualiza la función con los entrenadores actualizados
    } catch (error) {
      console.error("Error al realizar la busqueda", error);
    }
  };

  return (
    <Navbar expand="lg" className="navbar-dark bg-dark">
      <Container fluid>
        <Navbar.Brand href="#">CAMPOS FITNESS</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 navbar-center w-100"
            navbarScroll
          >
            <Form
              className="d-flex justify-content-center w-100"
              onSubmit={handleSearch}
            >
              <Form.Control
                type="search"
                name="nombre"
                placeholder="Buscar por nombre"
                className="me-2"
                aria-label="Buscar por nombre"
                value={searchParams.nombre}
                onChange={handleInputChange}
              />
              <Form.Control
                type="search"
                name="apellido"
                placeholder="Buscar por apellido"
                className="me-2"
                aria-label="Buscar por apellido"
                value={searchParams.apellido}
                onChange={handleInputChange}
              />
              <Form.Control
                type="search"
                name="correo"
                placeholder="Buscar por correo"
                className="me-2"
                aria-label="Buscar por correo"
                value={searchParams.correo}
                onChange={handleInputChange}
              />
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </Form>
          </Nav>
          <Nav>
            <NavDropdown
              title={
                <Image
                  src="https://source.unsplash.com/250x250?girl"
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
  );
};

export default NavScrollExample;
