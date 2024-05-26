import React from "react";
import { Container, Navbar } from "react-bootstrap";
//import "./Footer.scss"; // Asegúrate de tener un archivo de estilos para personalizaciones específicas

function Footer() {
  return (
    <Navbar fixed="bottom" bg="dark" variant="dark">
      <Container className="justify-content-center">
        <Navbar.Text>© 2024 Mi Compañía</Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default Footer;
