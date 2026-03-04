// NavScrollExample.jsx
import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import "./navBar.css";
import Logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
const NavScrollExample = () => {
  const navigate = useNavigate();
  const handleLogin = (url) => {
    navigate(url);
  };

  return (
    <Navbar
      style={{ backgroundColor: "#000" }}
      variant="dark"
      expand="lg"
      className="px-3"
    >
      <img
        src={Logo}
        width="50"
        height="50"
        className="d-inline-block align-top me-2"
        alt="Campos Fitness Logo"
        onClick={() => handleLogin("/")}
        style={{ cursor: "pointer" }}
      />
      <Navbar.Brand
        onClick={() => handleLogin("/")}
        style={{ cursor: "pointer" }}
      >
        CAMPOS FITNESS
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link href="/">INICIO</Nav.Link>
          {/*<Nav.Link href="/loginCliente">INICIAR SESION</Nav.Link>*/}
          <Nav.Link href="https://www.instagram.com/camposfitnessriobamba/t">
            SOBRE NOSOTROS
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavScrollExample;
