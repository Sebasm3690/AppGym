import React, { useState } from "react";
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
          {/* Navigation One */}
          <Accordion.Item eventKey="0">
            <Nav.Link href="/homeEntrenador">
              <Accordion.Header>
                {" "}
                <FontAwesomeIcon icon={faUser} className="icon" />
                Clientes
              </Accordion.Header>
            </Nav.Link>
          </Accordion.Item>

          {/* Navigation Two - Gestión Rutinas */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
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

          <Accordion.Item eventKey="0">
            <Nav.Link href="/assignRoutines/">
              <Accordion.Header>
                {" "}
                <FontAwesomeIcon icon={faList} className="icon" />
                Asignar Rutinas
              </Accordion.Header>
            </Nav.Link>
          </Accordion.Item>
          {/* Group */}
          {/* <Accordion.Item eventKey="3">
            <Accordion.Header>
              <FontAwesomeIcon icon={faList} className="icon" />
              Group
            </Accordion.Header>
            <Accordion.Body>
              <Nav className="flex-column">
                <Nav.Link href="#" className="sidebar-link">
                  Option 9
                </Nav.Link>
                <Nav.Link href="#" className="sidebar-link">
                  Option 10
                </Nav.Link>
              </Nav>
            </Accordion.Body>
          </Accordion.Item> */}
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
