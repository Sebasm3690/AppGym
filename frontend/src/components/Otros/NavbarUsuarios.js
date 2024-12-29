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

const NavScrollExample = ({
  onSearchResults,
  onLogout,
  showWeekDays,
  showTableRoutines,
}) => {
  const idEntrenador = localStorage.getItem("idEntrenador");
  const [trainer, setTrainer] = useState({});
  const url = `http://127.0.0.1:8000/api/v1/trainer/${idEntrenador}`;
  const [searchParams, setSearchParams] = useState({
    nombre: "",
    apellido: "",
    correo: "",
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
        `http://127.0.0.1:8000/buscarClientes/${idEntrenador}/`,
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
              src={
                "https://png.pngtree.com/png-clipart/20220620/original/pngtree-orange-gym-logo-design-templete-png-png-image_8128901.png"
              }
              width="35"
              height="35"
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

      {/*Searchbar*/}
      {!showWeekDays && !showTableRoutines && (
        <Container className="mt-4">
          <Row
            className="justify-content-center align-items-center"
            style={{ marginTop: "120px" }}
          >
            {/* Page Title */}
            <Col xs={12} md={{ span: 12, offset: 2 }} className="text-center">
              <h3 className="mb-4">Lista de Clientes</h3>
            </Col>
            {/* Search Bar */}
            <Col
              xs={12}
              md={{ span: 8, offset: 3 }}
              lg={{ span: 5, offset: 2 }}
            >
              <Form
                onSubmit={handleSearch}
                className="d-flex justify-content-center search-bar"
              >
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
                  name="correo"
                  placeholder="Correo"
                  className="me-2 rounded-input"
                  aria-label="Buscar correo"
                  value={searchParams.correo}
                  onChange={handleInputChange}
                />
                <Button
                  variant="primary"
                  type="submit"
                  className="search-button"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default NavScrollExample;
