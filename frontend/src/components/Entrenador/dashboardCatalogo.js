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
  faEyeDropper,
  faEyeLowVision,
  faEye,
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
import "./catalog.css";
//import "../Otros/form.css";
//import "./ModalDesign.css";

const Catalogo = () => {
  const idEntrenador = localStorage.getItem("idEntrenador");
  const navigate = useNavigate();
  const url = "http://127.0.0.1:8000/api/v1/rutina/";
  const urlEjercicios = "http://127.0.0.1:8000/api/v1/ejercicio/";
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
  const [showModalEjercicios, setShowModalEjercicios] = useState(false);

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

  const imagenes = [
    {
      id_rutina: 1,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/espalda-biceps-A.png",
    },
    {
      id_rutina: 2,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/espalda-biceps-B.png",
    },
    {
      id_rutina: 3,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pecho-triceps-A.png",
    },
    {
      id_rutina: 4,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pecho-triceps-B.png",
    },
    {
      id_rutina: 5,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pierna-A.png",
    },
    {
      id_rutina: 6,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pierna-B.png",
    },
    {
      id_rutina: 7,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pierna-C.png",
    },
    {
      id_rutina: 8,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pierna-D.png",
    },
    {
      id_rutina: 9,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pierna-E.png",
    },
  ];

  useEffect(() => {
    getRoutines();
    getEjercicios();
  }, []);

  useEffect(() => {
    filterEjercicios();
  }, [searchTerm, bodyPart, ejercicios]);

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
    if (selectedEjercicios.includes(ejercicio)) {
      setSelectedEjercicios(
        selectedEjercicios.filter(
          (ej) => ej.id_ejercicio !== ejercicio.id_ejercicio
        )
      );
    } else {
      setSelectedEjercicios([...selectedEjercicios, ejercicio]);
    }
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
    const urlAgregarRutina = "http://127.0.0.1:8000/addRoutine/";

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
    const urlEditarRutina = `http://127.0.0.1:8000/updateRoutine/${idRutina}`;

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

  const handleDeleteRutina = () => {
    const urlEliminarRutina = `http://127.0.0.1:8000/api/v1/rutina/${idRutina}/`;
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

  const handleLlenarCamposRutina = (id_rutina) => {
    const urlObtenerEjercicios = `http://127.0.0.1:8000/ejerciciosRutina/${id_rutina}/`;
    axios.get(urlObtenerEjercicios).then((response) => {
      console.log(response.data.ejercicios);
      setSelectedEjercicios(response.data.ejercicios);
    });
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
  };

  const handleOpenSideBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <NavScrollExample
        onSearchResults={handleSearchResults}
        onLogout={handleCerrarSesion}
      />
      <Sidebar isOpen={isOpen} toggleSideBar={handleOpenSideBar} />
      <Container className="mt-5">
        <Row>
          <Col md={2} className="d-none d-md-block">
            {" "}
            <Sidebar />
          </Col>
          <Col md={{ span: 12, offset: 1 }}>
            <div className={`main-content ${isOpen ? "shrinked" : ""}`}>
              <div className="panel-heading"></div>
              <Row>
                {/*<Col xs={6} md={{ span: 8, offset: 4 }}>
                  <h3 className="mb-4  lista-entrenadores">
                    Lista de rutinas catálogo
                  </h3>
                </Col>*/}
                <Col xs={6} className="text-end">
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
                  .filter((routine) => routine.tipo === "Catalogo")
                  .map((routine) => {
                    const imagen = imagenes.find(
                      (imagen) => imagen.id_rutina === routine.id_rutina
                    );
                    return (
                      <Col md={4} key={routine.id_rutina} className="mb-4">
                        <Card className="card-custom">
                          {imagen && (
                            <Card.Img
                              variant="top"
                              src={imagen.url}
                              alt={`Imagen de ${routine.nombre}`}
                              className="card-image-custom"
                            />
                          )}
                          <Card.Body>
                            {" "}
                            <Card.Title>
                              <strong>{routine.nombre}</strong>
                            </Card.Title>
                            <Card.Text>{routine.descripcion}</Card.Text>
                            <Card.Text>
                              <strong>Enfoque:</strong>{" "}
                              {routine.enfoque || (
                                <span className="text-muted">Sin enfoque</span>
                              )}
                            </Card.Text>
                            <Card.Text>
                              {" "}
                              {/*Duración: {routine.duracion} mins*/}
                              {/* <Card.Text>{routine.tipo}</Card.Text> */}
                              <Button
                                variant="primary"
                                className="button-custom"
                                onClick={() =>
                                  handleLlenarCamposRutina(routine.id_rutina)
                                }
                              >
                                <FontAwesomeIcon icon={faEye} /> Visualizar
                                ejercicios
                              </Button>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
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
                <option value="Piernas">Piernas</option>
                <option value="Brazos">Brazos</option>
                <option value="Espalda">Espalda</option>
                <option value="Pecho">Pecho</option>
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
                    ></Card.Img>
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
          {/*<Button
            variant="secondary"
            onClick={() => setShowModalAgregar(false)}
          >
            Cancelar
            </Button>*/}
          <Button
            variant="primary"
            onClick={() => setShowModalEjercicios(true)}
          >
            Agregar ejercicios
          </Button>
          <Button variant="success" onClick={() => handleAgregarRutina()}>
            Agregar Rutina
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
              <Dropdown.Item eventKey="brazos superiores">
                Brazos{/*brazos superiores*/}
              </Dropdown.Item>
              <Dropdown.Item eventKey="pecho">Pecho</Dropdown.Item>
              <Dropdown.Item eventKey="espalda">Espalda</Dropdown.Item>
              <Dropdown.Item eventKey="hombros">Hombros</Dropdown.Item>
              <Dropdown.Item
                eventKey="piernas inferiores" /*"piernas inferiores"*/
              >
                Pierna
              </Dropdown.Item>
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
                    <Card.Img variant="top" src={ejercicio.imagen}></Card.Img>
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
          <Modal.Title className="w-100 text-center">
            Ejercicios catálogo
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
                <option value="Piernas">Piernas</option>
                <option value="Brazos">Brazos</option>
                <option value="Espalda">Espalda</option>
                <option value="Pecho">Pecho</option>
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
                    ></Card.Img>
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
          {/*<Button
            variant="secondary"
            onClick={() => setShowModalAgregar(false)}
          >
            Cancelar
            </Button>*/}
          {/*<Button
            variant="primary"
            onClick={() => setShowModalEjercicios(true)}
          >
            Agregar ejercicios
          </Button> */}
          {/*<Button variant="success" onClick={() => handleEditarRutina()}>
            Editar rutina
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Catalogo;
