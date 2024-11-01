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
import Sidebar from "../Otros/sideBar";

const CrudClients = () => {
  const idEntrenador = localStorage.getItem("idEntrenador");
  const url = "http://127.0.0.1:8000/api/v1/client/";
  const urlGenero = "http://127.0.0.1:8000/api/v1/genero/";
  const urlNivelGym = "http://127.0.0.1:8000/api/v1/nivelGym/";
  const urlNivelActividad = "http://127.0.0.1:8000/api/v1/nivelActividad/";
  const urlObjetivo = "http://127.0.0.1:8000/api/v1/objetivo/";
  const [id, setId] = useState(0);
  const [clients, setClients] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [selectedGenero, setSelectedGenero] = useState("");
  const [nivelesGym, setNivelesGym] = useState([]);
  const [selectedNivelGym, setSelectedNivelGym] = useState("");
  const [nivelesActividad, setNivelesActividad] = useState([]);
  const [selectedNivelActividad, setSelectedNivelActividad] = useState("");
  const [peso, setPeso] = useState(0);
  const [altura, setAltura] = useState(0);
  const [selectedObjetivo, setSelectedObjetivo] = useState("");
  const [objetivos, setObjetivos] = useState([]);
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showClientesBorrados, setShowModalClientesBorrados] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [username, setUsername] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [id_cliente, setIdCliente] = useState(0);

  const navigate = useNavigate();
  console.log("ID del entrenador:", idEntrenador);

  useEffect(() => {
    getClients();
    getGeneros();
    getNivelesGym();
    getNivelesActividad();
    getObjetivos();
  }, []);

  const getClients = async () => {
    const respuesta = await axios.get(url);
    setClients(respuesta.data);
  };

  const getGeneros = async () => {
    const respuesta = await axios.get(urlGenero);
    setGeneros(respuesta.data);
  };

  const getNivelesGym = async () => {
    const respuesta = await axios.get(urlNivelGym);
    setNivelesGym(respuesta.data);
  };

  const getNivelesActividad = async () => {
    const respuesta = await axios.get(urlNivelActividad);
    setNivelesActividad(respuesta.data);
  };

  const getObjetivos = async () => {
    const respuesta = await axios.get(urlObjetivo);
    setObjetivos(respuesta.data);
  };

  const handleSearchResults = (results) => {
    //4.-Actualiza los clientes con los resultados de las busquedas
    setClients(results);
  };

  const handleAgregarCliente = () => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlAgregar = `http://127.0.0.1:8000/clientRegister/`;

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
    } else if (selectedGenero === "") {
      show_alerta("El género es requerido", "warning");
    } else if (selectedNivelGym === "") {
      show_alerta("El nivel de gimnasio del cliente es requerido", "warning");
    } else if (selectedNivelActividad === "") {
      show_alerta("El nivel de actividad del cliente es requerido", "warning");
    } else if (selectedObjetivo === "") {
      show_alerta("El objetivo del cliente es requerido", "warning");
    } else if (fechaNacimiento === "") {
      show_alerta("La fecha de nacimiento es requerida", "warning");
    } else if (peso === 0) {
      show_alerta("El peso es requerido", "warning");
    } else if (altura === 0) {
      show_alerta("La altura es requerida", "warning");
    } else {
      parametros = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: correo.trim(),
        username: username.trim(),
        password: contrasenia,
        id_genero: parseInt(selectedGenero),
        id_nivel_gym: parseInt(selectedNivelGym),
        id_nivel_actividad: parseInt(selectedNivelActividad),
        id_objetivo: parseInt(selectedObjetivo),
        peso: peso,
        altura: altura,
        fecha_nacimiento: fechaNacimiento,
        id_entrenador: idEntrenador,
      };
      alert(JSON.stringify(parametros, null, 2));

      axios
        .post(urlAgregar, parametros)
        .then((response) => {
          console.log("Respuesta del servidor", response.data);
          show_alerta("El cliente ha sido agregado exitosamente", "success");
          setShowModalAgregar(false);
          getClients(); // Refresh clients after adding the new one

          // Extract id_cliente from the response
          const id_cliente = parseInt(response.data.cliente.id_cliente);

          // Now that id_cliente is available, make subsequent requests using this value
          const urlCalcularTMB = `http://127.0.0.1:8000/calcularTMB/${id_cliente}/`;

          // Calculate TMB
          axios
            .post(urlCalcularTMB)
            .then(() => {
              show_alerta(
                "El TMB del cliente se calculó exitosamente",
                "success"
              );
            })
            .catch((error) => {
              console.error("Error calculando TMB", error.response || error);
            });

          // Delay the calculation of macronutrients to ensure TMB is calculated first
          const urlCalcularMN = `http://127.0.0.1:8000/calcularMacros/${id_cliente}/`;
          setTimeout(() => {
            axios
              .post(urlCalcularMN)
              .then(() => {
                show_alerta(
                  "Los macronutrientes del cliente se agregaron exitosamente",
                  "success"
                );
              })
              .catch((error) => {
                console.error(
                  "Error calculando macronutrientes",
                  error.response || error
                );
                show_alerta("Error al calcular los macronutrientes", "error");
              });
          }, 3000); // 3-second delay to ensure TMB has been calculated first
        })
        .catch((error) => {
          console.log(error.response ? error.response.data : error);
          show_alerta("Error al agregar el cliente", "error");
        });
    }
  };

  const handleLlenarCamposCliente = (id_cliente) => {
    const cliente = clients.find((client) => client.id_cliente === id_cliente);
    if (cliente) {
      setId(cliente.id_cliente);
      setNombre(cliente.nombre);
      setApellido(cliente.apellido);
      setCorreo(cliente.email);
      setUsername(cliente.username);
      setContrasenia(cliente.password);
      setSelectedGenero(cliente.id_genero);
      setSelectedNivelGym(cliente.id_nivel_gym);
      setSelectedNivelActividad(cliente.id_nivel_actividad);
      setSelectedObjetivo(cliente.id_objetivo);
      setPeso(cliente.peso);
      setAltura(cliente.altura);
      setFechaNacimiento(cliente.fecha_nacimiento);
    }
    setShowModalEditar(true);
  };

  const handleEditarCliente = () => {
    console.log("El id es: " + id);
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlEditar = `http://127.0.0.1:8000/api/v1/client/${id}/`;
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
    } else if (selectedGenero === "") {
      show_alerta("El género es requerido", "warning");
    } else if (selectedNivelGym === "") {
      show_alerta("El nivel de gimnasio del cliente es requerido", "warning");
    } else if (selectedNivelActividad === "") {
      show_alerta("El nivel de actividad del cliente es requerido", "warning");
    } else if (selectedObjetivo === "") {
      show_alerta("El objetivo del cliente es requerido", "warning");
    } else if (fechaNacimiento === "") {
      show_alerta("La fecha de nacimiento es requerida", "warning");
    } else if (peso === 0) {
      show_alerta("El peso es requerido", "warning");
    } else if (altura === 0) {
      show_alerta("La altura es requerida", "warning");
    } else {
      parametros = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: correo.trim(),
        username: username.trim(),
        password: contrasenia,
        id_genero: parseInt(selectedGenero),
        id_nivel_gym: parseInt(selectedNivelGym),
        id_nivel_actividad: parseInt(selectedNivelActividad),
        id_objetivo: parseInt(selectedObjetivo),
        peso: peso,
        altura: altura,
        fecha_nacimiento: fechaNacimiento,
        id_entrenador: idEntrenador,
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

  const handleMostrarBorrado = (id_cliente) => {
    setId(id_cliente);
    setShowModalEliminar(true);
  };

  const handleBorradoLogico = () => {
    const urlBorrado = `http://127.0.0.1:8000/borradoLogicoCliente/${id}/`;
    axios
      .post(urlBorrado)
      .then((response) => {
        show_alerta("El cliente ha sido dado de baja", "success");
        setShowModalEliminar(false);
        getClients();
      })
      .catch((error) => {
        console.error("Error al dar de baja al cliente", error);
      });
  };

  const handleRecuperarCliente = (id_cliente) => {
    const urlRecuperar = `http://127.0.0.1:8000/recuperarCliente/${id_cliente}/`;
    axios
      .post(urlRecuperar)
      .then((response) => {
        show_alerta("El cliente ha sido recuperado", "success");
        getClients();
      })
      .catch((error) => {
        console.error("Error al recuperar el cliente", error);
      });
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idEntrenador");
    navigate("/loginEntrenador/");
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
          <Col md={2} className="d-none d-md-block">
            <Sidebar />
          </Col>
          <Col md={{ span: 12, offset: 1 }}>
            <div className="panel">
              <div className="panel-heading">
                <Row>
                  <Col xs={6}>
                    <h3>Lista de Clientes</h3>
                  </Col>
                  <Col xs={6} className="text-end">
                    <Button
                      variant="primary"
                      className="me-2 mb-2 btn-responsive"
                      onClick={() => setShowModalAgregar(true)}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Agregar Cliente
                    </Button>
                    <Button
                      variant="secondary"
                      className="me-2 mb-2 btn-responsive"
                      onClick={() =>
                        setShowModalClientesBorrados(
                          !showClientesBorrados //Es lo mismo que enviarle como true, ya que "showModalEntrenadoresBorrados" está inicializado como false
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faEyeSlash} />
                      {/*showBorrados ? "Ocultar" : "Mostrar"*/} Clientes
                      Borrados
                    </Button>
                  </Col>
                </Row>
              </div>
              <div className="panel-body table-responsive">
                <Table striped bordered hover className="table" id="tablaAdmin">
                  <thead>
                    <tr>
                      <th>Acciones</th>
                      <th>Numero cliente</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Correo</th>
                      <th>Genero</th>
                      <th>Nivel en gimnasio</th>
                      <th>Nivel actividad</th>
                      <th>Objetivo</th>
                      <th>Peso</th>
                      <th>Altura</th>
                      <th>Fecha de nacimiento</th>
                      {/* <th>Telefono</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {clients
                      .filter(
                        (client) =>
                          client.borrado === false &&
                          parseInt(client.id_entrenador) ===
                            parseInt(idEntrenador)
                      )
                      .map((client) => (
                        <tr key={client.id_cliente}>
                          <td>
                            <Button
                              variant="primary"
                              className="edit-btn me-2"
                              onClick={() =>
                                handleLlenarCamposCliente(client.id_cliente)
                              }
                            >
                              <FontAwesomeIcon icon={faPencilAlt} />
                            </Button>
                            <Button
                              variant="danger"
                              className="delete-btn"
                              onClick={() =>
                                handleMostrarBorrado(client.id_cliente)
                              }
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>
                          </td>
                          <td>{client.id_cliente}</td>
                          <td>{client.nombre}</td>
                          <td>{client.apellido}</td>
                          <td>{client.email}</td>
                          <td>{client.genero.nombre}</td>
                          <td>{client.nivel_gym.nombre}</td>
                          <td>{client.nivel_actividad.nombre}</td>
                          <td>{client.objetivo.nombre}</td>
                          <td>{client.peso}</td>
                          <td>{client.altura}</td>
                          <td>{client.fecha_nacimiento}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {/*<Footer />*/}
      {/* Modal agregar entrenador */}
      <Modal show={showModalAgregar} onHide={() => setShowModalAgregar(false)}>
        <ModalHeader closeButton>
          <div>
            <Modal.Title>Agregar Cliente</Modal.Title>
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
              type="password"
              onChange={(e) => setContrasenia(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Género:</Form.Label>
            <select
              className="form-control"
              onChange={(e) => setSelectedGenero(e.target.value)}
            >
              <option value="">Seleccione un género</option>

              {generos.map((genero) => (
                <option key={genero.id_genero} value={genero.id_genero}>
                  {genero.nombre}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup>
            <Form.Label>Nivel de Gimnasio:</Form.Label>
            <select
              className="form-control"
              onChange={(e) => setSelectedNivelGym(e.target.value)}
            >
              <option value="">Seleccione el nivel de gimnasio</option>

              {nivelesGym.map((nivelGym) => (
                <option
                  key={nivelGym.id_nivel_gym}
                  value={nivelGym.id_nivel_gym}
                >
                  {nivelGym.nombre}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup>
            <Form.Label>Nivel de Actividad:</Form.Label>
            <select
              className="form-control"
              onChange={(e) => setSelectedNivelActividad(e.target.value)}
            >
              <option value="">Seleccione el nivel de actividad</option>

              {nivelesActividad.map((nivelActividad) => (
                <option
                  key={nivelActividad.id_nivel_actividad}
                  value={nivelActividad.id_nivel_actividad}
                >
                  {nivelActividad.nombre}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup>
            <Form.Label>Objetivo</Form.Label>
            <select
              className="form-control"
              onChange={(e) => setSelectedObjetivo(e.target.value)}
            >
              <option value="">Seleccione un objetivo</option>

              {objetivos.map((objetivo) => (
                <option key={objetivo.id_objetivo} value={objetivo.id_objetivo}>
                  {objetivo.nombre}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup>
            <Form.Label>Fecha de nacimiento:</Form.Label>
            <input
              className="form-control"
              name="fechaNacimiento"
              type="date"
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Peso (kg):</Form.Label>
            <input
              className="form-control"
              name="peso"
              type="number"
              onChange={(e) => setPeso(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Altura (cm):</Form.Label>
            <input
              className="form-control"
              name="peso"
              type="number"
              onChange={(e) => setAltura(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => handleAgregarCliente()}>
            Agregar
          </Button>
        </ModalFooter>
      </Modal>
      {/* Modal editar entrenador */}
      <Modal show={showModalEditar} onHide={() => setShowModalEditar(false)}>
        <ModalHeader closeButton>
          <div>
            <Modal.Title>Editar Cliente</Modal.Title>
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
          <FormGroup>
            <Form.Label>Género:</Form.Label>
            <select
              className="form-control"
              value={selectedGenero}
              onChange={(e) => setSelectedGenero(e.target.value)}
            >
              <option value="">Seleccione un género</option>

              {generos.map((genero) => (
                <option key={genero.id_genero} value={genero.id_genero}>
                  {genero.nombre}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup>
            <Form.Label>Nivel de gimnasio:</Form.Label>
            <select
              className="form-control"
              value={selectedNivelGym}
              onChange={(e) => setSelectedNivelGym(e.target.value)}
            >
              <option value="">Seleccione el nivel de gimnasio</option>

              {nivelesGym.map((nivelGym) => (
                <option
                  key={nivelGym.id_nivel_gym}
                  value={nivelGym.id_nivel_gym}
                >
                  {nivelGym.nombre}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup>
            <Form.Label>Nivel de actividad:</Form.Label>
            <select
              className="form-control"
              value={selectedNivelActividad}
              onChange={(e) => setSelectedNivelActividad(e.target.value)}
            >
              <option value="">Seleccione el nivel de actividad</option>
              {nivelesActividad.map((nivelActividad) => (
                <option
                  key={nivelActividad.id_nivel_actividad}
                  value={nivelActividad.id_nivel_actividad}
                >
                  {nivelActividad.nombre}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup>
            <Form.Label>Objetivo:</Form.Label>
            <select
              className="form-control"
              value={selectedObjetivo}
              onChange={(e) => setSelectedObjetivo(e.target.value)}
            >
              <option value="">Seleccione un objetivo</option>
              {objetivos.map((objetivo) => (
                <option key={objetivo.id_objetivo} value={objetivo.id_objetivo}>
                  {objetivo.nombre}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup>
            <Form.Label>Peso (kg):</Form.Label>
            <input
              className="form-control"
              name="peso"
              type="number"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Form.Label>Altura (cm):</Form.Label>
            <input
              className="form-control"
              name="altura"
              type="number"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Form.Label>Fecha de nacimiento:</Form.Label>
            <input
              className="form-control"
              name="fechaNacimiento"
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => handleEditarCliente()}>
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
        <Modal.Body>¿Está seguro que desea dar de baja al cliente?</Modal.Body>
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
        show={showClientesBorrados}
        onHide={() => setShowModalClientesBorrados(false)}
        size="lg"
      >
        <ModalHeader closeButton>
          <div>
            <Modal.Title>Ver clientes borrados</Modal.Title>
          </div>
        </ModalHeader>

        <ModalBody className="table-responsive">
          <Table striped bordered hover className="table" id="tablaAdmin">
            <thead>
              <tr>
                <th>Acciones</th>
                <th>Numero cliente</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Genero</th>
                <th>Nivel en gimnasio</th>
                <th>Nivel actividad</th>
                <th>Objetivo</th>
                <th>Peso</th>
                <th>Altura</th>
                <th>Fecha de nacimiento</th>
              </tr>
            </thead>
            <tbody>
              {clients
                .filter(
                  (client) =>
                    client.borrado === true &&
                    parseInt(client.id_entrenador) === parseInt(idEntrenador)
                )
                .map((client) => (
                  <tr key={client.id_cliente}>
                    <td>
                      <Button
                        variant="info"
                        className="edit-btn me-2"
                        onClick={() =>
                          handleRecuperarCliente(client.id_cliente)
                        }
                      >
                        <FontAwesomeIcon icon={faUndo} />
                        Recuperar
                      </Button>
                    </td>
                    <td>{client.id_cliente}</td>
                    <td>{client.nombre}</td>
                    <td>{client.apellido}</td>
                    <td>{client.email}</td>
                    <td>{client.genero.nombre}</td>
                    <td>{client.nivel_gym.nombre}</td>
                    <td>{client.nivel_actividad.nombre}</td>
                    <td>{client.objetivo.nombre}</td>
                    <td>{client.peso}</td>
                    <td>{client.altura}</td>
                    <td>{client.fecha_nacimiento}</td>
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
