// NavScrollExample.jsx
import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import "./navBar.css";

const NavScrollExample = () => {
  return (
    <Navbar
      style={{ backgroundColor: "#000" }}
      variant="dark"
      expand="lg"
      className="px-3"
    >
      <Navbar.Brand>CAMPOS FITNESS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link href="/">INICIO</Nav.Link>
          <Nav.Link href="/loginCliente">INICIAR SESION</Nav.Link>
          <Nav.Link href="/about">SOBRE NOSOTROS</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavScrollExample;
