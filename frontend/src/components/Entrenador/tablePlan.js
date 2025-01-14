import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faCheckCircle,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";
import { Table, Button, CardBody } from "react-bootstrap";
import styles from "../Otros/table.module.css";
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
} from "@fortawesome/free-solid-svg-icons";

import { faChartLine } from "@fortawesome/free-solid-svg-icons";
//import "../Admin/styles.css";
import "./routines.css";
import { Card, Col, Row } from "react-bootstrap";
import "./tablePlan.css";
//import "../Otros/cards.module.css";

const WeeklyRoutinePlan = ({
  assignedRoutines,
  onSelectAssignedRoutines,
  idCliente,
}) => {
  //alert(JSON.stringify(assignedRoutines, null, 2));
  const [estadoRutinas, setEstadoRutinas] = useState([]);
  const urlEstadoRutina = "http://127.0.0.1:8000/mostrarEstadoRutina/";
  useEffect(() => {
    getEstadoRutinas();
  }, []);

  const getEstadoRutinas = () => {
    axios
      .get(urlEstadoRutina, {
        params: {
          id_cliente: idCliente,
        },
      })
      .then((response) => {
        console.log("API Response:", response.data); // Debug API response
        setEstadoRutinas(response.data.rutinas || []); // Handle missing `rutinas`
      })
      .catch((error) => console.error("API Error:", error)); // Handle errors
  };

  if (!Array.isArray(assignedRoutines)) {
    return <p>No hay rutinas asignadas</p>;
  }

  const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];

  const routinesByDay = daysOfWeek.map((day) => {
    return {
      day,
      assignedRoutines: assignedRoutines.filter(
        (assignedRoutine) => assignedRoutine.dia === day
      ),
    };
  });

  const findEstado = (id_rutina) => {
    const estado = estadoRutinas.find(
      (estadoRutina) => Number(estadoRutina.id_rutina) === Number(id_rutina) // Ensure matching types
    );
    return estado ? estado.status : null; // Return default text if no match
  };

  return (
    <div className="routine-table-container">
      <Table striped bordered hover className={styles.planTable}>
        <thead className="w-100">
          <tr>
            <th className="text-dark text-center">Día</th>
            <th className="text-dark text-center">Rutina</th>
            <th className="text-dark text-center">Enfoque</th>
            <th className="text-dark text-center">Estado de asignación</th>
            <th className="text-dark text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="w-100 text-center">
          {routinesByDay.map(({ day, assignedRoutines }) => (
            <tr key={day}>
              <td className="text-dark">{day}</td>
              <td>
                {assignedRoutines.length > 0
                  ? assignedRoutines.map((routine) => (
                      <div key={routine.id_rutina}>
                        {routine.nombre} {routine.descripcion}
                      </div>
                    ))
                  : null}
              </td>
              <td>
                {assignedRoutines.length > 0
                  ? assignedRoutines.map((routine) => (
                      <div key={routine.id_rutina}>{routine.enfoque}</div>
                    ))
                  : null}
              </td>
              <td>
                {assignedRoutines.length > 0
                  ? assignedRoutines.map((routine) => (
                      <div key={routine.id_rutina}>
                        {findEstado(routine.id_rutina) ? (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-success w-100 icon"
                            title="Completado"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faHourglassHalf}
                            className="text-success w-100 icon"
                            title="Completado"
                          />
                        )}
                      </div>
                    ))
                  : null}
              </td>
              <td>
                <Button
                  variant="primary"
                  className="btn-primary w-md-auto px-4 py-2 me-2 fw-bold gradient-secondary"
                  onClick={() => onSelectAssignedRoutines(day)}
                >
                  <FontAwesomeIcon icon={faEye} /> Rutinas asignadas
                </Button>
                {/*<Button
                  variant="success"
                  className="btn-success w-md-auto px-4 py-2 fw-bold gradient-success md-3"
                  //className="me-2"
                  /*onClick={() =>
                  handleLlenarCamposRutinaEjercicio(routine.id_rutina)
                }*/
                /*>
                  <FontAwesomeIcon icon={faChartLine} className="me-2" />{" "}
                  Progreso
                </Button>*/}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Cards for Mobile */}
      <Row className="mt-4">
        {routinesByDay.map(({ day, assignedRoutines }) => (
          <Col key={day} xs={12} className="mb-4 d-md-none">
            <Card>
              <CardBody>
                {/* Day Title */}
                <Card.Title className="w-100 text-center mb-3 card-title-table-plan">
                  <strong>{day}</strong>
                </Card.Title>

                {/* Routine Details */}
                {assignedRoutines.length > 0 ? (
                  assignedRoutines.map((routine) => (
                    <div
                      key={routine.id_rutina}
                      className="card-main-content-plan"
                    >
                      <Card.Text className="mb-1">
                        {" "}
                        <strong>Nombre: </strong>
                        {routine.nombre}
                      </Card.Text>
                      <Card.Text className="mb-1">
                        {routine.descripcion || (
                          <span className="text-muted">Sin descripción</span>
                        )}
                      </Card.Text>
                      <Card.Text className="mb-1">
                        <strong>Enfoque: </strong>
                        {routine.enfoque}
                      </Card.Text>
                      <Card.Text className="mt-1 w-100 text-center">
                        <strong>Estado de asignación: </strong>
                        {assignedRoutines.length > 0
                          ? assignedRoutines.map((routine) => (
                              <div key={routine.id_rutina}>
                                {findEstado(routine.id_rutina) ? (
                                  <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-success w-100 icon"
                                    title="Completado"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faHourglassHalf}
                                    className="text-success w-100 icon"
                                    title="Completado"
                                  />
                                )}
                              </div>
                            ))
                          : null}
                      </Card.Text>
                    </div>
                  ))
                ) : (
                  <p className="w-100 text-center text-muted">
                    No hay rutinas asignadas
                  </p>
                )}

                {/* Action Buttons */}

                <Button
                  variant="primary"
                  className="me-4 fw-bold gradient-primary btn-responsive"
                  style={{ width: "100%", marginBottom: "20px" }}
                  onClick={() => onSelectAssignedRoutines(day)}
                >
                  <FontAwesomeIcon icon={faEye} /> Rutinas asignadas
                </Button>
                {/*<Button
                    variant="success"
                    className="me-4 fw-bold gradient-success btn-responsive"
                  >
                    <FontAwesomeIcon icon={faChartLine} /> Progreso
                  </Button>*/}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default WeeklyRoutinePlan;
