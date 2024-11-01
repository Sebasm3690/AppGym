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
  faBowlFood,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import "./sideBar.css"; // Archivo CSS para estilos personalizados

const SidebarAlimentos = ({ onToggle }) => {
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
          {/* */}
          <Nav.Item>
            <Nav.Link href="/homeEntrenador" className="text-center">
              <FontAwesomeIcon icon={faHome} /> Inicio
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="tooltip-home">Inicio</Tooltip>}
            >
              <Nav.Link href="/homeEntrenador" className="text-center">
                <FontAwesomeIcon icon={faHome} /> Inicio
              </Nav.Link>
            </OverlayTrigger>
          </Nav.Item>

          <Nav.Item>
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="tooltip-settings">Alimentación</Tooltip>}
            >
              <Nav.Link href="/crudRutinas" className="text-center">
                <FontAwesomeIcon icon={faBowlFood} /> Alimentación
              </Nav.Link>
            </OverlayTrigger>
          </Nav.Item>

          <Nav.Item>
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="tooltip-settings">Progreso</Tooltip>}
            >
              <Nav.Link href="/assignRoutines/" className="text-center">
                <FontAwesomeIcon icon={faChartBar} /> Progreso
              </Nav.Link>
            </OverlayTrigger>
          </Nav.Item>
          {/* */}
        </Nav>
      </div>
    </>
  );
};

export default SidebarAlimentos;
