import React, { useState, useEffect } from "react";
import axios from "axios";
import NavScrollExample from "../Otros/NavBarRutinas";
import Footer from "../Otros/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrashAlt,
  faPlus,
  faEyeSlash,
  faUndo,
  faDeleteLeft,
  faSearch,
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
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { show_alerta } from "../../functions";
import "../Admin/styles.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Otros/sideBar";
import "../Admin/styles.css";
import "./routines.css";
//import "../Otros/form.css";
//import "./ModalDesign.css";

const CrudRoutines = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
  const idEntrenador = localStorage.getItem("idEntrenador");
  const navigate = useNavigate();
  const url = `${apiUrl}/api/v1/rutina/`;
  const urlEjercicios = `${apiUrl}/api/v1/ejercicio/`;
  const [routines, setRoutines] = useState([]);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);

  //Rutina
  const [idRutina, setIdRutina] = useState(0);
  const [nombreRutina, setNombreRutina] = useState("");
  const [descripcionRutina, setDescripcionRutina] = useState("");
  const [showModalRutinaEjercicios, setShowModalRutinaEjercicios] =
    useState(false);

  //Ejercicio
  const [ejercicios, setEjercicios] = useState([]);
  const [ejercicioInstrucciones, setEjercicioInstrucciones] = useState("");
  const [showModalEjercicios, setShowModalEjercicios] = useState(false);
  const [showModalEjerciciosEditar, setShowModalEjerciciosEditar] =
    useState(false);
  const [
    showModalEjerciciosInstrucciones,
    setShowModalEjerciciosInstrucciones,
  ] = useState(false);

  //Pintar de color azul
  const [selectedEjercicios, setSelectedEjercicios] = useState([]);

  //Filtro de busqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [bodyPart, setBodyPart] = useState("All");
  const [filteredEjercicios, setFilteredEjercicios] = useState([]);

  //Lista que se mostrará sobre el enfoque
  const [enfoqueRutina, setEnfoqueRutina] = useState("Piernas");
  //Toggle sidebar
  const [isOpen, setIsOpen] = useState(false);
  //Body parts
  const enfoqueBodyParts = {
    "Cuerpo completo": [
      "Espalda",
      "Pecho",
      "Hombros",
      "Bíceps",
      "Tríceps",
      "Antebrazos",
      "Core",
      "Piernas",
      "Isquiotibiales",
      "Glúteos",
      "Pantorrillas",
      "abductores",
      "Piernas",
    ],
    Torso: [
      "Espalda",
      "Pecho",
      "Hombros",
      "Bíceps",
      "Tríceps",
      "Antebrazos",
      "Core",
    ],
    Jale: ["Espalda", "Bíceps", "Hombros", "Antebrazos", "Core"],
    Empuje: ["Pecho", "Tríceps", "Hombros", "Core"],
    Brazos: ["Bíceps", "Tríceps", "Antebrazos", "Core"],
    Piernas: [
      "Piernas",
      "Isquiotibiales",
      "Glúteos",
      "Pantorrillas",
      "abductores",
    ],
  };

  {
    /*<Dropdown.Item eventKey="All">Todas</Dropdown.Item>
              <Dropdown.Item eventKey="Espalda">Espalda</Dropdown.Item>
              <Dropdown.Item eventKey="Pecho">Pecho</Dropdown.Item>
              <Dropdown.Item eventKey="Hombros">Hombros</Dropdown.Item>
              <Dropdown.Item eventKey="Bíceps">Bíceps</Dropdown.Item>
              <Dropdown.Item eventKey="Tríceps">Tríceps</Dropdown.Item>
              <Dropdown.Item eventKey="Antebrazos">Antebrazos</Dropdown.Item>
              <Dropdown.Item eventKey="Core">Core</Dropdown.Item>
              <Dropdown.Item eventKey="Piernas">Piernas</Dropdown.Item>
              <Dropdown.Item eventKey="Isquiotibiales">
                Isquiotibiales
              </Dropdown.Item>
              <Dropdown.Item eventKey="Glúteos">Glúteos</Dropdown.Item>
              <Dropdown.Item eventKey="Pantorrillas">
                Pantorrillas
              </Dropdown.Item>
              <Dropdown.Item eventKey="abductores">Abductores</Dropdown.Item>
              <Dropdown.Item eventKey="Piernas">Piernas</Dropdown.Item>*/
  }
  useEffect(() => {
    getRoutines();
    getEjercicios();
  }, []);

  useEffect(() => {
    filterEjercicios();
  }, [searchTerm, bodyPart, ejercicios]);

  useEffect(() => {
    const bodyPartEnfoque = enfoqueBodyParts[enfoqueRutina] || [];
    const filtered = ejercicios.filter((ejercicio) => {
      return (
        (bodyPart === "All" || bodyPart === ejercicio.musculo) &&
        (enfoqueRutina === "" || bodyPartEnfoque.includes(ejercicio.musculo))
      );
    });
    setFilteredEjercicios(filtered);
  }, [ejercicios, bodyPart, enfoqueRutina]);

  const getRoutines = async () => {
    const respuesta = await axios.get(url);
    setRoutines(respuesta.data);
  };

  const getEjercicios = async () => {
    const respuesta = await axios.get(urlEjercicios);
    setEjercicios(respuesta.data);
    setFilteredEjercicios(respuesta.data);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idEntrenador");
    navigate("/loginEntrenador/");
  };

  const handleCardClick = (ejercicio) => {
    if (
      selectedEjercicios.some(
        (ej) => ej.id_ejercicio === ejercicio.id_ejercicio
      )
    ) {
      setSelectedEjercicios(
        selectedEjercicios.filter(
          (ej) => ej.id_ejercicio !== ejercicio.id_ejercicio
        )
      );
    } else {
      setSelectedEjercicios([...selectedEjercicios, ejercicio]);
    }
  };

  const handleShowModalAgregar = () => {
    setSelectedEjercicios([]);
    setShowModalAgregar(true);
  };

  const handleAgregarEjercicio = () => {
    setShowModalEjercicios(false);
    setShowModalAgregar(true);
  };

  const filterEjercicios = () => {
    let ejerciciosFiltrados = ejercicios;

    if (searchTerm) {
      ejerciciosFiltrados = ejerciciosFiltrados.filter((ejercicio) =>
        ejercicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log("Si entra 1");
    }

    if (bodyPart !== "All") {
      ejerciciosFiltrados = ejerciciosFiltrados.filter(
        (ejercicio) => ejercicio.musculo === bodyPart
      );
      console.log("Si entra 2");
    }

    setFilteredEjercicios(ejerciciosFiltrados);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBodyPartChange = (parte) => {
    setBodyPart(parte);
  };

  const handleAgregarRutina = () => {
    const urlAgregarRutina = `${apiUrl}/addRoutine/`;
    console.log(JSON.stringify(selectedEjercicios, null, 2));

    if (nombreRutina.trim() === "") {
      show_alerta("El nombre de la rutina es requerido", "warning");
      return;
    }

    if (selectedEjercicios.length === 0) {
      show_alerta(
        "Se debe agregar al menos 1 ejercicio a la rutina",
        "warning"
      );
      return;
    }

    // Define valid muscles for each focus area
    /*const validMuscles = {
      Pecho: ["Pecho", "Tríceps", "Hombros", "Core"],
      Espalda: ["Espalda", "Bíceps", "Hombros", "Antebrazos", "Core"],
      Brazos: ["Bíceps", "Tríceps", "Antebrazos", "Core"],
      Piernas: [
        "Piernas",
        "Glúteos",
        "Pantorrillas",
        "Isquiotibiales",
        "Abductores",
        "Core",
      ],
      Torso: [
        "Espalda",
        "Bíceps",
        "Hombros",
        "Pecho",
        "Tríceps",
        "Antebrazos",
        "Core",
      ],
    };

    // Validate exercises
    const isValid = selectedEjercicios.every((ejercicio) =>
      validMuscles[enfoqueRutina].includes(ejercicio.musculo)
    );

    if (!isValid) {
      show_alerta(
        "Los ejercicios no están asociados con el enfoque de la rutina",
        "warning"
      );
      return;
    }*/

    const nuevaRutina = {
      nombre: nombreRutina,
      descripcion: descripcionRutina,
      enfoque: enfoqueRutina,
      ejercicios: selectedEjercicios.map((ejercicio) => ejercicio.id_ejercicio),
      id_entrenador: idEntrenador,
    };

    axios
      .post(urlAgregarRutina, nuevaRutina)
      .then((response) => {
        show_alerta("Rutina agregada correctamente", "success");
        getRoutines();
        setShowModalAgregar(false);
        setSelectedEjercicios([]);
        setNombreRutina("");
        setDescripcionRutina("");
      })
      .catch((error) => {
        show_alerta("Error al agregar la rutina", "error");
      });
  };

  const handleEditarRutina = () => {
    const urlEditarRutina = `${apiUrl}/updateRoutine/${idRutina}`;

    if (nombreRutina.trim() === "") {
      show_alerta("El nombre de la rutina es requerido", "warning");
      return;
    }

    if (selectedEjercicios.length === 0) {
      show_alerta(
        "Se debe agregar al menos 1 ejercicio a la rutina",
        "warning"
      );
      return;
    }

    // Define valid muscles for each focus area
    const validMuscles = {
      Pecho: ["Pecho", "Tríceps", "Hombros", "Core"],
      Espalda: ["Espalda", "Bíceps", "Hombros", "Antebrazos", "Core"],
      Brazos: ["Bíceps", "Tríceps", "Antebrazos", "Core"],
      Piernas: [
        "Piernas",
        "Glúteos",
        "Pantorrillas",
        "Isquiotibiales",
        "Abductores",
        "Core",
      ],
      Torso: [
        "Espalda",
        "Bíceps",
        "Hombros",
        "Pecho",
        "Tríceps",
        "Antebrazos",
        "Core",
      ],
    };

    // Validate exercises
    const isValid = selectedEjercicios.every((ejercicio) =>
      validMuscles[enfoqueRutina].includes(ejercicio.musculo)
    );

    if (!isValid) {
      show_alerta(
        "Los ejercicios no están asociados con el tipo de rutina",
        "warning"
      );
      return;
    }

    const rutinaEditada = {
      nombre: nombreRutina,
      descripcion: descripcionRutina,
      enfoque: enfoqueRutina,
      ejercicios: selectedEjercicios.map((ejercicio) => ejercicio.id_ejercicio),
      id_entrenador: idEntrenador,
    };

    axios.put(urlEditarRutina, rutinaEditada).then((response) => {
      show_alerta("Rutina editada correctamente", "success");
      getRoutines();
      setShowModalEditar(false);
      setSelectedEjercicios([]);
      setNombreRutina("");
      setDescripcionRutina("");
    });
  };

  const handleSearchResults = (results) => {
    //4.-Actualiza los clientes con los resultados de las busquedas
    setRoutines(results);
  };

  const handleShowModalEliminar = (id_rutina) => {
    setIdRutina(id_rutina);
    setShowModalEliminar(true);
  };

  const handleDeleteRutina = () => {
    const urlEliminarRutina = `${apiUrl}/api/v1/rutina/${idRutina}/`;
    axios
      .delete(urlEliminarRutina)
      .then((response) => {
        show_alerta("Rutina eliminada correctamente", "success");
        getRoutines();
        setShowModalEliminar(false);
      })
      .catch((error) => {
        show_alerta("Error al eliminar la rutina", "error");
      });
  };

  const handleLlenarCamposRutina = async (id_rutina) => {
    const urlObtenerEjercicios = `${apiUrl}/ejerciciosRutina/${id_rutina}/`;
    const response = await axios.get(urlObtenerEjercicios);

    setSelectedEjercicios(response.data.ejercicios);

    const rutina = routines.find((routine) => routine.id_rutina === id_rutina);
    if (rutina) {
      setIdRutina(id_rutina);
      setNombreRutina(rutina.nombre);
      setDescripcionRutina(rutina.descripcion);
      setEnfoqueRutina(rutina.enfoque);
    }
    setShowModalEditar(true);
  };

  const handleCloseModal = () => {
    setShowModalEjercicios(false);
    setShowModalAgregar(false);
    setShowModalEditar(false);
    setSelectedEjercicios([]);
    setNombreRutina("");
    setDescripcionRutina("");
    setEnfoqueRutina("");
  };

  const handleOpenSideBar = () => {
    setIsOpen(!isOpen);
  };

  const handleDeleteExercise = (id_ejercicio) => {
    setSelectedEjercicios((prevEjercicios) =>
      prevEjercicios.filter(
        (ejercicio) => ejercicio.id_ejercicio !== id_ejercicio
      )
    );
  };

  const handleMostrarInstruccionesEjercicio = (id_ejercicio) => {
    const ejercicio = ejercicios.find(
      (ejercicio) => ejercicio.id_ejercicio === id_ejercicio
    );
    setEjercicioInstrucciones(ejercicio);
    setShowModalEjerciciosInstrucciones(true);
  };

  const handleShowModalAgregarEjercicios = () => {
    setShowModalEjercicios(false);
    setBodyPart("All");
  };

  return (
    <div>
      <NavScrollExample
        onSearchResults={handleSearchResults}
        onLogout={handleCerrarSesion}
      />
      <Sidebar isOpen={isOpen} toggleSideBar={handleOpenSideBar} />
      <Container>
        <Row>
          <Col md={2} className="d-none d-md-block">
            {" "}
            <Sidebar />
          </Col>
          <Col md={{ span: 12, offset: 1 }}>
            <div className={`main-content ${isOpen ? "shrinked" : ""}`}>
              <div className="panel-heading"></div>
              <Row>
                <Col
                  md={{ span: 6, offset: 6 }}
                  xs={{ span: 6, offset: 3 }}
                  className="text-end"
                >
                  <Button
                    variant="primary"
                    className="btn-agregar me-2 mt-4 mb-4  btn-responsive"
                    onClick={() => handleShowModalAgregar(true)}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faPlus} /> Agregar
                  </Button>
                  {/* <Button
                    variant="secondary"
                    className="me-2 mb-2 btn-responsive"
                    //onClick={() => setShowModalRoutinesBorradas(!showRoutinesBorradas)}
                  >
                    <FontAwesomeIcon icon={faEyeSlash} /> Rutinas Borradas
                  </Button> */}
                </Col>
              </Row>
            </div>

            <div className={`main-content ${isOpen ? "shrinked" : ""}`}>
              <Row>
                {routines
                  .filter(
                    (routine) =>
                      parseInt(routine.id_entrenador) ===
                        parseInt(idEntrenador) && routine.tipo === "Creada"
                  )
                  .map((routine) => (
                    <Col md={4} key={routine.id_rutina} className="mb-4">
                      <Card>
                        <Card.Body>
                          {" "}
                          <Card.Title className="w-100 text-start">
                            <strong>{routine.nombre}</strong>
                          </Card.Title>
                          <Card.Text>
                            {routine.descripcion ? (
                              routine.descripcion
                            ) : (
                              <span className="text-muted">
                                Sin descripción
                              </span>
                            )}
                          </Card.Text>
                          <Card.Text>
                            {" "}
                            {/*Duración: {routine.duracion} mins*/}
                            <Card.Text>
                              <strong>Enfoque:</strong> {routine.enfoque}
                            </Card.Text>
                            <div className="w-100 text-center">
                              <Button
                                variant="primary"
                                className="me-2"
                                onClick={() =>
                                  handleLlenarCamposRutina(routine.id_rutina)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faPencilAlt}
                                  className="icon"
                                />{" "}
                                {/*Editar*/}
                              </Button>
                              <Button
                                variant="danger"
                                onClick={() =>
                                  handleShowModalEliminar(routine.id_rutina)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  className="icon"
                                />{" "}
                                {/*Eliminar*/}
                              </Button>
                            </div>
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
      <Modal show={showModalAgregar} onHide={() => handleCloseModal()} centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Agregar Rutina
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form className="form-container">
            <FormGroup className="mb-3">
              <FormControl
                type="text"
                placeholder="Nombre de la rutina"
                onChange={(e) => setNombreRutina(e.target.value)}
                style={{ marginBottom: "15px" }}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormControl
                as="textarea"
                placeholder="Descripción de la rutina"
                onChange={(e) => setDescripcionRutina(e.target.value)}
                rows={3}
                style={{ marginBottom: "15px" }}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">
                Enfoque de la rutina
              </Form.Label>
              <Form.Control
                as="select"
                value={enfoqueRutina}
                onChange={(e) => setEnfoqueRutina(e.target.value)}
                style={{ marginBottom: "15px" }}
              >
                <option value="">Enfoque</option>
                <option value="Cuerpo completo">Cuerpo completo</option>
                <option value="Torso">Torso</option>
                <option value="Jale">Jale</option>
                <option value="Empuje">Empuje</option>
                <option value="Brazos">Brazos</option>
                <option value="Piernas">Piernas</option>

                {/*<option value="Torso">Torso</option>*/}
              </Form.Control>
            </FormGroup>

            <Row>
              {selectedEjercicios.map((selectedEjercicio) => (
                <Col
                  md={6}
                  key={selectedEjercicio.id_ejercicio}
                  className="mb-4"
                >
                  <Card>
                    {/* Card Image */}
                    <Card.Img
                      variant="top"
                      src={selectedEjercicio.imagen}
                    ></Card.Img>
                    {/*Delete button*/}
                    <Button
                      size="small"
                      className="delete-btn position-absolute top-0 end-0"
                      onClick={() =>
                        handleDeleteExercise(selectedEjercicio.id_ejercicio)
                      }
                    ></Button>
                    {/* Card Body */}
                    <Card.Body>
                      {" "}
                      <Card.Title>{selectedEjercicio.nombre}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <Button
              variant="primary"
              onClick={() => setShowModalEjercicios(true)}
              className="w-100 w-md-auto px-4 py-2 fw-bold gradient-primary"
            >
              Agregar ejercicios
            </Button>
            <Button
              variant="success"
              className="w-100 w-md-auto px-4 py-2 fw-bold gradient-success"
              onClick={() => handleAgregarRutina()}
            >
              Finalizar
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Modal todos los ejercicios -> agregar ejercicios */}
      <Modal
        show={showModalEjercicios}
        onHide={() => handleShowModalAgregarEjercicios()}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Ver Ejercicios
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Buscar ejercicios"
              arial-label="Buscar ejercicios"
              arial-describebdy="basic-addon2"
              onChange={handleSearchChange} //En los valores seleccionados no se puede utilizar e.target.value
              value={searchTerm}
            />

            <DropdownButton
              as={InputGroup.Append}
              variant="outline-secondary"
              title={bodyPart !== "All" ? bodyPart : "Parte del cuerpo"}
              id="input-group-dropdown-2"
              alignRight
              onSelect={handleBodyPartChange}
            >
              <Dropdown.Item eventKey="All">Todas</Dropdown.Item>
              {enfoqueBodyParts[enfoqueRutina]?.map((part) => (
                <Dropdown.Item key={part} eventKey={part}>
                  {part}
                </Dropdown.Item>
              )) || (
                <Dropdown.Item disabled>
                  No hay partes del cuerpo disponible
                </Dropdown.Item>
              )}
              {/*<Dropdown.Item eventKey="All">Todas</Dropdown.Item>
              <Dropdown.Item eventKey="Espalda">Espalda</Dropdown.Item>
              <Dropdown.Item eventKey="Pecho">Pecho</Dropdown.Item>
              <Dropdown.Item eventKey="Hombros">Hombros</Dropdown.Item>
              <Dropdown.Item eventKey="Bíceps">Bíceps</Dropdown.Item>
              <Dropdown.Item eventKey="Tríceps">Tríceps</Dropdown.Item>
              <Dropdown.Item eventKey="Antebrazos">Antebrazos</Dropdown.Item>
              <Dropdown.Item eventKey="Core">Core</Dropdown.Item>
              <Dropdown.Item eventKey="Piernas">Piernas</Dropdown.Item>
              <Dropdown.Item eventKey="Isquiotibiales">
                Isquiotibiales
              </Dropdown.Item>
              <Dropdown.Item eventKey="Glúteos">Glúteos</Dropdown.Item>
              <Dropdown.Item eventKey="Pantorrillas">
                Pantorrillas
              </Dropdown.Item>
              <Dropdown.Item eventKey="abductores">Abductores</Dropdown.Item>
              <Dropdown.Item eventKey="Piernas">Piernas</Dropdown.Item>*/}
            </DropdownButton>
          </InputGroup>
          <Form>
            <Row>
              {filteredEjercicios.map((ejercicio) => (
                <Col md={6} key={ejercicio.id_ejercicio} className="mb-4">
                  <Card
                    onClick={() => handleCardClick(ejercicio)}
                    style={{
                      cursor: "pointer",
                      border: selectedEjercicios.includes(ejercicio)
                        ? "2px solid #007bff"
                        : "none",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={ejercicio.imagen}
                      loading="lazy"
                    ></Card.Img>
                    <Card.Body>
                      {" "}
                      <Card.Title>{ejercicio.nombre}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="success"
            className="w-100 w-md-auto px-4 py-2 fw-bold gradient-success"
            onClick={() => handleAgregarEjercicio()}
          >
            Agregar Ejercicios
          </Button>
          <Button
            variant="secondary"
            className="w-100 w-md-auto px-4 py-2 fw-bold"
            onClick={() => setShowModalEjercicios(false)}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal todos los ejercicios -> editar ejercicos */}

      <Modal
        show={showModalEjerciciosEditar}
        onHide={() => setShowModalEjerciciosEditar(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Ver Ejercicios Editar
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Buscar ejercicios"
              arial-label="Buscar ejercicios"
              arial-describebdy="basic-addon2"
              onChange={handleSearchChange} //En los valores seleccionados no se puede utilizar e.target.value
              value={searchTerm}
            />
            <DropdownButton
              as={InputGroup.Append}
              variant="outline-secondary"
              title={bodyPart !== "All" ? bodyPart : "Parte del cuerpo"}
              id="input-group-dropdown-2"
              alignRight
              onSelect={handleBodyPartChange}
            >
              <Dropdown.Item eventKey="All">Todas</Dropdown.Item>
              {enfoqueBodyParts[enfoqueRutina]?.map((part) => (
                <Dropdown.Item key={part} eventKey={part}>
                  {part}
                </Dropdown.Item>
              )) || (
                <Dropdown.Item disabled>
                  No hay partes del cuerpo disponible
                </Dropdown.Item>
              )}
            </DropdownButton>
          </InputGroup>
          <Form>
            <Row>
              {filteredEjercicios.map((ejercicio) => (
                <Col md={6} key={ejercicio.id_ejercicio} className="mb-4">
                  <Card
                    onClick={() => handleCardClick(ejercicio)}
                    style={{
                      cursor: "pointer",
                      border: selectedEjercicios.some(
                        (selected) =>
                          selected.id_ejercicio === ejercicio.id_ejercicio
                      )
                        ? "2px solid #007bff"
                        : "none",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={ejercicio.imagen}
                      loading="lazy"
                    ></Card.Img>
                    <Card.Body>
                      {" "}
                      <Card.Title>{ejercicio.nombre}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="success"
            className="w-100 w-md-auto px-4 py-2 fw-bold gradient-success"
            onClick={() => handleAgregarEjercicio()}
          >
            Agregar Ejercicios
          </Button>
          <Button
            variant="secondary"
            className="w-100 w-md-auto px-4 py-2 fw-bold"
            onClick={() => setShowModalEjercicios(false)}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal eliminar rutina */}
      <Modal
        show={showModalEliminar}
        onHide={() => setShowModalEliminar(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Entrenador</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro que desea eliminar la rutina?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalEliminar(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => handleDeleteRutina()}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal editar rutina */}

      <Modal show={showModalEditar} onHide={() => handleCloseModal()} centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">Editar Rutina</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form className="form-container">
            <FormGroup className="mb-3">
              <FormControl
                type="text"
                placeholder="Nombre de la rutina"
                onChange={(e) => setNombreRutina(e.target.value)}
                style={{ marginBottom: "15px" }}
                value={nombreRutina}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormControl
                as="textarea"
                placeholder="Descripción de la rutina"
                onChange={(e) => setDescripcionRutina(e.target.value)}
                rows={3}
                style={{ marginBottom: "15px" }}
                value={descripcionRutina}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">
                Enfoque de la rutina
              </Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setEnfoqueRutina(e.target.value)}
                style={{ marginBottom: "15px" }}
                value={enfoqueRutina}
              >
                <option value="">Enfoque</option>
                <option value="Cuerpo completo">Cuerpo completo</option>
                <option value="Torso">Torso</option>
                <option value="Jale">Jale</option>
                <option value="Empuje">Empuje</option>
                <option value="Brazos">Brazos</option>
                <option value="Piernas">Piernas</option>
                {/*<option value="Torso">Torso</option>*/}
              </Form.Control>
            </FormGroup>

            <Row>
              {selectedEjercicios.map((selectedEjercicio) => (
                <Col
                  md={6}
                  key={selectedEjercicio.id_ejercicio}
                  className="mb-4"
                >
                  <Card>
                    <Card.Img
                      variant="top"
                      src={selectedEjercicio.imagen}
                      onClick={() =>
                        handleMostrarInstruccionesEjercicio(
                          selectedEjercicio.id_ejercicio
                        )
                      }
                    ></Card.Img>
                    <Button
                      size="small"
                      className="delete-btn position-absolute top-0 end-0"
                      onClick={() =>
                        handleDeleteExercise(selectedEjercicio.id_ejercicio)
                      }
                    ></Button>
                    <Card.Body>
                      {" "}
                      <Card.Title>{selectedEjercicio.nombre}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <Button
              variant="primary"
              className="w-100 w-md-auto px-4 py-2 fw-bold gradient-primary"
              onClick={() => setShowModalEjerciciosEditar(true)}
            >
              Agregar ejercicios {/*editar*/}
            </Button>
            <Button
              variant="success"
              className="w-100 w-md-auto px-4 py-2 fw-bold gradient-success"
              onClick={() => handleEditarRutina()}
            >
              Editar rutina
            </Button>
          </div>
          {/*<Button
            variant="secondary"
            onClick={() => setShowModalAgregar(false)}
          >
            Cancelar
            </Button>*/}
        </Modal.Footer>

        <Modal
          show={showModalEjerciciosInstrucciones}
          onHide={() => setShowModalEjerciciosInstrucciones(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="w-100 text-center">
              {ejercicioInstrucciones?.nombre}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card.Img
              variant="top"
              src={ejercicioInstrucciones?.imagen}
              alt={`${ejercicioInstrucciones?.nombre} preview`}
              style={{ maxWidth: "100%", borderRadius: "10px" }}
            ></Card.Img>
            {/* Display Steps */}
            <div>
              <h5>Instrucciones:</h5>
              <ol>
                {ejercicioInstrucciones.instrucciones &&
                  JSON.parse(ejercicioInstrucciones.instrucciones).map(
                    (instruccion, index) => (
                      <li key={index}>
                        <strong>Paso {index + 1}</strong> {instruccion}
                      </li>
                    )
                  )}
              </ol>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {/*<Button
              variant="secondary"
              onClick={() => setShowModalEjerciciosInstrucciones(false)}
            >
              Cerrar
            </Button>*/}
          </Modal.Footer>
        </Modal>
      </Modal>
    </div>
  );
};

export default CrudRoutines;
