import { useEffect } from "react";
import React, { useDeferredValue, useState } from "react";
import { Accordion, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faDumbbell,
  faList,
  faClipboard,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import "./sideBar.css";

const Sidebar = (/*{ isOpen, toggleSidebar }*/) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (activeLink) => {
    setActiveLink(activeLink); // Set the clicked link as active
    setIsOpen(false); // Close the sidebar after a link is clicked
  };

  const handleAccordionClick = (activeLink) => {
    setActiveLink((prev) => (prev === activeLink ? null : activeLink));
  };

  // Set the initial active link based on the current URL
  useEffect(() => {
    const path = window.location.pathname; // Get the current path
    if (path.startsWith("/homeEntrenador")) {
      setActiveLink("clientes");
    } else if (path.startsWith("/crudRutinas")) {
      setActiveLink("rutinas-creadas");
    } else if (path.startsWith("/catalogo")) {
      setActiveLink("catalogo");
    } else if (path.startsWith("/assignRoutines")) {
      setActiveLink("asignar-rutinas");
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
          <Accordion.Item eventKey="clientes">
            <Nav.Link href="/homeEntrenador/">
              <Accordion.Header>
                {" "}
                <FontAwesomeIcon icon={faUser} className="icon" />
                Gestión clientes
              </Accordion.Header>
            </Nav.Link>
          </Accordion.Item>

          {/* Navigation Two - Gestión Rutinas */}
          <Accordion.Item eventKey="rutinas" flush>
            <Accordion.Header onClick={() => handleAccordionClick("rutinas")}>
              <FontAwesomeIcon icon={faDumbbell} className="icon" />
              Rutinas
            </Accordion.Header>
            <Accordion.Body>
              <Nav className="flex-column">
                <Nav.Link
                  href="/crudRutinas/"
                  className={`sidebar-link ${
                    activeLink === "rutinas-creadas" ? "active" : ""
                  }`}
                  style={{
                    backgroundColor:
                      activeLink === "rutinas-creadas"
                        ? "#1677ff"
                        : "transparent", // Change background color dynamically
                    color:
                      activeLink === "rutinas-creadas" ? "#fff" : "#c2c7d0", // Change text color dynamically
                  }}
                  onClick={() => handleLinkClick("rutinas-creadas")}
                >
                  Rutinas creadas
                </Nav.Link>
                <Nav.Link
                  href="/catalogo/"
                  className={`sidebar-link ${
                    activeLink === "catalogo" ? "active" : ""
                  }`}
                  style={{
                    backgroundColor:
                      activeLink === "catalogo" ? "#1677ff" : "transparent", // Change background color dynamically
                    color: activeLink === "catalogo" ? "#fff" : "#c2c7d0", // Change text color dynamically
                  }}
                  onClick={() => handleLinkClick("catalogo")}
                >
                  Catálogo
                </Nav.Link>
              </Nav>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="asignar-rutinas">
            <Nav.Link href="/assignRoutines/">
              <Accordion.Header>
                {" "}
                <FontAwesomeIcon icon={faList} className="icon" />
                Asignar Rutinas
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
