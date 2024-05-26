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
  Table,
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
} from "react-bootstrap";
import { show_alerta } from "../../functions";
import "../Admin/styles.css";
import { useNavigate } from "react-router-dom";

const CrudClients = () => {
  const idAdmin = localStorage.getItem("idAdmin");
  const url = "http://127.0.0.1:8000/api/v1/client/";
  const [id, setId] = useState(0);
  const [trainers, setTrainers] = useState([]);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showEntrenadoresBorrados, setShowModalEntrenadoresBorrados] =
    useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [username, setUsername] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const navigate = useNavigate();
  console.log("ID del admin:", idAdmin);

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    const respuesta = await axios.get(url);
    setTrainers(respuesta.data);
  };

  const handleSearchResults = (results) => {
    //4.-Actualiza los entrenadores con los resultados de las busquedas
    setTrainers(results);
  };

  const handleAgregarEntrenador = () => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlAgregar = `http://127.0.0.1:8000/trainerRegister/`;
    var parametros;

    if (nombre.trim() === "") {
      show_alerta("El nombre es requerido", "warning");
      return;
    } else if (apellido.trim() === "") {
      show_alerta("El apellido es requerido", "warning");
    } else if (correo.trim() === "") {
      show_alerta("El correo es requerido", "warning");
    } else if (!regexCorreo.test(correo)) {
      show_alerta("El correo no es válido", "warning");
      return;
    } else if (username.trim() === "") {
      show_alerta("El nombre de usuario es requerido", "warning");
    } else if (contrasenia.trim() === "") {
      show_alerta("La contraseña es requerida", "warning");
    } else {
      parametros = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: correo.trim(),
        username: username.trim(),
        password: contrasenia,
        id_administrador: idAdmin,
        borrado: false,
      };
      alert(JSON.stringify(parametros, null, 2));

      axios
        .post(urlAgregar, parametros)
        .then((response) => {
          console.log("Respuesta del servidor", response.data);
          show_alerta("El entrenador ha sido agregado exitosamente", "success");
          setShowModalAgregar(false);
          getClients();
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  };

  const handleLlenarCamposEntrenador = (id_entrenador) => {
    console.log(id_entrenador);
    const entrenador = trainers.find(
      (trainer) => trainer.id_entrenador === id_entrenador
    );
    if (entrenador) {
      setId(entrenador.id_entrenador);
      setNombre(entrenador.nombre);
      setApellido(entrenador.apellido);
      setCorreo(entrenador.email);
      setUsername(entrenador.username);
    }
    setShowModalEditar(true);
  };

  const handleEditarEntrenador = () => {
    console.log("El id es: " + id);
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlEditar = `http://127.0.0.1:8000/api/v1/trainer/${id}/`;
    var parametros;

    if (nombre.trim() === "") {
      show_alerta("El nombre es requerido", "warning");
      return;
    } else if (apellido.trim() === "") {
      show_alerta("El apellido es requerido", "warning");
    } else if (correo.trim() === "") {
      show_alerta("El correo es requerido", "warning");
    } else if (!regexCorreo.test(correo)) {
      show_alerta("El correo no es válido", "warning");
      return;
    } else {
      parametros = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: correo.trim(),
        username: username.trim(),
        id_administrador: idAdmin,
        borrado: false,
      };
      alert(JSON.stringify(parametros, null, 2));

      axios
        .put(urlEditar, parametros)
        .then((response) => {
          console.log("Respuesta del servidor", response.data);
          show_alerta(
            "El entrenador ha sido actualizado exitosamente",
            "success"
          );
          setShowModalEditar(false);
          getClients();
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  };

  const handleMostrarBorrado = (id_entrenador) => {
    setId(id_entrenador);
    setShowModalEliminar(true);
  };

  const handleBorradoLogico = () => {
    const urlBorrado = `http://127.0.0.1:8000/borradoLogicoEntrenador/${id}/`;
    axios
      .post(urlBorrado)
      .then((response) => {
        show_alerta("El entrenador ha sido dado de baja", "success");
        setShowModalEliminar(false);
        getClients();
      })
      .catch((error) => {
        console.error("Error al dar de baja al entrenador", error);
      });
  };

  const handleRecuperarEntrenador = (id_entrenador) => {
    const urlRecuperar = `http://127.0.0.1:8000/recuperarEntrenador/${id_entrenador}/`;
    axios
      .post(urlRecuperar)
      .then((response) => {
        show_alerta("El entrenador ha sido recuperado", "success");
        getClients();
      })
      .catch((error) => {
        console.error("Error al recuperar el entrenador", error);
      });
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idAdmin");
    navigate("/loginAdmin");
  };

  return (
    <>
      <NavScrollExample
        onSearchResults={handleSearchResults}
        onLogout={handleCerrarSesion}
      />{" "}
      {/*1.- Envia la función handleSearchResults al componente NavScrollExample como un prop*/}
      <Container className="mt-5">
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <div className="panel">
              <div className="panel-heading">
                <Row>
                  <Col xs={6}>
                    <h3>Lista de Entrenadores</h3>
                  </Col>
                  <Col xs={6} className="text-end">
                    <Button
                      variant="primary"
                      className="me-2 mb-2 btn-responsive"
                      onClick={() => setShowModalAgregar(true)}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Agregar Entrenador
                    </Button>
                    <Button
                      variant="secondary"
                      className="me-2 mb-2 btn-responsive"
                      onClick={() =>
                        setShowModalEntrenadoresBorrados(
                          !showEntrenadoresBorrados //Es lo mismo que enviarle como true, ya que "showModalEntrenadoresBorrados" está inicializado como false
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faEyeSlash} />{" "}
                      {/*showBorrados ? "Ocultar" : "Mostrar"*/} Entrenadores
                      Dados de Baja
                    </Button>
                  </Col>
                </Row>
              </div>
              <div className="panel-body table-responsive">
                <Table striped bordered hover className="table" id="tablaAdmin">
                  <thead>
                    <tr>
                      <th>Acciones</th>
                      <th>Numero entrenador</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Correo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainers
                      .filter((trainer) => !trainer.borrado)
                      .map((trainer) => (
                        <tr key={trainer.id_entrenador}>
                          <td>
                            <Button
                              variant="primary"
                              className="edit-btn me-2"
                              onClick={() =>
                                handleLlenarCamposEntrenador(
                                  trainer.id_entrenador
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faPencilAlt} />
                            </Button>
                            <Button
                              variant="danger"
                              className="delete-btn"
                              onClick={() =>
                                handleMostrarBorrado(trainer.id_entrenador)
                              }
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>
                          </td>
                          <td>{trainer.id_entrenador}</td>
                          <td>{trainer.nombre}</td>
                          <td>{trainer.apellido}</td>
                          <td>{trainer.email}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
      {/* Modal agregar entrenador */}
      <Modal show={showModalAgregar} onHide={() => setShowModalAgregar(false)}>
        <ModalHeader closeButton>
          <div>
            <Modal.Title>Agregar Entrenador</Modal.Title>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Nombre:</label>
            <input
              className="form-control"
              name="nombre"
              type="text"
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Apellido:</Form.Label>
            <input
              className="form-control"
              name="apellido"
              type="text"
              onChange={(e) => setApellido(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Correo:</Form.Label>
            <input
              className="form-control"
              name="correo"
              type="text"
              onChange={(e) => setCorreo(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Nombre de usuario:</Form.Label>
            <input
              className="form-control"
              name="username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Contraseña:</Form.Label>
            <input
              className="form-control"
              name="contrasenia"
              type="text"
              onChange={(e) => setContrasenia(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => handleAgregarEntrenador()}>
            Agregar
          </Button>
        </ModalFooter>
      </Modal>
      {/* Modal editar entrenador */}
      <Modal show={showModalEditar} onHide={() => setShowModalEditar(false)}>
        <ModalHeader closeButton>
          <div>
            <Modal.Title>Editar Entrenador</Modal.Title>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Nombre:</label>
            <input
              className="form-control"
              name="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Apellido:</Form.Label>
            <input
              className="form-control"
              name="apellido"
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Correo:</Form.Label>
            <input
              className="form-control"
              name="correo"
              type="text"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Nombre de usuario:</Form.Label>
            <input
              className="form-control"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => handleEditarEntrenador()}>
            Actualizar
          </Button>
        </ModalFooter>
      </Modal>
      {/*Crea una ventana modal para preguntar si desea eliminar el entrenador*/}
      <Modal
        show={showModalEliminar}
        onHide={() => setShowModalEliminar(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Entrenador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea dar de baja al entrenador?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalEliminar(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => handleBorradoLogico()}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal mostrar entrenadores borrados */}
      <Modal
        show={showEntrenadoresBorrados}
        onHide={() => setShowModalEntrenadoresBorrados(false)}
        size="lg"
      >
        <ModalHeader closeButton>
          <div>
            <Modal.Title>Ver entrenadores borrados</Modal.Title>
          </div>
        </ModalHeader>

        <ModalBody className="table-responsive">
          <Table striped bordered hover className="table" id="tablaAdmin">
            <thead>
              <tr>
                <th>Acciones</th>
                <th>Numero entrenador</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {trainers
                .filter((trainer) => trainer.borrado)
                .map((trainer) => (
                  <tr key={trainer.id_entrenador}>
                    <td>
                      <Button
                        variant="info"
                        className="edit-btn me-2"
                        onClick={() =>
                          handleRecuperarEntrenador(trainer.id_entrenador)
                        }
                      >
                        <FontAwesomeIcon icon={faUndo} /> Recuperar
                      </Button>
                    </td>
                    <td>{trainer.id_entrenador}</td>
                    <td>{trainer.nombre}</td>
                    <td>{trainer.apellido}</td>
                    <td>{trainer.email}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CrudClients;
