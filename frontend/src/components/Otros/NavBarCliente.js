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

const NavScrollExample = ({
  onSearchResults,
  onLogout,
  showWeekDays,
  showTableRoutines,
}) => {
  const idClient = localStorage.getItem("idCliente");
  const [client, setClient] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable or fallback to localhost
  const url = `${apiUrl}/api/v1/client/${idClient}/`;
  const [searchParams, setSearchParams] = useState({
    nombre: "",
    apellido: "",
    correo: "",
  });

  useEffect(() => {
    getClient();
  }, []);

  const getClient = async () => {
    const respuesta = await axios.get(url);
    setClient(respuesta.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
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
            <Nav className="me-auto my-2 my-lg-0" navbarScroll />
            <Nav className="ms-auto">
              <NavDropdown
                title={
                  <span className="profile-section">
                    <span className="admin-name me-2">
                      {client.nombre + " " + client.apellido}
                    </span>
                    <Image
                      src={client.imagen}
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
    </>
  );
};

export default NavScrollExample;
