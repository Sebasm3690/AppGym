import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import styles from "../Otros/cards.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrashAlt,
  faPlus,
  faEyeSlash,
  faUndo,
  faEye,
  faDumbbell,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const WeekdayCards = ({ onSelectDay }) => {
  const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
  const dayImages = {
    Lunes:
      "https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2017/06/1109-dumbbell-press-barbell.jpg?quality=86&strip=all",
    Martes:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgM3M8ReN_NtIHiKqj8F6I5XywdQnhFsDX-Ak7aLoPjAXaq2S9g75A-vsby_m5Pi4YzBc&usqp=CAU",
    Miercoles:
      "https://entrenadorpersonal.pro/wp-content/uploads/2023/03/piernas.png",
    Jueves:
      "https://static.tuasaude.com/media/article/lh/xe/back-workout_40109_l.jpg",
    Viernes:
      "https://qph.cf2.quoracdn.net/main-qimg-e9ac6615d57a43fe7f8714f05d93aa1d",
    Sabado:
      "https://steelsupplements.com/cdn/shop/articles/shutterstock_312591206_1000x.jpg?v=1617749471",
  };
  return (
    <Row>
      {days.slice(0, 3).map((day) => (
        <Col md={4} className="mb-4" key={day}>
          <Card className={styles.card}>
            <Card.Img variant="top" src={dayImages[day]}></Card.Img>
            <Card.Body className={styles.cardBody}>
              <Card.Title className={styles.overlayText}>{day}</Card.Title>
              <div className="d-flex flex-column gap-2">
                <Button
                  variant="primary"
                  className="me-2"
                  onClick={() => onSelectDay(day)}
                >
                  <FontAwesomeIcon icon={faDumbbell} /> Asignar rutina
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
      {days.slice(3).map((day) => (
        <Col md={4} className="mb-4" key={day}>
          <Card className={styles.card}>
            <Card.Img variant="top" src={dayImages[day]}></Card.Img>
            <Card.Body className={styles.cardBody}>
              <Card.Title className={styles.overlayText}>{day}</Card.Title>
              <div className="d-flex flex-column gap-2">
                <Button
                  variant="primary"
                  className="me-2"
                  onClick={() => onSelectDay(day)}
                >
                  <FontAwesomeIcon icon={faDumbbell} /> Asignar rutina
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default WeekdayCards;
