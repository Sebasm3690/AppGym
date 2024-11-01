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
  faEye,
  faCheck,
  faClipboardList,
  faSpinner,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

import { faChartLine } from "@fortawesome/free-solid-svg-icons";

import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Form,
  FormGroup,
  FormControl,
  ModalBody,
  ModalHeader,
  ModalFooter,
  CardBody,
  ModalTitle,
} from "react-bootstrap";
import { show_alerta } from "../../functions";
import "../Admin/styles.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Otros/sideBar";
import styles from "../Otros/cards.module.css"; // Import CSS Module
import WeekdayCards from "./weekdays";
import WeeklyRoutinePlan from "./tablePlan";

const AssignRoutines = () => {
  const idEntrenador = localStorage.getItem("idEntrenador");
  const url = "http://127.0.0.1:8000/api/v1/client/";
  const [idCliente, setIdCliente] = useState(0);
  const [clients, setClients] = useState([]);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [selectedEjercicios, setSelectedEjercicios] = useState([]);
  const [showModalAssignRoutine, setShowModalAssignRoutine] = useState(false);

  //Rutina
  const urlRoutine = "http://127.0.0.1:8000/api/v1/rutina/";
  const [showModalRutinas, setShowModalRutinas] = useState(false);
  const [showModalInfoRutina, setShowModalInfoRutina] = useState(false);
  const [showModalRutinaEliminar, setShowModalRutinaEliminar] = useState(false);
  const [routines, setRoutines] = useState([]);
  const [idRutina, setIdRutina] = useState(0);
  const [nombreRutina, setNombreRutina] = useState("");
  const [descripcionRutina, setDescripcionRutina] = useState("");

  //seAsigna
  const urlSeAsigna = "http://127.0.0.1:8000/api/v1/seAsigna/";
  const [sets, setSets] = useState([{ reps: "", weight: "" }]); // Initial set
  const [seAsigna, setSeAsigna] = useState([]);

  const navigate = useNavigate();

  //Dias de la semana
  const [showWeekDays, setShowWeekDays] = useState(false);
  const [selectDay, setSelectedDay] = useState(null);

  //Rutinas disponibles
  const [showModalRutinasDisponibles, setShowModalRutinasDisponibles] =
    useState(false);
  const [findedRoutines, setFindedRoutines] = useState([]);

  //Tabla Rutinas

  const [showTableRoutines, setShowTableRoutines] = useState(false);
  const [todasRutinasCliente, setTodasRutinasCliente] = useState([]);

  // Rutina de ejercicios del cliente con series, repeticiones y peso

  const [rutinaCompletaCliente, setRutinaCompletaCliente] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [showModalFullRoutine, setShowModallFullRoutine] = useState(false);
  const [ejerciciosIds, setEjerciciosIds] = useState([]);
  const [nombresEjercicios, setNombresEjercicios] = useState([]);

  useEffect(() => {
    getClients();
    getRoutines();
    getSeAsigna();
  }, []);

  useEffect(() => {
    //console.log(todasRutinasCliente);
  }, [todasRutinasCliente]);

  useEffect(() => {
    console.log(rutinaCompletaCliente);
  }, [rutinaCompletaCliente]);

  useEffect(() => {
    console.log(rutinaCompletaCliente);
  }, [ejerciciosIds]);

  useEffect(() => {
    console.log(rutinaCompletaCliente);
  }, [nombresEjercicios]);

  const getClients = async () => {
    const respuesta = await axios.get(url);
    if (Array.isArray(respuesta.data)) {
      setClients(respuesta.data);
    } else {
      console.error("Unexpected data format:", respuesta.data);
      setClients([]); // Maneja el caso donde la data no es un arreglo
    }
  };

  const getRoutines = async () => {
    const respuesta = await axios.get(urlRoutine);
    setRoutines(respuesta.data);
  };

  const getSeAsigna = async () => {
    const respuesta = await axios.get(urlSeAsigna);
    setSeAsigna(respuesta.data);
  };

  const handleSearchResults = (results) => {
    //4.-Actualiza los clientes con los resultados de las busquedas
    setClients(results);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idEntrenador");
    navigate("/loginEntrenador/");
  };

  const handleCloseModal = () => {
    setShowModalRutinas(false);
    setShowModalInfoRutina(false);
  };

  const handleCloseModalAsignarRuitina = () => {
    setShowModalAssignRoutine(false);
    setSets([{ reps: "", weight: "" }]);
    setShowModallFullRoutine(false);
  };

  const handleLlenarCamposRutina = (id_rutina, opcion) => {
    const rutinaAsignadaExistente = seAsigna.find(
      (asigna) =>
        asigna.id_rutina === id_rutina && asigna.id_cliente === idCliente
    );

    if (rutinaAsignadaExistente && opcion === 2) {
      show_alerta(
        "La rutina ya fue asignada para el día " + rutinaAsignadaExistente.dia,
        "warning"
      );
      return;
    }

    console.log("El id de la rutina es: " + id_rutina);
    const urlRutinaEditar = `http://127.0.0.1:8000/ejerciciosRutina/${id_rutina}/`;

    const rutina = routines.find((routine) => routine.id_rutina === id_rutina);

    if (rutina) {
      axios.get(urlRutinaEditar).then((response) => {
        setSelectedEjercicios(response.data.ejercicios);
        // Initialize sets for each exercise
        const initialSets = {};
        setIdRutina(rutina.id_rutina);
        setNombreRutina(rutina.nombre);
        setDescripcionRutina(rutina.descripcion);
        if (opcion === 1) {
          setShowModalInfoRutina(true);
        } else {
          response.data.ejercicios.forEach((ejercicio) => {
            initialSets[ejercicio.id_ejercicio] = [
              { set: "", reps: "", weight: "" },
            ];
          });
          setSets(initialSets);
          setShowModalAssignRoutine(true);
        }
      });
    }
  };

  const handleSetChange = (exerciseId, index, field, value) => {
    //Index es el indice del set específico dentro de la lista de sets que queremos modificar
    //Field es el campo que queremos actualizar, puede ser "reps" o weight
    //Value es el nuevo valor especifico que queremos asignar
    setSets((prevSets) => {
      const newSets = [...prevSets[exerciseId]]; //Crea una nueva copia de la lista de sets del ejercicio identificado por exerciseId, para no modificar el estado directamente
      newSets[index] = { ...newSets[index], [field]: value }; //Actualiza el set específico en la posición index. Actualiza el campo específico (field) con el nuevo valor (value).
      newSets[index] = { ...newSets[index], set: index + 1 };
      return { ...prevSets, [exerciseId]: newSets }; // Copia todas las propiedades del estado previo prevSets. Reemplaza la lista de sets del ejercicio identificado por exerciseId con la nueva lista actualizada newSets.
    });
  };

  // Handle changes when the user updates the weight or repetitions
  const handleSetChangeUpdate = (idEjercicio, setIndex, field, value) => {
    setRutinaCompletaCliente((prevRutinas) =>
      prevRutinas.map((routine) => {
        if (
          routine.id_ejercicio === idEjercicio &&
          routine.serie === setIndex
        ) {
          return { ...routine, [field]: value }; // Update the specific field (peso or repeticiones)
        }
        return routine;
      })
    );
  };

  // Edition function

  const handleEditarRutinaAsignada = () => {
    const urlUpdateRutinaAsignada =
      "http://127.0.0.1:8000/actualizarRutinaAsignada/";

    const data = rutinaCompletaCliente.map((routine) => ({
      id: routine.id,
      serie: routine.serie,
      repeticiones: routine.repeticiones,
      peso: routine.peso,
      fecha: routine.fecha,
      dia: routine.dia,
      id_rutina: routine.id_rutina,
      id_ejercicio: routine.id_ejercicio,
      id_cliente: routine.id_cliente,
    }));

    axios
      .put(urlUpdateRutinaAsignada, data)
      .then((response) => {
        show_alerta("Rutina actualizada con éxito", "success");
        setShowModallFullRoutine(false);
        setShowModalRutinasDisponibles(false);
      })
      .catch((error) => {
        console.error("Error updating routines", error);
        show_alerta("Error al actualizar las rutinas", "danger");
      });
  };

  const handleAddSet = (exerciseId) => {
    setSets((prevSets) => ({
      ...prevSets, //Nos permite copiar todas las propiedades del objeto prevSets, esto asegura que no estamos perdiendo ningún ejercicio que ya tenga sets asignados.
      [exerciseId]: prevSets[exerciseId]
        ? [...prevSets[exerciseId], { set: "", reps: "", weight: "" }] //Si ya existe un conjunto de sets para el ejercicio, se agrega un nuevo set al final del conjunto existente.
        : [{ set: "", reps: "", weight: "" }], //Si no existe inicializa una nueva lista con un solo set vacío.
    }));
  };

  const prepararDatos = () => {
    //Itera sobre cada excerciseId en la lista
    //Se obtiene una lista de todos los excerciseId
    let data = [];

    Object.keys(sets).forEach((exerciseId) => {
      sets[exerciseId].forEach((set) => {
        data.push({
          routineId: idRutina,
          exerciseId: exerciseId,
          clientId: idCliente,
          set: set.set,
          reps: set.reps,
          weight: set.weight,
          day: selectDay,
        });
      });
    });
    return data;
  };

  const handleAsignarRutina = () => {
    const datos = prepararDatos();
    const urlAsignarRutina = "http://127.0.0.1:8000/asignarRutina/";
    console.log(JSON.stringify(datos, null, 2));

    axios.post(urlAsignarRutina, datos).then((response) => {
      show_alerta("Rutina asignada exitosamente", "success");
      setShowModalAssignRoutine(false);
    });
  };

  /* const handleShowModalRutinas = (id_cliente) => {
    setIdCliente(id_cliente);
    setShowModalRutinas(true);
  }; */

  const handleShowWeekDays = (id_cliente) => {
    setIdCliente(id_cliente);
    setShowWeekDays(true);
  };

  const handleShowTableRoutines = (id_cliente) => {
    setIdCliente(id_cliente);
    const urlTodasRutinasCliente =
      "http://127.0.0.1:8000/obtenerTodasRutinasCliente/";
    axios
      .get(urlTodasRutinasCliente, {
        params: {
          id_cliente: id_cliente,
        },
      })
      .then((response) => {
        setTodasRutinasCliente(response.data);
      });
    setClients(id_cliente);
    setShowTableRoutines(true);
  };

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    setShowModalRutinas(true);
  };

  const handleShowRutinasAsignadas = (day) => {
    const urlRutinasAsignadas = "http://127.0.0.1:8000/obtenerRutinasCliente/";
    setSelectedDay(day);
    axios
      .get(urlRutinasAsignadas, {
        params: {
          id_cliente: idCliente,
          dia: day,
        },
      })
      .then((response) => {
        //console.log(response.data);
        const routines = response.data.rutinas || [];

        if (routines.length === 0) {
          show_alerta(
            "No hay rutinas asignadas para el día seleccionado",
            "warning"
          );
          return;
        }

        setFindedRoutines(response.data.rutinas || []);

        setShowModalRutinasDisponibles(true);
      });
  };

  const foundRoutineIds = new Set(
    findedRoutines.map((routine) => routine.id_rutina)
  );

  //id_cliente = request.query_params.get('id_cliente')
  //dia = request.query_params.get('dia')
  //id_rutina = request.query_params.get('id_rutina')

  const handleLlenarCamposRutinaEjercicio = (id_rutina) => {
    console.log("El id ");
    console.log("El id del cliente es: " + idCliente);
    console.log("El id de la rutina es: " + id_rutina);
    console.log("Pertenece al dia: " + selectDay);

    const url = "http://127.0.0.1:8000/obtenerRutinaAsignadaDetalleCompleto/";
    axios
      .get(url, {
        params: {
          id_cliente: idCliente,
          dia: selectDay,
          id_rutina: id_rutina,
        },
      })
      .then((response) => {
        setRutinaCompletaCliente(response.data.asignas);
        setImagenes(response.data.imagenes);
        setEjerciciosIds(response.data.ejerciciosIds);
        setNombresEjercicios(response.data.nombresEjercicios);
        setShowModallFullRoutine(true);
      });
  };

  const handleShowModalEliminar = (id_rutina) => {
    setIdRutina(id_rutina);
    setShowModalRutinaEliminar(true);
  };

  //Eliminar rutina -> Falta enviar el id del cliente como parámetro para eliminar la rutina asignada
  const handleEliminarRutinaAsignada = () => {
    console.log(idRutina);
    console.log(idCliente);
    const urlEliminarRutinaAsignada = `http://127.0.0.1:8000/eliminarRutinaAsignada/${idRutina}/${idCliente}/`;
    axios
      .delete(urlEliminarRutinaAsignada)
      .then((response) => {
        show_alerta("Rutina asignada eliminada con éxito", "success");

        setFindedRoutines((prevRoutines) =>
          prevRoutines.filter((routine) => routine.id_rutina !== idRutina)
        );

        setShowModalRutinaEliminar(false);
        setShowModalRutinasDisponibles(false);

        //Refresh the page after 1 second
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error al eliminar la rutina asignada", error);
      });
  };

  return (
    <div>
      <NavScrollExample
        onSearchResults={handleSearchResults}
        onLogout={handleCerrarSesion}
        showWeekDays={showWeekDays}
        showTableRoutines={showTableRoutines}
      />

      {!showWeekDays && !showTableRoutines && (
        <Container className="mt-5">
          <Row>
            <Col md={2} className="d-none d-md-block">
              {" "}
              <Sidebar />
            </Col>
            <Col md={{ span: 12, offset: 1 }}>
              <div className="panel">
                <div className="panel-heading"></div>
                <Row>
                  <Col xs={6}>
                    <h3>Lista de Clientes</h3>
                  </Col>
                </Row>
              </div>

              <div className="panel-body">
                <Row className={styles.cardContainer}>
                  {Array.isArray(clients) && clients.length > 0 ? (
                    clients
                      .filter(
                        (client) =>
                          parseInt(client.id_entrenador) ===
                          parseInt(idEntrenador)
                      )
                      .map((client) => (
                        <Col md={3} key={client.id_cliente} className="mb-4">
                          <Card className={styles.card}>
                            <Card.Img
                              variant="top"
                              src="https://generationiron.com/wp-content/uploads/2021/08/header-22-1024x543.jpg"
                              className="styles.roundedImage"
                            ></Card.Img>
                            <Card.Body className={styles.cardBody}>
                              <Card.Title className={styles.cardTitle}>
                                {client.nombre} {client.apellido}
                              </Card.Title>
                              <Card.Text
                                className={styles.cardText}
                              ></Card.Text>
                              <Card.Text>
                                <Card.Text>{client.email}</Card.Text>
                                <div className={styles.buttonGroup}>
                                  <div className="d-flex flex-column gap-2">
                                    <Button
                                      variant="primary"
                                      className="me-2"
                                      onClick={() =>
                                        handleShowWeekDays(client.id_cliente)
                                      }
                                    >
                                      <FontAwesomeIcon icon={faClipboardList} />{" "}
                                      Control de rutinas
                                    </Button>
                                    <Button
                                      variant="primary"
                                      className="me-2"
                                      onClick={() =>
                                        handleShowTableRoutines(
                                          client.id_cliente
                                        )
                                      }
                                    >
                                      <FontAwesomeIcon icon={faCalendarAlt} />{" "}
                                      Plan de Rutina Semanal
                                    </Button>
                                  </div>
                                </div>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                  ) : (
                    <p>No hay clientes disponibles</p>
                  )}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      )}

      {/* Mostrar tarjetas días de la semana*/}

      {showWeekDays && (
        <Container style={{ marginTop: "100px" }}>
          <Row>
            <Col md={2} className="d-none d-md-block">
              <Sidebar />
            </Col>
            <Col md={{ span: 12, offset: 1 }}>
              <center>
                <h3>Selecciona el día de la semana</h3>
              </center>
              {/* Se envia la funcion como parametro */}
              <WeekdayCards onSelectDay={handleSelectDay} />{" "}
            </Col>
          </Row>
        </Container>
      )}

      {/* Mostrar tabla de rutinas asignadas*/}
      {showTableRoutines && (
        <Container style={{ marginTop: "100px" }}>
          <Row>
            <Col md={2} className="d-none d-md-block">
              <Sidebar />
            </Col>
            <Col md={{ span: 12, offset: 1 }}>
              <center>
                <h3 className={styles.planTitle}>
                  <FontAwesomeIcon icon={faCalendarAlt} /> Plan de rutina
                  semanal
                </h3>
              </center>
              <WeeklyRoutinePlan
                assignedRoutines={todasRutinasCliente.rutinas}
                onSelectAssignedRoutines={handleShowRutinasAsignadas}
              />
            </Col>
          </Row>
        </Container>
      )}

      {/* Modal mostrar Rutinas*/}

      <Modal
        show={showModalRutinas}
        onHide={() => handleCloseModal()}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Rutinas disponibles para asignar</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="panel-body">
            <Row>
              {routines
                .filter(
                  (routine) =>
                    parseInt(routine.id_entrenador) === parseInt(idEntrenador)
                )
                .filter((routine) => !foundRoutineIds.has(routine.id_rutina))
                .map((routine) => (
                  <Col md={6} key={routine.id_rutina} className="mb-4">
                    <Card>
                      <CardBody>
                        <Card.Title>{routine.nombre}</Card.Title>
                        <Card.Text>{routine.descripcion}</Card.Text>
                        <Card.Text>
                          <Card.Text>{routine.tipo}</Card.Text>
                          <Button
                            variant="primary"
                            className="me-2"
                            onClick={() =>
                              handleLlenarCamposRutina(routine.id_rutina, 1)
                            }
                          >
                            <FontAwesomeIcon icon={faEye} /> Ver rutina
                          </Button>
                          <Button
                            variant="primary"
                            className="me-2"
                            onClick={() =>
                              handleLlenarCamposRutina(routine.id_rutina, 2)
                            }
                          >
                            <FontAwesomeIcon icon={faCheck} /> Asignar rutina
                          </Button>
                        </Card.Text>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
      </Modal>

      {/*Modal mostrar rutinas disponibles para asignar*/}

      <Modal
        show={showModalRutinasDisponibles}
        onHide={() => setShowModalRutinasDisponibles(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Rutinas del día {selectDay}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="panel-body">
            <Row>
              {findedRoutines.map((routine) => (
                <Col md={6} key={routine.id_rutina} className="mb-4">
                  <Card>
                    <CardBody>
                      <Card.Title>{routine.nombre}</Card.Title>
                      <Card.Text>{routine.descripcion}</Card.Text>
                      <Card.Text>
                        <Card.Text>{routine.tipo}</Card.Text>
                        <Button
                          variant="primary"
                          className="me-2"
                          onClick={() =>
                            handleLlenarCamposRutinaEjercicio(routine.id_rutina)
                          }
                        >
                          <FontAwesomeIcon icon={faPencilAlt} /> Editar
                        </Button>
                        <Button
                          variant="danger"
                          className="me-2"
                          onClick={() =>
                            handleShowModalEliminar(routine.id_rutina)
                          }
                        >
                          <FontAwesomeIcon icon={faTrashAlt} /> Eliminar
                        </Button>
                      </Card.Text>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
      </Modal>

      {/* Modal mostrar Info Rutina*/}

      <Modal
        show={showModalInfoRutina}
        onHide={() => setShowModalInfoRutina()}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{nombreRutina}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <p>{descripcionRutina}</p>
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
                      <Card.Title>{selectedEjercicio.nombre}</Card.Title>
                      <Card.Text>{selectedEjercicio.descripcion}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      {/*Modal asignar rutina*/}

      <Modal
        show={showModalAssignRoutine}
        onHide={() => handleCloseModalAsignarRuitina()}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Asignar rutina</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <p>{descripcionRutina}</p>
              {selectedEjercicios.map((selectedEjercicio) => (
                <Col
                  md={12}
                  key={selectedEjercicio.id_ejercicio}
                  className="mb-4"
                >
                  <Card>
                    <Card.Img
                      variant="top"
                      src={selectedEjercicio.imagen}
                      style={{
                        borderRadius: "50%",
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }} // To make the image rounded
                    ></Card.Img>

                    <Card.Body>
                      <Card.Title>{selectedEjercicio.nombre}</Card.Title>
                      <Card.Text>{selectedEjercicio.descripcion}</Card.Text>
                      {/*Set e index se recorren al mismo tiempo*/}
                      {sets[selectedEjercicio.id_ejercicio]?.map(
                        (set, index) => (
                          <div key={index} className="mb-3">
                            <Form.Group as={Row} controlId={`set-${index}`}>
                              <Form.Label column sm="2">
                                SET {index + 1}
                              </Form.Label>
                              <Col sm="4">
                                <Form.Control
                                  type="number"
                                  placeholder="PESO (KG)"
                                  value={set.weight}
                                  onChange={(e) =>
                                    handleSetChange(
                                      selectedEjercicio.id_ejercicio,
                                      index,
                                      "weight",
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                              <Col sm="4">
                                <Form.Control
                                  type="number"
                                  placeholder="REPETICIONES"
                                  value={set.reps}
                                  onChange={(e) =>
                                    handleSetChange(
                                      selectedEjercicio.id_ejercicio,
                                      index,
                                      "reps",
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                            </Form.Group>
                          </div>
                        )
                      )}
                      <Button
                        variant="primary"
                        onClick={() =>
                          handleAddSet(selectedEjercicio.id_ejercicio)
                        }
                      >
                        Agregar Set
                      </Button>
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
            onClick={() => setShowModalAssignRoutine(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => handleAsignarRutina()}>
            Finalizar
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Modal mostrar rutina completa asignada --sirve para editar la rutina-- */}

      <Modal
        show={showModalFullRoutine}
        onHide={() => handleCloseModalAsignarRuitina()}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Rutina asignada</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row>
              {imagenes.map((imagen, imgIndex) => {
                const ejercicioId = ejerciciosIds[imgIndex]; // Use a single `ejercicioId` per image
                const routine = rutinaCompletaCliente.filter(
                  (routine) => routine.id_ejercicio === ejercicioId
                ); // Filter only the relevant sets for this specific exercise

                return (
                  <Col key={imgIndex} md={12} className="mb-4">
                    <Card>
                      <Card.Img
                        variant="top"
                        src={imagen}
                        style={{
                          borderRadius: "50%",
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      ></Card.Img>

                      <Card.Body>
                        <Card.Title>{nombresEjercicios[imgIndex]}</Card.Title>

                        {routine.map((set, setIndex) => (
                          <div key={setIndex} className="mb-3">
                            <FormGroup as={Row}>
                              <Form.Label column sm="2">
                                SET {setIndex + 1}
                              </Form.Label>
                              <Col sm="4">
                                <Form.Label column sm="2">
                                  KG
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="peso"
                                  value={set.peso}
                                  onChange={(e) =>
                                    handleSetChangeUpdate(
                                      set.id_ejercicio,
                                      setIndex + 1,
                                      "peso",
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                              <Col sm="4">
                                <Form.Label column sm="10">
                                  REPETICIONES
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="repeticiones"
                                  value={set.repeticiones}
                                  onChange={(e) =>
                                    handleSetChangeUpdate(
                                      set.id_ejercicio,
                                      setIndex + 1,
                                      "repeticiones",
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                            </FormGroup>
                          </div>
                        ))}

                        <Button
                          variant="primary"
                          onClick={() => handleAddSet(ejercicioId)}
                        >
                          Agregar Set
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalAssignRoutine(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditarRutinaAsignada}>
            Finalizar2
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Modal eliminar rutina asignada*/}

      <Modal
        show={showModalRutinaEliminar}
        onHide={() => handleShowModalEliminar()}
        centered
      >
        <ModalHeader>
          <ModalTitle>Eliminar rutina</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <p>¿Está seguro que desea eliminar la rutina asignada al cliente?</p>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowModalRutinaEliminar(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => handleEliminarRutinaAsignada()}
          >
            Eliminar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AssignRoutines;
