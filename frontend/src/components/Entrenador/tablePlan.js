import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Table, Button } from "react-bootstrap";
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

const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

const WeeklyRoutinePlan = ({ assignedRoutines, onSelectAssignedRoutines }) => {
  if (!Array.isArray(assignedRoutines)) {
    return <p>No hay rutinas asignadas</p>;
  }

  const routinesByDay = daysOfWeek.map((day) => {
    return {
      day,
      assignedRoutines: assignedRoutines.filter(
        (assignedRoutine) => assignedRoutine.dia === day
      ),
    };
  });

  return (
    <div className={styles.planContainer}>
      <Table striped bordered hover className={styles.planTable}>
        <thead>
          <tr>
            <th>Día</th>
            <th>Rutina</th>
            <th>Enfoque</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {routinesByDay.map(({ day, assignedRoutines }) => (
            <tr key={day}>
              <td>{day}</td>
              <td>
                {assignedRoutines.length > 0 ? (
                  assignedRoutines.map((routine) => (
                    <div key={routine.id_rutina}>
                      {routine.nombre} {routine.descripcion}
                    </div>
                  ))
                ) : (
                  <div>No hay rutinas asignadas</div>
                )}
              </td>
              <td>
                {assignedRoutines.length > 0
                  ? assignedRoutines.map((routine) => (
                      <div key={routine.id_rutina}>{routine.enfoque}</div>
                    ))
                  : null}
              </td>
              <td>
                <Button
                  variant="primary"
                  className="me-2"
                  onClick={() => onSelectAssignedRoutines(day)}
                >
                  <FontAwesomeIcon icon={faEye} /> Ver rutinas asignadas
                </Button>
                <Button
                  variant="primary"
                  className="me-2"
                  //onClick={() => handleLlenarCamposRutinaEjercicio(routine.id_rutina)}
                >
                  <FontAwesomeIcon icon={faChartLine} spin /> Ver progreso
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default WeeklyRoutinePlan;
