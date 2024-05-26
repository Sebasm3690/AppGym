// NavScrollExample.jsx
import React from "react";
import { Navbar, Nav } from "react-bootstrap";
//import "./NavBar.css";

const NavScrollExample = () => {
  return (
    <Navbar className="navbar-custom" expand="lg">
      <Navbar.Brand href="#home">INICIO</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="#home">INICIAR SESION</Nav.Link>
          <Nav.Link href="#link">ACERCA DE</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavScrollExample;
