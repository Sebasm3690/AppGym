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
import "./ModalDesign.css";
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Poppins:wght@400;500;700&family=Nunito:wght@400;600;700&display=swap"
  rel="stylesheet"
></link>;

const CrudClients = () => {
  const idEntrenador = localStorage.getItem("idEntrenador");
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable or fallback to localhost
  const url = `${apiUrl}/api/v1/client/`;
  const urlGenero = `${apiUrl}/api/v1/genero/`;
  const urlNivelGym = `${apiUrl}/api/v1/nivelGym/`;
  const urlNivelActividad = `${apiUrl}/api/v1/nivelActividad/`;
  const urlObjetivo = `${apiUrl}/api/v1/objetivo/`;
  const urlMembresia = `${apiUrl}/api/v1/membresia/`;
  const urlControlClienteMembresia = `${apiUrl}/controlClienteMembresia/`;
  const [id, setId] = useState(0);
  const [clients, setClients] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [selectedGenero, setSelectedGenero] = useState("");
  const [selectedMembresia, setSelectedMembresia] = useState("");
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
  const [showSecondModalAgregar, setShowSecondModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showClientesBorrados, setShowModalClientesBorrados] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [username, setUsername] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [id_cliente, setIdCliente] = useState(0);
  const [cedula, setCedula] = useState("");
  const [step, setStep] = useState(1);
  const [showSecondModalEditar, setShowSecondModalEditar] = useState(false);
  const [membresias, setMembresias] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const navigate = useNavigate();
  console.log("ID del entrenador:", idEntrenador);
  //Toggle sidebar
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [imageFile, setImageFile] = useState("");

  useEffect(() => {
    getClients();
    getGeneros();
    getNivelesGym();
    getNivelesActividad();
    getObjetivos();
    getMembresias();
    getControlClientesMembresia();
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

  const getMembresias = async () => {
    const respuesta = await axios.get(urlMembresia);
    setMembresias(respuesta.data);
  };

  const getControlClientesMembresia = async () => {
    const respuesta = await axios.post(urlControlClienteMembresia);
    console.log("Control cliente membresia", respuesta.data);
  };

  const handleSearchResults = (results) => {
    //4.-Actualiza los clientes con los resultados de las busquedas
    setClients(results);
  };

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
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

  const handleAgregarCliente = () => {
    const today = new Date();
    const dob = new Date(fechaNacimiento);
    const age = today.getFullYear() - dob.getFullYear();
    //const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlAgregar = `${apiUrl}/clientRegister/`;

    var parametros;

    if (selectedGenero === "") {
      show_alerta("El género es requerido", "warning");
    } else if (selectedNivelGym === "") {
      show_alerta("El nivel de gimnasio del cliente es requerido", "warning");
    } else if (selectedNivelActividad === "") {
      show_alerta("El nivel de actividad del cliente es requerido", "warning");
    } else if (selectedObjetivo === "") {
      show_alerta("El objetivo del cliente es requerido", "warning");
    } else if (fechaNacimiento === "") {
      show_alerta("La fecha de nacimiento es requerida", "warning");
    } else if (isNaN(dob.getTime()) || age < 10 || age > 120) {
      show_alerta("La fecha de nacimiento no es válida", "warning");
    } else if (peso === 0) {
      show_alerta("El peso es requerido", "warning");
    } else if (isNaN(peso) || peso < 30 || peso > 300) {
      show_alerta("El peso no es válido", "warning");
    } else if (altura === 0) {
      show_alerta("La altura es requerida", "warning");
    } else if (isNaN(altura) || altura < 50 || altura > 250) {
      show_alerta("La altura no es válida", "warning");
    } else if (selectedMembresia === "") {
      show_alerta("La membresia es requerida", "warning");
    } else if (fechaInicio > fechaFin) {
      show_alerta(
        "La fecha de inscripción de la membresia debe ser menor a la fecha de fin",
        "warning"
      );
    } else {
      //I'm uploading I file so I need a FormData
      const formData = new FormData();
      formData.append("nombre", nombre.trim());
      formData.append("apellido", apellido.trim());
      formData.append("email", correo.trim());
      formData.append("cedula", cedula.trim());
      formData.append("username", username.trim());
      formData.append("password", contrasenia.trim());
      formData.append("id_genero", parseInt(selectedGenero));
      formData.append("id_nivel_gym", parseInt(selectedNivelGym));
      formData.append("id_nivel_actividad", parseInt(selectedNivelActividad));
      formData.append("id_objetivo", parseInt(selectedObjetivo));
      formData.append("id_membresia", parseInt(selectedMembresia));
      formData.append("peso", peso);
      formData.append("altura", altura);
      formData.append("fecha_nacimiento", fechaNacimiento);
      formData.append("id_entrenador", idEntrenador);
      formData.append("fecha_inicio", fechaInicio);
      formData.append("fecha_fin", fechaFin);
      if (imageFile) {
        formData.append("imagen", imageFile);
      }

      /*parametros = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: correo.trim(),
        cedula: cedula.trim(),
        username: username.trim(),
        password: contrasenia,
        id_genero: parseInt(selectedGenero),
        id_nivel_gym: parseInt(selectedNivelGym),
        id_nivel_actividad: parseInt(selectedNivelActividad),
        id_objetivo: parseInt(selectedObjetivo),
        id_membresia: parseInt(selectedMembresia),
        peso: peso,
        altura: altura,
        fecha_nacimiento: fechaNacimiento,
        id_entrenador: idEntrenador,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        imageFile: imageFile,
      };*/
      //alert(JSON.stringify(parametros, null, 2));

      axios
        .post(urlAgregar, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log("Respuesta del servidor", response.data);
          show_alerta("El cliente ha sido agregado exitosamente", "success");
          setShowModalAgregar(false);
          setShowSecondModalAgregar(false);
          getClients(); // Refresh clients after adding the new one
          setNombre("");
          setApellido("");
          setCorreo("");
          setCedula("");
          setUsername("");
          setContrasenia("");
          setSelectedGenero("");
          setSelectedNivelGym("");
          setSelectedNivelActividad("");
          setSelectedObjetivo("");
          setFechaNacimiento("");
          setImageFile("");
          setPeso(0);
          setAltura(0);
          setStep(1);

          // Extract id_cliente from the response
          const id_cliente = parseInt(response.data.cliente.id_cliente);

          // Now that id_cliente is available, make subsequent requests using this value
          const urlCalcularTMB = `${apiUrl}/calcularTMB/${id_cliente}/`;

          //alert("El id del cliente es:" + id_cliente);
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
          const urlCalcularMN = `${apiUrl}/calcularMacros/${id_cliente}/`;
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
          // Check if the error response exists
          if (error.response && error.response.status === 400) {
            const errors = error.response.data;
            // Display specific backend validation errors
            if (errors.correo) {
              setShowModalAgregar(true);
              setShowSecondModalAgregar(false);
              setStep(1);
              show_alerta(errors.correo, "warning");
            }
            if (errors.username) {
              setShowModalAgregar(true);
              setShowSecondModalAgregar(false);
              setStep(1);
              show_alerta(errors.username, "warning");
            }
            if (errors.cedula) {
              setShowModalAgregar(true);
              setShowSecondModalAgregar(false);
              setStep(1);
              show_alerta(errors.cedula, "warning");
            }
          }
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
      setCedula(cliente.cedula);
      setUsername(cliente.username);
      setContrasenia(cliente.password);
      setSelectedGenero(cliente.id_genero);
      setSelectedNivelGym(cliente.id_nivel_gym);
      setSelectedNivelActividad(cliente.id_nivel_actividad);
      setSelectedObjetivo(cliente.id_objetivo);
      setPeso(cliente.peso);
      setAltura(cliente.altura);
      setFechaNacimiento(cliente.fecha_nacimiento);
      setSelectedMembresia(cliente.id_membresia);
      setFechaInicio(cliente.fecha_inicio);
      setFechaFin(cliente.fecha_fin);
      setImageFile(cliente.imagen);
    }
    setShowModalEditar(true);
  };

  const handleEditarCliente = () => {
    const today = new Date();
    const dob = new Date(fechaNacimiento);
    const age = today.getFullYear() - dob.getFullYear();

    console.log("El id es: " + id);
    const urlEditar = `${apiUrl}/updateClient/${id}/`;
    var parametros;

    if (selectedGenero === "") {
      show_alerta("El género es requerido", "warning");
    } else if (selectedNivelGym === "") {
      show_alerta("El nivel de gimnasio del cliente es requerido", "warning");
    } else if (selectedNivelActividad === "") {
      show_alerta("El nivel de actividad del cliente es requerido", "warning");
    } else if (selectedObjetivo === "") {
      show_alerta("El objetivo del cliente es requerido", "warning");
    } else if (fechaNacimiento === "") {
      show_alerta("La fecha de nacimiento es requerida", "warning");
    } else if (isNaN(dob.getTime()) || age < 10 || age > 80) {
      show_alerta(
        "La fecha de nacimiento no es válida o no está en el rango permitido de 10 a 80 años",
        "warning"
      );
    } else if (peso === 0) {
      show_alerta("El peso es requerido", "warning");
    } else if (isNaN(peso) || peso < 30 || peso > 300) {
      show_alerta("El peso debe ser un número entre 30 y 300 kg", "warning");
    } else if (altura === 0) {
      show_alerta("La altura es requerida", "warning");
    } else if (isNaN(altura) || altura < 50 || altura > 250) {
      show_alerta("La altura debe ser un número entre 50 y 250 cm", "warning");
    } else if (selectedMembresia === "") {
      show_alerta("La membresia es requerida", "warning");
    } else {
      const formData = new FormData();
      formData.append("nombre", nombre.trim());
      formData.append("apellido", apellido.trim());
      formData.append("email", correo.trim());
      formData.append("cedula", cedula.trim());
      formData.append("username", username.trim());
      //formData.append("password", contrasenia.trim());
      formData.append("id_genero", parseInt(selectedGenero));
      formData.append("id_nivel_gym", parseInt(selectedNivelGym));
      formData.append("id_nivel_actividad", parseInt(selectedNivelActividad));
      formData.append("id_objetivo", parseInt(selectedObjetivo));
      formData.append("id_membresia", parseInt(selectedMembresia));
      formData.append("fecha_inicio", fechaInicio);
      formData.append("fecha_fin", fechaFin);
      formData.append("peso", peso);
      formData.append("altura", altura);
      formData.append("fecha_nacimiento", fechaNacimiento);
      formData.append("id_entrenador", idEntrenador);
      if (imageFile && imageFile instanceof File) {
        formData.append("imagen", imageFile); // Append the new file
      }

      // Log all formData values
      console.log("FormData values:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      /*parametros = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: correo.trim(),
        cedula: cedula.trim(),
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
        id_membresia: parseInt(selectedMembresia),
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      };*/
      //alert(JSON.stringify(parametros, null, 2));

      axios
        .put(urlEditar, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log("Respuesta del servidor", response.data);
          show_alerta("El cliente ha sido actualizado exitosamente", "success");
          setShowSecondModalEditar(false);
          getClients();
          setNombre("");
          setApellido("");
          setCorreo("");
          setCedula("");
          setUsername("");
          setContrasenia("");
          setSelectedGenero("");
          setSelectedNivelGym("");
          setSelectedNivelActividad("");
          setSelectedObjetivo("");
          setFechaNacimiento("");
          setPeso(0);
          setAltura(0);
          setStep(1);

          // Extract id_cliente from the response

          //const id_cliente = parseInt(response.data.cliente.id_cliente);

          //alert(id);

          // Now that id_cliente is available, make subsequent requests using this value
          const urlCalcularTMB = `${apiUrl}/calcularTMB/${id}/`;

          // Calculate TMB
          axios
            .post(urlCalcularTMB)
            .then(() => {
              /*show_alerta(
                "El TMB del cliente se actualizó exitosamente",
                "success"
              );*/
            })
            .catch((error) => {
              console.error("Error calculando TMB", error.response || error);
            });

          // Delay the calculation of macronutrients to ensure TMB is calculated first
          const urlCalcularMN = `${apiUrl}/calcularMacros/${id}/`;
          setTimeout(() => {
            axios
              .post(urlCalcularMN)
              .then(() => {
                /*show_alerta(
                  "Los macronutrientes del cliente se actualizaron exitosamente",
                  "success"
                );*/
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
          if (error.response && error.response.status === 400) {
            const errors = error.response.data;
            // Display specific backend validation errors
            if (errors.correo) {
              setShowModalEditar(true);
              setShowSecondModalEditar(false);
              setStep(1);
              show_alerta(errors.correo, "warning");
            }
            if (errors.username) {
              setShowModalEditar(true);
              setShowSecondModalEditar(false);
              setStep(1);
              show_alerta(errors.username, "warning");
            }
            if (errors.cedula) {
              setShowModalEditar(true);
              setShowSecondModalEditar(false);
              setStep(1);
              show_alerta(errors.cedula, "warning");
            }
          }
        });
    }
  };

  const handleMostrarBorrado = (id_cliente) => {
    setId(id_cliente);
    setShowModalEliminar(true);
  };

  const handleBorradoLogico = () => {
    const urlBorrado = `${apiUrl}/borradoLogicoCliente/${id}/`;
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
    const urlRecuperar = `${apiUrl}/recuperarCliente/${id_cliente}/`;
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

  const handleShowSecondModal = () => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexSoloLetras = /^[A-Za-zñÑ\s]+$/; // Only letters and spaces
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
    } else if (cedula === "") {
      show_alerta("La cedula es requerida", "warning");
      return;
    } else if (!validarCedulaEcuatoriana(cedula.trim())) {
      show_alerta("La cédula no es valida", "warning");
      return;
    } else if (!regexCorreo.test(correo)) {
      show_alerta("El correo no es válido", "warning");
      return;
    } else if (username.trim() === "") {
      show_alerta("El nombre de usuario es requerido", "warning");
      return;
    } else if (contrasenia.trim() === "") {
      show_alerta("La contraseña es requerida", "warning");
      return;
    } else {
      setShowModalAgregar(false);
      setStep(2);
      setShowSecondModalAgregar(true);
    }
  };

  const handleCloseFirstAddModal = () => {
    setShowModalAgregar(false);
    setNombre("");
    setApellido("");
    setCorreo("");
    setCedula("");
    setUsername("");
    setContrasenia("");
    setSelectedGenero("");
    setSelectedNivelGym("");
    setSelectedNivelActividad("");
    setSelectedObjetivo("");
    setFechaNacimiento("");
    setPeso(0);
    setAltura(0);
    setStep(1);
    setImageFile("");
  };

  const handleCloseSecondAddModal = () => {
    setShowSecondModalAgregar(false);
    setNombre("");
    setApellido("");
    setCorreo("");
    setCedula("");
    setUsername("");
    setContrasenia("");
    setSelectedGenero("");
    setSelectedNivelGym("");
    setSelectedNivelActividad("");
    setSelectedObjetivo("");
    setFechaNacimiento("");
    setPeso(0);
    setAltura(0);
    setStep(1);
    setImageFile("");
  };

  const handleNextFirstModalUpdate = () => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexSoloLetras = /^[A-Za-zñÑ\s]+$/; // Only letters and spaces
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
    } else if (cedula === "") {
      show_alerta("La cedula es requerida", "warning");
      return;
    } else if (!validarCedulaEcuatoriana(cedula.trim())) {
      show_alerta("La cédula no es valida", "warning");
      return;
    } else if (!regexCorreo.test(correo)) {
      show_alerta("El correo no es válido", "warning");
      return;
    } else if (username.trim() === "") {
      show_alerta("El nombre de usuario es requerido", "warning");
      return;
    } else if (contrasenia.trim() === "") {
      show_alerta("La contraseña es requerida", "warning");
      return;
    } else if (fechaInicio > fechaFin) {
      show_alerta(
        "La fecha de inscripción de la membresia debe ser menor a la fecha de fin",
        "warning"
      );
    } else {
      setShowModalEditar(false);
      setStep(2);
      setShowSecondModalEditar(true);
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idEntrenador");
    navigate("/loginEntrenador/");
  };

  const handleCloseFirstModalEditar = () => {
    setShowModalEditar(false);
    setNombre("");
    setApellido("");
    setCorreo("");
    setCedula("");
    setUsername("");
    setContrasenia("");
    setSelectedGenero("");
    setSelectedNivelGym("");
    setSelectedNivelActividad("");
    setSelectedObjetivo("");
    setFechaNacimiento("");
    setImageFile("");
    setPeso(0);
    setAltura(0);
    setStep(1);
  };

  const handleCloseSecondModalEditar = () => {
    setShowSecondModalEditar(false);
    setNombre("");
    setApellido("");
    setCorreo("");
    setCedula("");
    setUsername("");
    setContrasenia("");
    setSelectedGenero("");
    setSelectedNivelGym("");
    setSelectedNivelActividad("");
    setSelectedObjetivo("");
    setFechaNacimiento("");
    setPeso(0);
    setAltura(0);
    setStep(1);
  };

  const handleVolverEditar = () => {
    setStep(1);
    setShowSecondModalEditar(false);
    setShowModalEditar(true);
  };

  const handleVolverInsertar = () => {
    setStep(1);
    setShowSecondModalAgregar(false);
    setShowModalAgregar(true);
  };

  return (
    <>
      {/*1.- Envia la función handleSearchResults al componente NavScrollExample como un prop*/}
      <NavScrollExample
        onSearchResults={handleSearchResults}
        onLogout={handleCerrarSesion}
      />{" "}
      {/* Sidebar with toggle */}
      <Sidebar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
      <Container className="mt-5">
        <Row>
          <Col md={{ span: 12, offset: 1 }} className="mb-5">
            <div className={`main-content ${isSideBarOpen ? "shrinked" : ""}`}>
              <div className="panel-heading">
                <Row className="d-flex align-items-center mb-3">
                  {/*<Col xs={6}>
                    <h3 className="mb-0 lista-entrenadores">
                      Lista de Clientes
                    </h3>
                  </Col>*/}
                  {/*Buttons*/}
                  <Col xs="auto" md={{ span: 8, md: 4 }}>
                    <Button
                      variant="primary"
                      className="btn-agregar me-2 mb-2 btn-responsive"
                      onClick={() => setShowModalAgregar(true)}
                    >
                      <FontAwesomeIcon icon={faPlus} /> <span>Agregar</span>
                    </Button>
                    <Button
                      variant="secondary"
                      className="btn-recuperar me-2 mb-2 btn-responsive"
                      onClick={() =>
                        setShowModalClientesBorrados(
                          !showClientesBorrados //Es lo mismo que enviarle como true, ya que "showModalEntrenadoresBorrados" está inicializado como false
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faUndo} />
                      {/*showBorrados ? "Ocultar" : "Mostrar"*/}{" "}
                      <span>Recuperar</span>
                    </Button>
                  </Col>
                </Row>
              </div>
              <div className="table-container">
                <Table className="main-table">
                  <thead>
                    <tr>
                      <th>Numero</th>
                      <th>Nombre del cliente</th>
                      <th>Correo</th>
                      <th>Nivel</th>
                      <th>Nivel actividad</th>
                      <th>Objetivo</th>
                      <th>Peso (kg)</th>
                      <th>Altura (cm)</th>
                      <th>Fecha de nacimiento</th>
                      <th>Acciones</th>

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
                          <td>{client.id_cliente}</td>
                          <td style={{ width: "100%" }}>
                            {client.imagen && (
                              <img
                                src={
                                  client.imagen !== null ||
                                  client.imagen.length > 0
                                    ? client.imagen
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
                            {client.nombre + " " + client.apellido}
                          </td>
                          <td>{client.email}</td>
                          <td>{client.nivel_gym.nombre}</td>
                          <td>{client.nivel_actividad.nombre}</td>
                          <td>{client.objetivo.nombre}</td>
                          <td>{client.peso}</td>
                          <td>{client.altura}</td>
                          <td>{client.fecha_nacimiento}</td>
                          <td className="d-flex ">
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
                              onClick={() =>
                                handleMostrarBorrado(client.id_cliente)
                              }
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {/*Tarjetas agregar entrenadores*/}
      <div className="card-container">
        {clients
          .filter(
            (client) =>
              client.borrado === false &&
              parseInt(client.id_entrenador) === parseInt(idEntrenador)
          )
          .map((client) => (
            <div key={client.id_cliente} className="trainer-card">
              <div
                className="trainer-card-item w-100 justify-content-center"
                data-label="Número de cliente"
              >
                {": " + client.id_cliente}
              </div>
              <div className="trainer-card-item w-100 text-center justify-content-center">
                {client.imagen && (
                  <img
                    src={
                      client.imagen !== null || client.imagen.length > 0
                        ? client.imagen
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
                {client.nombre + " " + client.apellido}
              </div>
              <div className="trainer-card-item" data-label="Email">
                {client.email}
              </div>
              <div className="trainer-card-item" data-label="Género">
                {client.genero.nombre}
              </div>
              <div className="trainer-card-item" data-label="Nivel">
                {client.nivel_gym.nombre}
              </div>
              <div className="trainer-card-item" data-label="Nivel actividad">
                {client.nivel_actividad.nombre}
              </div>
              <div className="trainer-card-item" data-label="Objetivo">
                {client.objetivo.nombre}
              </div>
              <div className="trainer-card-item" data-label="Peso">
                {client.peso}
              </div>
              <div className="trainer-card-item" data-label="Altura">
                {client.altura}
              </div>
              <div
                className="trainer-card-item"
                data-label="Fecha de nacimiento"
              >
                {client.fecha_nacimiento}
              </div>
              <div className="action-buttons w-100 text-center justify-content-center">
                <Button
                  variant="primary"
                  className="edit-btn me-2"
                  onClick={() => handleLlenarCamposCliente(client.id_cliente)}
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </Button>
                <Button
                  variant="danger"
                  //className="delete-btn"
                  onClick={() => handleMostrarBorrado(client.id_cliente)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </div>
            </div>
          ))}
      </div>
      {/* Modal agregar cliente 1 parte */}
      <Modal
        show={showModalAgregar}
        onHide={() => handleCloseFirstAddModal()}
        centered
      >
        <ModalHeader closeButton>
          <Modal.Title className="w-100 text-center">
            Agregar Cliente
          </Modal.Title>
        </ModalHeader>
        <div>
          <div className="active"></div>
          <div className="numbers">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
          </div>
        </div>
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
                className="form-control"
                name="cedula"
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Nombres:</Form.Label>
              <Form.Control
                className="form-control"
                name="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Apellidos:</Form.Label>
              <Form.Control
                className="form-control"
                name="apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Correo:</Form.Label>
              <Form.Control
                className="form-control"
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
                className="form-control"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Contraseña:</Form.Label>
              <Form.Control
                className="form-control"
                name="contrasenia"
                type="password"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label className="form-label-custom">Membresia:</Form.Label>
              <select
                className="form-control"
                value={selectedMembresia}
                onChange={(e) => setSelectedMembresia(e.target.value)}
              >
                <option value="">Seleccione la membresia</option>

                {membresias.map((membresia) => (
                  <option
                    key={membresia.id_membresia}
                    value={membresia.id_membresia}
                  >
                    {membresia.duracion}
                  </option>
                ))}
              </select>
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">
                Fecha de inscripción:
              </Form.Label>
              <Form.Control
                className="form-control"
                name="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Fecha fin:</Form.Label>
              <Form.Control
                className="form-control"
                name="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter className="modal-footer-custom justify-content-center">
          <Button
            onClick={() => handleShowSecondModal()}
            className="modal-button"
            variant="primary"
          >
            Siguiente
          </Button>
        </ModalFooter>
      </Modal>
      {/* Modal agregar cliente 2 parte */}
      <Modal
        show={showSecondModalAgregar}
        onHide={() => handleCloseSecondAddModal()}
      >
        <ModalHeader closeButton>
          <Modal.Title className="w-100 text-center">
            Agregar Cliente
          </Modal.Title>
        </ModalHeader>
        <div>
          <div className="active"></div>
          <div className="numbers">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
          </div>
        </div>
        <ModalBody>
          <div className="form-container">
            <FormGroup>
              <Form.Label className="form-label-custom">Género:</Form.Label>
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
              <Form.Label className="form-label-custom">
                Nivel de Gimnasio:
              </Form.Label>
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
              <Form.Label className="form-label-custom">
                Nivel de Actividad:
              </Form.Label>
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
              <Form.Label className="form-label-custom">Objetivo</Form.Label>
              <select
                className="form-control"
                value={selectedObjetivo}
                onChange={(e) => setSelectedObjetivo(e.target.value)}
              >
                <option value="">Seleccione un objetivo</option>

                {objetivos.map((objetivo) => (
                  <option
                    key={objetivo.id_objetivo}
                    value={objetivo.id_objetivo}
                  >
                    {objetivo.nombre}
                  </option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <Form.Label className="form-label-custom">
                Fecha de nacimiento:
              </Form.Label>
              <input
                className="form-control"
                name="fechaNacimiento"
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label className="form-label-custom">Peso (kg):</Form.Label>
              <input
                className="form-control"
                name="peso"
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label className="form-label-custom" l>
                Altura (cm):
              </Form.Label>
              <input
                className="form-control"
                name="peso"
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
              />
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter className="modal-footer-custom justify-content-center">
          <Button
            //variant="Primary"
            onClick={() => handleVolverInsertar()}
            className="modal-button"
          >
            Volver
          </Button>
          <Button
            //variant="Success"
            onClick={() => handleAgregarCliente()}
            className="modal-button"
          >
            Agregar
          </Button>
        </ModalFooter>
      </Modal>
      {/* Modal editar entrenador 1 parte */}
      <Modal
        show={showModalEditar}
        onHide={() => handleCloseFirstModalEditar()}
      >
        <ModalHeader closeButton>
          <Modal.Title className="w-100 text-center">
            Editar Cliente
          </Modal.Title>
        </ModalHeader>
        <div>
          <div className="active"></div>
          <div className="numbers">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
          </div>
        </div>
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
              <Form.Label className="form-label-custom">Nombres:</Form.Label>
              <Form.Control
                className="form-control"
                name="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Apellidos:</Form.Label>
              <Form.Control
                className="form-control"
                name="apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Correo:</Form.Label>
              <Form.Control
                className="form-control"
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
                className="form-control"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Form.Label className="form-label-custom">Membresia:</Form.Label>
              <select
                className="form-control"
                value={selectedMembresia}
                onChange={(e) => setSelectedMembresia(e.target.value)}
              >
                <option value="">Seleccione la membresia</option>

                {membresias.map((membresia) => (
                  <option
                    key={membresia.id_membresia}
                    value={membresia.id_membresia}
                  >
                    {membresia.duracion}
                  </option>
                ))}
              </select>
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">
                Fecha de inscripción:
              </Form.Label>
              <Form.Control
                className="form-control"
                name="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Fecha fin:</Form.Label>
              <Form.Control
                className="form-control"
                name="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter className="modal-footer-custom justify-content-center">
          <Button
            variant="primary"
            className="modal-button"
            onClick={() => handleNextFirstModalUpdate()}
          >
            Siguiente
          </Button>
        </ModalFooter>
      </Modal>
      {/*Modal editar entrenador 2 parte */}
      <Modal
        show={showSecondModalEditar}
        onHide={() => handleCloseSecondModalEditar()}
      >
        <ModalHeader closeButton>
          <Modal.Title className="w-100 text-center">
            Editar Cliente
          </Modal.Title>
        </ModalHeader>
        <div>
          <div className="active"></div>
          <div className="numbers">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
          </div>
        </div>
        <ModalBody>
          <div className="form-container">
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Género:</Form.Label>
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
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">
                Nivel de gimnasio:
              </Form.Label>
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
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">
                Nivel de actividad:
              </Form.Label>
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
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Objetivo:</Form.Label>
              <select
                className="form-control"
                value={selectedObjetivo}
                onChange={(e) => setSelectedObjetivo(e.target.value)}
              >
                <option value="">Seleccione un objetivo</option>
                {objetivos.map((objetivo) => (
                  <option
                    key={objetivo.id_objetivo}
                    value={objetivo.id_objetivo}
                  >
                    {objetivo.nombre}
                  </option>
                ))}
              </select>
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">Peso (kg):</Form.Label>
              <Form.Control
                className="form-control"
                name="peso"
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">
                Altura (cm):
              </Form.Label>
              <Form.Control
                className="form-control"
                name="altura"
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Label className="form-label-custom">
                Fecha de nacimiento:
              </Form.Label>
              <Form.Control
                className="form-control"
                name="fechaNacimiento"
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter className="modal-footer-custom justify-content-center">
          <Button
            variant="primary"
            className="modal-button"
            onClick={() => handleVolverEditar()}
          >
            Volver
          </Button>
          <Button
            variant="success"
            className="modal-button"
            onClick={() => handleEditarCliente()}
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
      {/* Modal desktop mostrar entrenadores borrados */}
      <Modal
        show={showClientesBorrados}
        onHide={() => setShowModalClientesBorrados(false)}
        size="xl"
      >
        <ModalHeader closeButton>
          <Modal.Title className="w-100 text-center">
            Clientes borrados
          </Modal.Title>
        </ModalHeader>

        <ModalBody className="table-responsive">
          <div>
            <Table>
              <thead>
                <tr>
                  <th>Numero</th>
                  <th>Nombre del cliente</th>
                  <th>Correo</th>
                  {/*<th>Genero</th>*/}
                  <th>Nivel</th>
                  <th>Nivel actividad</th>
                  <th>Objetivo</th>
                  <th>Peso (kg)</th>
                  <th>Altura (cm)</th>
                  <th>Fecha de nacimiento</th>
                  <th>Acciones</th>
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
                      <td>{client.id_cliente}</td>
                      <td style={{ width: "100%" }}>
                        {client.imagen && (
                          <img
                            src={
                              client.imagen !== null || client.imagen.length > 0
                                ? client.imagen
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
                        {client.nombre + " " + client.apellido}
                      </td>
                      <td>{client.email}</td>
                      {/*<td>{client.genero.nombre}</td>*/}
                      <td>{client.nivel_gym.nombre}</td>
                      <td>{client.nivel_actividad.nombre}</td>
                      <td>{client.objetivo.nombre}</td>
                      <td>{client.peso}</td>
                      <td>{client.altura}</td>
                      <td>{client.fecha_nacimiento}</td>
                      <td>
                        <Button
                          variant="info"
                          className="edit-btn me-2"
                          onClick={() =>
                            handleRecuperarCliente(client.id_cliente)
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

          {/*Modal mobile mostrar entrenadores borrados*/}

          <div className="card-container">
            {clients
              .filter(
                (client) =>
                  client.borrado === true &&
                  parseInt(client.id_entrenador) === parseInt(idEntrenador)
              )
              .map((client) => (
                <div key={client.id_cliente}>
                  <div
                    className="trainer-card-item w-100 justify-content-center"
                    data-label="Número de cliente"
                  >
                    {": " + client.id_cliente}
                  </div>

                  <div className="trainer-card-item w-100 text-center justify-content-center">
                    {client.imagen && (
                      <img
                        src={
                          client.imagen !== null || client.imagen.length > 0
                            ? client.imagen
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
                  <div className="trainer-card-item" data-label="Email">
                    {client.email}
                  </div>
                  <div className="trainer-card-item" data-label="Género">
                    {client.genero.nombre}
                  </div>
                  <div className="trainer-card-item" data-label="Nivel">
                    {client.nivel_gym.nombre}
                  </div>
                  <div
                    className="trainer-card-item"
                    data-label="Nivel actividad"
                  >
                    {client.nivel_actividad.nombre}
                  </div>
                  <div className="trainer-card-item" data-label="Objetivo">
                    {client.objetivo.nombre}
                  </div>
                  <div className="trainer-card-item" data-label="Peso">
                    {client.peso}
                  </div>
                  <div className="trainer-card-item" data-label="Altura">
                    {client.altura}
                  </div>
                  <div
                    className="trainer-card-item"
                    data-label="Fecha de nacimiento"
                  >
                    {client.fecha_nacimiento}
                  </div>
                  <div className="action-buttons w-100 text-center justify-content-center">
                    <Button
                      variant="info"
                      className="edit-btn me-2"
                      onClick={() => handleRecuperarCliente(client.id_cliente)}
                    >
                      <FontAwesomeIcon icon={faUndo} />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </ModalBody>
      </Modal>
      {/* Modal móvil mostrar entrenadores borrados */}
    </>
  );
};

export default CrudClients;
