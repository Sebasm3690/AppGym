import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const path = window.location.pathname; // Get the current path
    if (path.startsWith("/homeCliente/")) {
      setActiveLink("inicio");
    } else if (path.startsWith("/dashboardControlCalorico/")) {
      setActiveLink("control-calorico");
    } else if (path.startsWith("/dashboardCalorias/")) {
      setActiveLink("progreso"); // Fixed typo here
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
        <Accordion activeKey={activeLink} flush>
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
          <Accordion.Item eventKey="control-calorico">
            <Nav.Link href="/dashboardControlCalorico/">
              <Accordion.Header>
                {" "}
                <FontAwesomeIcon icon={faList} className="icon" />
                Control calórico
              </Accordion.Header>
            </Nav.Link>
          </Accordion.Item>

          {/* Group */}
          <Accordion.Item eventKey="progreso">
            <Accordion.Header onClick={() => handleLinkClick("progreso")}>
              <FontAwesomeIcon icon={faBarChart} className="icon" />
              Progreso
            </Accordion.Header>
            <Accordion.Body>
              <Nav className="flex-column">
                <Nav.Link href="/dashboardCalorias/" className="sidebar-link">
                  Calorías
                </Nav.Link>
              </Nav>
            </Accordion.Body>
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
