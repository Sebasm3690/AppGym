import { useEffect } from "react";
import React, { useState } from "react";
import { Accordion, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faDumbbell,
  faList,
  faClipboard,
  faBars,
  faBowlFood,
  faBarChart,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./sideBar.css";

const Sidebar = (/*{ isOpen, toggleSidebar }*/) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (activeLink) => {
    setActiveLink(activeLink);
  };

  // Set the initial active link based on the current URL
  useEffect(() => {
    const path = window.location.pathname; // Get the current path
    if (path.startsWith("/homeCliente/")) {
      setActiveLink("inicio");
    } else if (path.startsWith("/dashboardSeguimientoRutina/")) {
      setActiveLink("rutinas");
    } else if (path.startsWith("/dashboardHistorial/")) {
      setActiveLink("historial");
    }
  }, []);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Sidebar appears */}
      <div className={`sidebar ${isOpen ? "visible" : ""}`}>
        {/*Sidebar content*/}
        <div className="main-title-container">
          <h2 className="main-title">Dashboard</h2>
        </div>
        <Accordion defaultActiveKey={activeLink} flush>
          {/* Navigation One - Home */}
          <Accordion.Item eventKey="inicio">
            <Nav.Link href="/homeCliente/">
              <Accordion.Header>
                {" "}
                <FontAwesomeIcon icon={faHome} className="icon" />
                Inicio
              </Accordion.Header>
            </Nav.Link>
          </Accordion.Item>

          {/* Navigation Two - Asignar Rutinas */}
          <Accordion.Item eventKey="rutinas">
            <Nav.Link href="/dashboardSeguimientoRutina/">
              <Accordion.Header>
                {" "}
                <FontAwesomeIcon icon={faDumbbell} className="icon" />
                Rutinas
              </Accordion.Header>
            </Nav.Link>
          </Accordion.Item>

          {/* Group */}
          <Accordion.Item eventKey="historial">
            <Nav.Link href="/dashboardHistorial/">
              <Accordion.Header>
                <FontAwesomeIcon icon={faBarChart} className="icon" />
                Historial
              </Accordion.Header>
            </Nav.Link>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;
