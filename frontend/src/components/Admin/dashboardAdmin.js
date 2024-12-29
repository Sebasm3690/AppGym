import React, { useState, useEffect } from "react";
import axios from "axios";
import NavScrollExample from "../Otros/NavBarAdmin";
//import Footer from "../Otros/footer";
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

const CrudTrainers = () => {
  const idAdmin = localStorage.getItem("idAdmin");
  const url = "http://127.0.0.1:8000/api/v1/trainer/";
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
  const [cedula, setCedula] = useState("");
  const [rol, setRol] = useState("Admin");
  const [imageFile, setImageFile] = useState("");
  const navigate = useNavigate();
  console.log("ID del admin:", idAdmin);

  useEffect(() => {
    getTrainers();
  }, []);

  const getTrainers = async () => {
    const respuesta = await axios.get(url);
    setTrainers(respuesta.data);
  };

  const handleSearchResults = (results) => {
    //4.-Actualiza los entrenadores con los resultados de las busquedas
    setTrainers(results);
  };

  const validarCedulaEcuatoriana = (cedula) => {
    if (cedula.length !== 10) {
      return false;
    }
    const digitos = cedula.substring(0, 9).split("").map(Number);
    const digitoVerificador = parseInt(cedula.charAt(9), 10);
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let multiplicador = i % 2 === 0 ? 2 : 1;
      let resultado = digitos[i] * multiplicador;
      suma += resultado > 9 ? resultado - 9 : resultado;
    }
    let modulo = suma % 10;
    let resultadoEsperado = modulo === 0 ? 0 : 10 - modulo;
    return resultadoEsperado === digitoVerificador;
  };

  const handleAgregarEntrenador = () => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexSoloLetras = /^[A-Za-z\s]+$/; // Only letters and spaces
    const urlAgregar = `http://127.0.0.1:8000/trainerRegister/`;
    //var parametros;

    if (nombre.trim() === "") {
      show_alerta("El nombre es requerido", "warning");
      return;
    } else if (!regexSoloLetras.test(nombre)) {
      show_alerta("El nombre solo puede contener letras", "warning");
      return;
    } else if (apellido.trim() === "") {
      show_alerta("El apellido es requerido", "warning");
      return;
    } else if (!regexSoloLetras.test(apellido)) {
      show_alerta("El apellido solo puede contener letras", "warning");
      return;
    } else if (correo.trim() === "") {
      show_alerta("El correo es requerido", "warning");
      return;
    } else if (!regexCorreo.test(correo)) {
      show_alerta("El correo no es válido", "warning");
      return;
    } else if (cedula.trim() === "") {
      show_alerta("La cedula es requerida", "warning");
    } else if (!validarCedulaEcuatoriana(cedula.trim())) {
      show_alerta("La cedula no es válida", "warning");
    } else if (username.trim() === "") {
      show_alerta("El nombre de usuario es requerido", "warning");
      return;
    } else if (contrasenia.trim() === "") {
      show_alerta("La contraseña es requerida", "warning");
      return;
    } else {
      /*parametros = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: correo.trim(),
        cedula: cedula.trim(),
        username: username.trim(),
        password: contrasenia,
        id_administrador: idAdmin,
        borrado: false,
        imageFile: imageFile,
      };*/
      //alert(JSON.stringify(parametros, null, 2));

      //I'm uploading I file so I need a FormData
      const formData = new FormData();
      formData.append("nombre", nombre.trim());
      formData.append("apellido", apellido.trim());
      formData.append("email", correo.trim());
      formData.append("cedula", cedula.trim());
      formData.append("username", username.trim());
      formData.append("password", contrasenia);
      formData.append("id_administrador", idAdmin);
      formData.append("borrado", false);
      if (imageFile) {
        formData.append("imagen", imageFile);
      }

      axios
        .post(urlAgregar, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log("Respuesta del servidor", response.data);
          show_alerta("El entrenador ha sido agregado exitosamente", "success");
          setShowModalAgregar(false);
          getTrainers();
          setNombre("");
          setApellido("");
          setCorreo("");
          setCedula("");
          setUsername("");
          setContrasenia("");
          setImageFile("");
        })
        .catch((error) => {
          // Check if the error response exists
          if (error.response && error.response.status === 400) {
            const errors = error.response.data;
            // Display specific backend validation errors
            if (errors.correo) {
              show_alerta(errors.correo, "warning");
            }
            if (errors.username) {
              show_alerta(errors.username, "warning");
            }
          }
        });
    }
  };

  const handleLlenarCamposEntrenador = (id_entrenador) => {
    console.log(id_entrenador);
    const entrenador = trainers.find(
      (trainer) => trainer.id_entrenador === id_entrenador
    );
    if (entrenador) {
      setImageFile(entrenador.imagen);
      setId(entrenador.id_entrenador);
      setNombre(entrenador.nombre);
      setApellido(entrenador.apellido);
      setCorreo(entrenador.email);
      setUsername(entrenador.username);
      setCedula(entrenador.cedula);
    }
    setShowModalEditar(true);
  };

  const handleEditarEntrenador = () => {
    console.log("El id es: " + id);
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexSoloLetras = /^[A-Za-z\s]+$/; // Only letters and spaces
    const urlEditar = `http://127.0.0.1:8000/updateTrainer/${id}/`;

    if (nombre.trim() === "") {
      show_alerta("El nombre es requerido", "warning");
      return;
    } else if (!regexSoloLetras.test(nombre)) {
      show_alerta("El nombre solo puede contener letras", "warning");
      return;
    } else if (apellido.trim() === "") {
      show_alerta("El apellido es requerido", "warning");
    } else if (!regexSoloLetras.test(apellido)) {
      show_alerta("El apellido solo puede contener letras", "warning");
      return;
    } else if (correo.trim() === "") {
      show_alerta("El correo es requerido", "warning");
    } else if (!regexCorreo.test(correo)) {
      show_alerta("El correo no es válido", "warning");
      return;
    } else if (cedula.trim() === "") {
      show_alerta("La cedula es requerida", "warning");
    } else if (!validarCedulaEcuatoriana(cedula.trim())) {
      show_alerta("La cedula no es válida", "warning");
    } else {
      const formData = new FormData();
      formData.append("nombre", nombre.trim());
      formData.append("apellido", apellido.trim());
      formData.append("email", correo.trim());
      formData.append("cedula", cedula.trim());
      formData.append("username", username.trim());
      formData.append("password", contrasenia);
      formData.append("id_administrador", idAdmin);
      formData.append("borrado", false);
      // Check if the file is a new File object
      if (imageFile && imageFile instanceof File) {
        formData.append("imagen", imageFile); // Append the new file
      }

      console.log("La respuesta del frontend es:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      axios
        .put(urlEditar, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log("Respuesta del servidor", response.data);
          show_alerta(
            "El entrenador ha sido actualizado exitosamente",
            "success"
          );

          setShowModalEditar(false);
          getTrainers();
          setNombre("");
          setApellido("");
          setCorreo("");
          setCedula("");
          setUsername("");
          setContrasenia("");
          setImageFile("");
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            const errors = error.response.data;
            if (errors.correo) {
              show_alerta(errors.correo, "warning");
            }
            if (errors.username) {
              show_alerta(errors.username, "warning");
            }
            if (errors.cedula) {
              show_alerta(errors.cedula, "warning");
            }
          } else {
            show_alerta("Ocurrió un error al actualizar el correo", "warning");
          }
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
        getTrainers();
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
        getTrainers();
      })
      .catch((error) => {
        console.error("Error al recuperar el entrenador", error);
      });
  };

  const handleCloseUpdateModal = () => {
    setShowModalEditar(false);
    setNombre("");
    setApellido("");
    setCorreo("");
    setCedula("");
    setUsername("");
    setContrasenia("");
    setImageFile("");
  };

  const handleCloseAddModal = () => {
    setShowModalAgregar(false);
    setNombre("");
    setApellido("");
    setCorreo("");
    setCedula("");
    setUsername("");
    setContrasenia("");
    setImageFile("");
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
                <Row className="d-flex align-items-center justify-content-between mb-3">
                  <Col xs={6}>
                    <h3 className="mb-0 lista-entrenadores">
                      Lista de entrenadores
                    </h3>
                  </Col>
                  {/*Buttons*/}
                  <Col xs="auto">
                    <Button
                      variant="primary"
                      className="btn-agregar me-2 mb-2 btn-responsive"
                      onClick={() => setShowModalAgregar(true)}
                    >
                      <FontAwesomeIcon icon={faPlus} /> <text>Agregar</text>
                    </Button>
                    <Button
                      variant="secondary"
                      className="btn-recuperar mb-2 btn-responsive"
                      onClick={() =>
                        setShowModalEntrenadoresBorrados(
                          !showEntrenadoresBorrados //Es lo mismo que enviarle como true, ya que "showModalEntrenadoresBorrados" está inicializado como false
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faUndo} />{" "}
                      {/*showBorrados ? "Ocultar" : "Mostrar"*/}{" "}
                      <text>Recuperar</text>
                    </Button>
                  </Col>
                </Row>
              </div>
              <div className="table-container">
                {/* Desktop Table Layout */}
                <Table className="main-table">
                  <thead>
                    <tr>
                      <th>Numero entrenador</th>
                      <th>Nombre del entrenador</th>
                      <th>Correo</th>
                      <th>Cédula</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainers
                      .filter(
                        (trainer) =>
                          !trainer.borrado &&
                          parseInt(trainer.id_administrador) ===
                            parseInt(idAdmin)
                      )
                      .map((trainer) => (
                        <tr key={trainer.id_entrenador}>
                          <td>{trainer.id_entrenador}</td>
                          <td>
                            {trainer.imagen && (
                              <img
                                src={
                                  trainer.imagen !== null ||
                                  trainer.imagen.length > 0
                                    ? trainer.imagen
                                    : "https://previews.123rf.com/images/metelsky/metelsky1809/metelsky180900233/109815470-man-avatar-profile-male-face-icon-vector-illustration.jpg"
                                }
                                alt="Previw"
                                className="me-2"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                  border: "1px solid #ccc",
                                }}
                              />
                            )}
                            {trainer.nombre + " " + trainer.apellido}
                          </td>
                          <td>{trainer.email}</td>
                          <td>{trainer.cedula}</td>
                          <td>
                            <div className="action-buttons">
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
                                onClick={() =>
                                  handleMostrarBorrado(trainer.id_entrenador)
                                }
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>

                {/* Mobile Card Layout */}
                <div className="card-container mt-5">
                  {trainers
                    .filter(
                      (trainer) =>
                        !trainer.borrado &&
                        parseInt(trainer.id_administrador) === parseInt(idAdmin)
                    )
                    .map((trainer) => (
                      <div key={trainer.id_entrenador} className="trainer-card">
                        <div
                          className="trainer-card-item w-100 justify-content-center"
                          data-label="Número de entrenador"
                        >
                          {": " + trainer.id_entrenador}
                        </div>
                        <div className="trainer-card-item w-100 text-center justify-content-center">
                          {trainer.imagen && (
                            <img
                              src={
                                trainer.imagen !== null ||
                                trainer.imagen.length > 0
                                  ? trainer.imagen
                                  : "https://previews.123rf.com/images/metelsky/metelsky1809/metelsky180900233/109815470-man-avatar-profile-male-face-icon-vector-illustration.jpg"
                              }
                              alt="Previw"
                              className="me-2"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                border: "1px solid #ccc",
                              }}
                            />
                          )}
                        </div>
                        <div className="trainer-card-item" data-label="Nombre">
                          {trainer.nombre + " " + trainer.apellido}
                        </div>
                        <div className="trainer-card-item" data-label="Correo">
                          {trainer.email}
                        </div>
                        <div className="trainer-card-item" data-label="Cédula">
                          {trainer.cedula}
                        </div>
                        <div className="action-buttons w-100 justify-content-center">
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
                            //className="delete-btn"
                            onClick={() =>
                              handleMostrarBorrado(trainer.id_entrenador)
                            }
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {/*<Footer />*/}
      {/* Modal agregar entrenador */}
      <Modal
        show={showModalAgregar}
        onHide={() => handleCloseAddModal()}
        centered
      >
        <ModalHeader closeButton>
          <Modal.Title className="w-100 text-center">
            Agregar Entrenador
          </Modal.Title>
        </ModalHeader>

        <ModalBody>
          <div className="form-container">
            <Form>
              <FormGroup className="mb-3 w-100 text-center">
                {imageFile && (
                  <img
                    src={
                      imageFile instanceof File
                        ? URL.createObjectURL(imageFile)
                        : imageFile
                    }
                    alt="Preview"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "1px solid #ccc",
                    }}
                  />
                )}

                <div className="custom-file-upload w-100">
                  <label className="btn btn-primary mt-2" htmlFor="fileInput">
                    {imageFile ? "Cambiar imágen" : "Seleccionar imágen"}
                  </label>
                  {/*<span>
                              {imageFile ? imageFile.name : "No se ha seleccionado archivo"}
                              </span>*/}
                  <input
                    className="mt-4"
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    style={{ display: "none" }} // Hide the default input
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        console.log("New image file selected:", file);
                        setImageFile(file); // Update the state with the file
                      }
                    }}
                  />
                </div>
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label className="form-label-custom">Cédula:</Form.Label>
                <Form.Control
                  name="cedula"
                  type="text"
                  onChange={(e) => setCedula(e.target.value)}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Form.Label className="form-label-custom">Nombres:</Form.Label>
                <Form.Control
                  name="nombre"
                  type="text"
                  onChange={(e) => setNombre(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label className="form-label-custom">
                  Apellidos:
                </Form.Label>
                <Form.Control
                  name="apellido"
                  type="text"
                  onChange={(e) => setApellido(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label className="form-label-custom">Correo:</Form.Label>
                <Form.Control
                  name="correo"
                  type="email"
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label className="form-label-custom">
                  Nombre de usuario:
                </Form.Label>
                <Form.Control
                  name="username"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label className="form-label-custom">
                  Contraseña:
                </Form.Label>
                <Form.Control
                  name="contrasenia"
                  type="password"
                  onChange={(e) => setContrasenia(e.target.value)}
                />
              </FormGroup>
            </Form>
          </div>
        </ModalBody>
        <ModalFooter className="modal-footer-custom justify-content-center ">
          <Button
            //variant="dark"
            onClick={() => handleAgregarEntrenador()}
            className="modal-button"
          >
            Agregar
          </Button>
        </ModalFooter>
      </Modal>
      {/* Modal editar entrenador */}
      <Modal
        show={showModalEditar}
        onHide={() => handleCloseUpdateModal()}
        centered
      >
        <ModalHeader closeButton>
          <Modal.Title className="w-100 text-center">
            Editar Entrenador
          </Modal.Title>
        </ModalHeader>

        <ModalBody>
          <div className="form-container">
            <FormGroup className="mb-3 w-100 text-center">
              {imageFile && (
                <img
                  src={
                    imageFile instanceof File
                      ? URL.createObjectURL(imageFile)
                      : imageFile
                  }
                  alt="Preview"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "1px solid #ccc",
                  }}
                />
              )}

              <div className="custom-file-upload">
                <label className="btn btn-primary mt-2" htmlFor="fileInput">
                  {imageFile ? "Cambiar imágen" : "Seleccionar imágen"}
                </label>
                {/*<span>
                  {imageFile ? imageFile.name : "No se ha seleccionado archivo"}
                </span>*/}
                <input
                  className="mt-4"
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }} // Hide the default input
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      console.log("New image file selected:", file);
                      setImageFile(file); // Update the state with the file
                    }
                  }}
                />
              </div>
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Cédula:</Form.Label>
              <Form.Control
                name="cedula"
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Nombres:</Form.Label>
              <Form.Control
                name="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Apellidos:</Form.Label>
              <Form.Control
                name="apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Correo:</Form.Label>
              <Form.Control
                name="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">
                Nombre de usuario:
              </Form.Label>
              <Form.Control
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter className="modal-footer-custom justify-content-center">
          <Button
            //variant="dark"
            className="modal-button"
            onClick={() => handleEditarEntrenador()}
          >
            Actualizar
          </Button>
        </ModalFooter>
      </Modal>
      {/*Crea una ventana modal para preguntar si desea eliminar el entrenador*/}
      <Modal
        show={showModalEliminar}
        onHide={() => setShowModalEliminar(false)}
        centered
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
      {/* Modal desktop mostrar entrenadores borrados */}
      <Modal
        show={showEntrenadoresBorrados}
        onHide={() => setShowModalEntrenadoresBorrados(false)}
        size="lg"
      >
        <ModalHeader closeButton>
          <Modal.Title className="w-100 text-center">
            Entrenadores borrados
          </Modal.Title>
        </ModalHeader>

        <ModalBody className="table-responsive">
          <div className="table-container">
            <Table className="table">
              <thead>
                <tr>
                  <th>Numero entrenador</th>
                  <th>Nombre del entrenador</th>
                  <th>Correo</th>
                  <th>Cédula</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {trainers
                  .filter(
                    (trainer) =>
                      trainer.borrado &&
                      parseInt(trainer.id_administrador) === parseInt(idAdmin)
                  )
                  .map((trainer) => (
                    <tr key={trainer.id_entrenador}>
                      <td>{trainer.id_entrenador}</td>
                      <td>
                        {trainer.imagen && (
                          <img
                            src={
                              trainer.imagen !== null ||
                              trainer.imagen.length > 0
                                ? trainer.imagen
                                : "https://previews.123rf.com/images/metelsky/metelsky1809/metelsky180900233/109815470-man-avatar-profile-male-face-icon-vector-illustration.jpg"
                            }
                            alt="Previw"
                            className="me-2"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "50%",
                              border: "1px solid #ccc",
                            }}
                          />
                        )}
                        {trainer.nombre + " " + trainer.apellido}
                      </td>
                      <td>{trainer.email}</td>
                      <td>{trainer.cedula}</td>
                      <td>
                        <Button
                          variant="info"
                          className="edit-btn me-2 w-100 text-center justify-content-center"
                          onClick={() =>
                            handleRecuperarEntrenador(trainer.id_entrenador)
                          }
                        >
                          <FontAwesomeIcon icon={faUndo} />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>

          {/* Modal mobile mostrar entrenadores borrados */}
          <div className="card-container">
            {trainers
              .filter(
                (trainer) =>
                  trainer.borrado &&
                  parseInt(trainer.id_administrador) === parseInt(idAdmin)
              )
              .map((trainer) => (
                <div key={trainer.id_entrenador} className="trainer-card">
                  <div
                    className="trainer-card-item w-100 justify-content-center"
                    data-label="Número de entrenador"
                  >
                    {": " + trainer.id_entrenador}
                  </div>
                  <div className="trainer-card-item w-100 text-center justify-content-center">
                    {trainer.imagen && (
                      <img
                        src={
                          trainer.imagen !== null || trainer.imagen.length > 0
                            ? trainer.imagen
                            : "https://previews.123rf.com/images/metelsky/metelsky1809/metelsky180900233/109815470-man-avatar-profile-male-face-icon-vector-illustration.jpg"
                        }
                        alt="Previw"
                        className="me-2"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          border: "1px solid #ccc",
                        }}
                      />
                    )}
                  </div>
                  <div className="trainer-card-item" data-label="Nombre">
                    {trainer.nombre + " " + trainer.apellido}
                  </div>
                  <div className="trainer-card-item" data-label="Correo">
                    {trainer.email}
                  </div>
                  <div className="trainer-card-item" data-label="Cédula">
                    {trainer.cedula}
                  </div>
                  <div className="action-buttons w-100 text-center justify-content-center">
                    <Button
                      variant="info"
                      className="edit-btn me-2 "
                      onClick={() =>
                        handleRecuperarEntrenador(trainer.id_entrenador)
                      }
                    >
                      <FontAwesomeIcon icon={faUndo} />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CrudTrainers;
