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
        <Accordion defaultActiveKey="0" flush>
          {/* Navigation One - Home */}
          <Accordion.Item eventKey="0">
            <Nav.Link href="/homeCliente/">
              <Accordion.Header>
                {" "}
                <FontAwesomeIcon icon={faHome} className="icon" />
                Inicio
              </Accordion.Header>
            </Nav.Link>
          </Accordion.Item>

          {/* Navigation Two - Asignar Rutinas */}
          <Accordion.Item eventKey="0">
            <Nav.Link href="/dashboardSeguimientoRutina/">
              <Accordion.Header>
                {" "}
                <FontAwesomeIcon icon={faDumbbell} className="icon" />
                Rutinas
              </Accordion.Header>
            </Nav.Link>
          </Accordion.Item>

          {/* Navigation Three */}
          {/* <Accordion.Item eventKey="2">
            <Accordion.Header>
              <FontAwesomeIcon icon={faClipboard} className="icon" />
              Asignar rutinas
            </Accordion.Header>
            <Accordion.Body>
              <Nav className="flex-column">
                <Nav.Link href="#" className="sidebar-link">
                  Option 7
                </Nav.Link>
                <Nav.Link href="#" className="sidebar-link">
                  Option 8
                </Nav.Link>
              </Nav>
            </Accordion.Body>
          </Accordion.Item> */}

          {/* Group */}
          <Accordion.Item eventKey="3">
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
