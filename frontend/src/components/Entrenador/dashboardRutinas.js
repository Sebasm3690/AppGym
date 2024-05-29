import React, { useState, useEffect } from "react";
import axios from "axios";
import NavScrollExample from "../Otros/NavbarUsuarios";
import Footer from "../Otros/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrashAlt,
  faPlus,
  faEyeSlash,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";

import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Form,
  FormGroup,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormControl,
} from "react-bootstrap";
import { show_alerta } from "../../functions";
import "../Admin/styles.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Otros/sideBar";
import "../Otros/form.css";

const CrudRoutines = () => {
  const navigate = useNavigate();
  const url = "http://127.0.0.1:8000/api/v1/rutina/";
  const urlEjercicios = "http://127.0.0.1:8000/api/v1/ejercicio/";
  const [routines, setRoutines] = useState([]);
  const [showModalAgregar, setShowModalAgregar] = useState(false);

  //Rutina
  const [nombreRutina, setNombreRutina] = useState("");
  const [descripcionRutina, setDescripcionRutina] = useState("");
  const [showModalRutinaEjercicios, setShowModalRutinaEjercicios] =
    useState(false);

  //Ejercicio
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedEjercicios, setSelectedEjercicios] = useState([]);
  const [showModalEjercicios, setShowModalEjercicios] = useState(false);

  useEffect(() => {
    getRoutines();
    getEjercicios();
  }, []);

  const getRoutines = async () => {
    const respuesta = await axios.get(url);
    setRoutines(respuesta.data);
  };

  const getEjercicios = async () => {
    const respuesta = await axios.get(urlEjercicios);
    setEjercicios(respuesta.data);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idEntrenador");
    navigate("/loginEntrenador/");
  };

  const handleShowModalRutinaEjercicios = () => {
    setShowModalAgregar(false);
    setShowModalRutinaEjercicios(true);
  };

  const handleCheckBoxChange = (e, ejercicio) => {
    if (e.target.checked) {
      setSelectedEjercicios(...selectedEjercicios, ejercicio);
    } else {
      setSelectedEjercicios(
        selectedEjercicios.filter(
          (ej) => ej.id_ejercicio !== ejercicio.id_ejercicio
        )
      );
    }
  };

  const handleAgregarEjercicio = () => {
    setShowModalRutinaEjercicios(false);
    setShowModalAgregar(true);
  };

  return (
    <div>
      <NavScrollExample onLogout={handleCerrarSesion} />
      <Container className="mt-5">
        <Row>
          <Col md={2} className="d-none d-md block">
            <Sidebar />
          </Col>
          <Col md={{ span: 12, offset: 1 }}>
            <div className="panel">
              <div className="panel-heading"></div>
              <Row>
                <Col xs={6}>
                  <h3>Lista de Rutinas</h3>
                </Col>
                <Col xs={6} className="text-end">
                  <Button
                    variant="primary"
                    className="me-2 mb-2 btn-responsive"
                    onClick={() => setShowModalAgregar(true)}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faPlus} /> Agregar Rutina
                  </Button>
                  <Button
                    variant="secondary"
                    className="me-2 mb-2 btn-responsive"
                    //onClick={() => setShowModalRoutinesBorradas(!showRoutinesBorradas)}
                  >
                    <FontAwesomeIcon icon={faEyeSlash} /> Rutinas Borradas
                  </Button>
                </Col>
              </Row>
            </div>

            <div className="panel-body">
              <Row>
                {routines.map((routine) => (
                  <Col md={4} key={routine.id_rutina} className="mb-4">
                    <Card>
                      <Card.Body>
                        {" "}
                        <Card.Title>{routine.nombre}</Card.Title>
                        <Card.Text>{routine.descripcion}</Card.Text>
                        <Card.Text>
                          {" "}
                          {/*Duración: {routine.duracion} mins*/}
                          <Card.Text>{routine.tipo}</Card.Text>
                          <Button
                            variant="primary"
                            className="me-2"
                            //onClick={() => handleLlenarCamposRutina(routine.id_rutina)}
                          >
                            <FontAwesomeIcon icon={faPencilAlt} /> Editar
                          </Button>
                          <Button
                            variant="danger"
                            //onClick={() =>handleMostrarBorrado(routine.id_rutina)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} /> Eliminar
                          </Button>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal agregar rutina */}
      <Modal
        show={showModalAgregar}
        onHide={() => setShowModalAgregar(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar Rutina</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FormGroup controlId="nombreRutina">
              <FormControl
                type="text"
                placeholder="Nombre de la rutina"
                onChange={(e) => setNombreRutina(e.target.value)}
                style={{ marginBottom: "15px" }}
              />
            </FormGroup>
            <FormGroup controlId="descripcionRutina">
              <FormControl
                as="textarea"
                placeholder="Descripción de la rutina"
                onChange={(e) => setDescripcionRutina(e.target.value)}
                rows={3}
                style={{ marginBottom: "15px" }}
              />
            </FormGroup>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalAgregar(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowModalEjercicios(true)}
          >
            Agregar ejercicios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal agregar ejercicios */}
      <Modal
        show={showModalEjercicios}
        onHide={() => setShowModalEjercicios(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Ver Ejercicios</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            {ejercicios.map((ejercicio) => (
              <FormGroup key={ejercicio.id_ejercicio}>
                <div d-flex align-items-center>
                  <Form.Check
                    type="checkbox"
                    label={ejercicio.nombre}
                    onChange={(e) => handleCheckBoxChange(e, ejercicio)}
                  >
                    <Card>
                      <Card.Body>
                        {" "}
                        <Card.Title>{ejercicio.nombre}</Card.Title>
                        <Card.Text>
                          {" "}
                          <img
                            src={ejercicio.imagen}
                            alt={ejercicio.nombre}
                            style={{ width: "250px", marginLeft: "10px" }}
                          />
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Form.Check>
                </div>
              </FormGroup>
            ))}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalEjercicios(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => handleAgregarEjercicio()}>
            Agregar Ejercicios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CrudRoutines;
