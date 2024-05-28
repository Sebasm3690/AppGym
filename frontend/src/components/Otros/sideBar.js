// components/Otros/Sidebar.js
import React, { useState } from "react";
import { Nav, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faBars,
  faDumbbell,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import "./sideBar.css"; // Archivo CSS para estilos personalizados

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <div
        className={`sidebar d-flex flex-column flex-shrink-0 p-3 ${
          isOpen ? "open" : ""
        }`}
      >
        <Nav className="flex-column mt-4">
          <Nav.Item>
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="tooltip-home">Gestion clientes</Tooltip>}
            >
              <Nav.Link href="/homeEntrenador" className="text-center">
                <FontAwesomeIcon icon={faHome} /> Inicio
              </Nav.Link>
            </OverlayTrigger>
          </Nav.Item>

          <Nav.Item>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="tooltip-profile">Gestión de clientes</Tooltip>
              }
            >
              <Nav.Link href="/homeEntrenador/" className="text-center">
                <FontAwesomeIcon icon={faUser} /> Gestión de clientes
              </Nav.Link>
            </OverlayTrigger>
          </Nav.Item>
          <Nav.Item>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="tooltip-settings">Gestión de rutinas</Tooltip>
              }
            >
              <Nav.Link href="/configuracionEntrenador" className="text-center">
                <FontAwesomeIcon icon={faDumbbell} /> Gestión de rutinas
              </Nav.Link>
            </OverlayTrigger>
          </Nav.Item>
          <Nav.Item>
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="tooltip-settings">Asignar rutinas</Tooltip>}
            >
              <Nav.Link href="/configuracionEntrenador" className="text-center">
                <FontAwesomeIcon icon={faClipboardList} /> Asignar rutinas
              </Nav.Link>
            </OverlayTrigger>
          </Nav.Item>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
