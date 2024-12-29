import React, { useState, useEffect } from "react";
import axios from "axios";
import NavScrollExample from "../Otros/NavBarCliente";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toZonedTime } from "date-fns-tz";
import {
  faPencilAlt,
  faTrashAlt,
  faPlus,
  faEyeSlash,
  faUndo,
  faDeleteLeft,
  faWifiStrong,
  faDumbbell,
  faNotesMedical,
  faNoteSticky,
  faClock,
  faBook,
  faPencil,
  faEye,
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
  Table,
} from "react-bootstrap";
import { show_alerta } from "../../functions";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Otros/sideBarSeguimiento";
import "../Entrenador/routines.css";
import { FaDumbbell } from "react-icons/fa";
import WeekdayCards from "./dashboardWeekDays";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  faCoffee,
  faUtensils,
  faDrumstickBite,
  faChartPie,
  faPlusCircle,
  faBreadSlice,
  faBacon,
  faEgg,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

//import "../Otros/form.css";
//import "./ModalDesign.css";

const HistorialClienteCompleto = () => {
  const navigate = useNavigate();
  const [idCliente, setIdCliente] = useState(localStorage.getItem("idCliente"));
  const [dateRange, setDateRange] = useState("hoy");
  const url = "http://127.0.0.1:8000/api/v1/rutina/";
  const urlEjercicios = "http://127.0.0.1:8000/api/v1/ejercicio/";
  const urlRutinaCliente = "http://localhost:8000/clienteRutinas/";
  const urlRutinaClienteCompleto = `http://localhost:8000/getHistorialCompletoFechas/${idCliente}/?range=${dateRange}`;
  const [routines, setRoutines] = useState([]);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 7));

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
  //Días de la semana
  //Dias de la semana
  const [showWeekDays, setShowWeekDays] = useState(true);
  const [selectDay, setSelectedDay] = useState(null);

  const [showModalFullRoutine, setShowModalFullRoutine] = useState(false);
  const [showModalFullProgreso, setShowModalFullProgreso] = useState(false);
  const [rutinaCompletaCliente, setRutinaCompletaCliente] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [ejerciciosIds, setEjerciciosIds] = useState([]);
  const [nombresEjercicios, setNombresEjercicios] = useState([]);
  const [sets, setSets] = useState([{ reps: "", weight: "" }]); // Initial set
  const [initialSets, setInitialSets] = useState({});
  // Historial
  const [showModalHistorial, setShowModalHistorial] = useState(false);
  const [progresos, setProgresos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [showModalHistorialEditar, setShowModalHistorialEditar] =
    useState(false);
  const [historial, setHistorial] = useState([]);

  const getCurrentDate = () => new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(getCurrentMonday());

  useEffect(() => {
    getRoutines();
    console.log("Updated dateRange:", dateRange);
  }, [dateRange]);

  useEffect(() => {
    filterEjercicios();
  }, [searchTerm, bodyPart, ejercicios]);

  const getRoutines = async () => {
    try {
      const params = {
        id_cliente: idCliente,
        range: dateRange.range,
      };

      params.start_date = dateRange.start_date;
      params.end_date = dateRange.end_date;

      axios.get(urlRutinaClienteCompleto, { params }).then((response) => {
        setHistorial(response.data.historial);
      });
    } catch (error) {
      console.error("Error fetching routines:", error);
      show_alerta("Error al cargar las rutinas", "error");
    }
  };

  const getEjercicios = async () => {
    const respuesta = await axios.get(urlEjercicios);
    setEjercicios(respuesta.data);
    setFilteredEjercicios(respuesta.data);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idCliente");
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

  const handleShowWeekDays = (id_cliente) => {
    setIdCliente(id_cliente);
    setShowWeekDays(true);
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
        "Los ejercicios no están asociados con el enfoque de la rutina",
        "warning"
      );
      return;
    }

    const nuevaRutina = {
      nombre: nombreRutina,
      descripcion: descripcionRutina,
      enfoque: enfoqueRutina,
      ejercicios: selectedEjercicios.map((ejercicio) => ejercicio.id_ejercicio),
      id_entrenador: idCliente,
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

  const handleSearchResults = (results) => {
    //4.-Actualiza los clientes con los resultados de las busquedas
    setRoutines(results);
  };

  const handleShowModalEliminar = (id_rutina) => {
    setIdRutina(id_rutina);
    setShowModalEliminar(true);
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

  const handleLlenarCamposRutina = async (id_rutina) => {
    const urlObtenerEjercicios = `http://127.0.0.1:8000/ejerciciosRutina/${id_rutina}/`;
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

  const handleLlenarCamposRutinaEjercicio = (id_rutina, value) => {
    setIdRutina(id_rutina);
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
        console.log("Los sets son:" + JSON.stringify(response.data, null, 2));
        setRutinaCompletaCliente(response.data.asignas);
        setImagenes(response.data.imagenes);
        setEjerciciosIds(response.data.ejerciciosIds);
        setNombresEjercicios(response.data.nombresEjercicios);
        if (value === 1) {
          setShowModalFullRoutine(true);
        }
        const setsData = response.data.sets || {};
        setSets(setsData);
        //alert(JSON.stringify(setsData, null, 2));
        setInitialSets(setsData);
        console.log(
          JSON.stringify("Los sets son:" + response.data.sets, null, 2)
        );
      });
  };

  const handleLlenarCamposRutinaProgreso = (id_rutina, fecha, dia) => {
    setIdRutina(id_rutina);
    setSelectedDay(dia);
    console.log("El id del cliente es: " + idCliente);
    console.log("El id de la rutina es: " + id_rutina);
    console.log("Pertenece al dia: " + selectDay);

    const url = "http://127.0.0.1:8000/obtenerRutinaProgresoDetalleCompleto/";
    axios
      .get(url, {
        params: {
          id_cliente: idCliente,
          dia: dia,
          id_rutina: id_rutina,
          fecha: fecha,
        },
      })
      .then((response) => {
        console.log("Los sets son:" + JSON.stringify(response.data, null, 2));
        setRutinaCompletaCliente(response.data.asignas);
        setImagenes(response.data.imagenes);
        setEjerciciosIds(response.data.ejerciciosIds);
        setNombresEjercicios(response.data.nombresEjercicios);
        setShowModalFullProgreso(true);
        const setsData = response.data.sets || {};
        setSets(setsData);
        //alert(JSON.stringify(setsData, null, 2));
        setInitialSets(setsData);
        console.log(
          JSON.stringify("Los sets son:" + response.data.sets, null, 2)
        );
      });
  };

  const handleCloseModalAsignarRuitina = () => {
    //setShowModalAssignRoutine(false);
    setSets([{ reps: "", weight: "" }]);
    setShowModalFullRoutine(false);
  };

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    axios
      .get(urlRutinaCliente, {
        params: {
          id_cliente: idCliente,
          dia: day,
        },
      })
      .then((response) => {
        setRoutines(response.data.rutinas);
        setShowWeekDays(false);
      });
  };

  const handleSetChangeUpdate = (idEjercicio, setIndex, field, value) => {
    // Strip leading zeros by converting to a number and back to a string
    const numericValue = value === "" ? 0 : parseInt(value, 10);
    if (isNaN(numericValue)) return; // Skip if the value is not a valid number

    // Update `sets` state
    setSets((prevSets) => {
      const updatedSets = { ...prevSets }; // Clone the previous state

      if (updatedSets[idEjercicio]) {
        // If the exercise exists in the state
        updatedSets[idEjercicio] = updatedSets[idEjercicio].map(
          (set, index) => {
            if (index === setIndex) {
              // If the current index matches the set we want to update
              return { ...set, [field]: numericValue }; // Update the specific field (e.g., peso or repeticiones)
            }
            return set; // Leave other sets unchanged
          }
        );
      }
      //alert(JSON.stringify(updatedSets), null, 2);
      return updatedSets; // Return the updated state
    });

    // Update `rutinaCompletaCliente` state

    setRutinaCompletaCliente((prevRutinas) =>
      prevRutinas.map((routine) => {
        if (
          routine.id_ejercicio === idEjercicio &&
          routine.serie === setIndex + 1
        ) {
          // Update the matching routine
          //alert(JSON.stringify(routine), null, 2);
          return { ...routine, [field]: numericValue }; // Update the specific field
        }

        return routine; // Leave other routines unchanged
      })
    );
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
          peso: set.peso,
          repeticiones: set.repeticiones,
        });
      });
    });
    return data;
  };

  const handleAgregarProgreso = () => {
    const datos = prepararDatos();
    //alert(JSON.stringify(datos, null, 2));
    const urlAsignarProgreso = "http://127.0.0.1:8000/agregarProgreso/";
    axios.post(urlAsignarProgreso, datos).then((response) => {
      show_alerta("Rutina finalizada exitosamente", "success");
      setShowModalFullProgreso(false);
      //setShowModalAssignRoutine(false);
    });
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

  const handleVerHistorial = (id_rutina) => {
    setIdRutina(id_rutina);
    const urlHistorial = "http://127.0.0.1:8000/historialCliente/";
    axios
      .get(urlHistorial, {
        params: {
          id_rutina: id_rutina,
          id_cliente: idCliente,
          day: selectDay,
        },
      })
      .then((response) => {
        //Get detalles rutina
        if (response.data.historial) {
          setHistorial(response.data.historial);
          setShowModalHistorial(true);
          /*const allRutinas = response.data.historial.flatMap(
            (item) => item.rutinas
          );

          alert(JSON.stringify(response.data.fecha, null, 2));
          setDetalles(allRutinas);
          //Get progresos
          const allProgresos = allRutinas.flatMap((rutina) => rutina.progreso);
          setProgresos(allProgresos);
          //Alerts
          */
        } else {
          show_alerta("No hay historial disponible", "warning");
        }

        //Get progreso
      });
  };

  const handleSearch = async () => {
    //alert(selectDay);
    try {
      //alert(fecha);
      const response = await axios.get(
        "http://127.0.0.1:8000/historialCliente/",
        {
          params: {
            id_cliente: idCliente,
            id_rutina: idRutina,
            mes: fecha,
            day: selectDay,
          },
        }
      );
      console.log("Response from backend:", response.data); // Logs the backend response
      setHistorial(response.data.historial || []);
    } catch (error) {
      show_alerta("Error al cargar el historial", "error");
      setHistorial([]);
    }
  };

  const handleHistorialDate = (utcDate) => {
    try {
      const parsedDate = parseISO(utcDate); // Convert "2024-12-01" to a Date object
      const ecuadorTimeZone = "America/Guayaquil";
      const zonedDate = toZonedTime(parsedDate, ecuadorTimeZone); // Adjust to Ecuador timezone
      return format(zonedDate, "dd 'de' MMMM 'de' yyyy", { locale: es }); // Format with Spanish locale
    } catch (error) {
      console.error("Error processing date:", error);
      return "Fecha inválida";
    }
  };

  function getCurrentMonday() {
    const today = new Date(); // Wed Nov 22 2024
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const monday = new Date(today); //Creates a copy of the today date
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); //today.getDate() gives the day of the month (e.g., 22 for 2024-11-22).
    return monday;
  }

  //Adjust the start date by +/- 7 days, always start from Monday
  const adjustWeek = (direction) => {
    const newMonday = new Date(startDate); // Clone the current startDate
    newMonday.setDate(newMonday.getDate() + direction * 7); //Tue Nov 12 2024 GMT-0500 (Ecuador Time)

    const newSunday = new Date(newMonday);
    newSunday.setDate(newMonday.getDate() + 6); // Add 6 days to get Sunday

    setStartDate(newMonday);

    // Send custom date range to the backend
    //.toIsoString()  -> method converts a JavaScript Date object into a string which looks like this ->  Output: "2024-11-26T15:30:00.000Z"
    //.split("T")  -> splits the ISO string into two parts ->  Output: ["2024-11-26", "15:30:00.000Z"]
    //[0] -> Access the first part of the split array, which contains only the date portion (YYYY-MM-DD) -> Output: "2024-11-26"
    const formattedStart = formatLocalDate(newMonday); //2024-11-18
    const formattedEnd = formatLocalDate(newSunday); //2024-11-24
    //alert(formattedStart + " " + formattedEnd);
    setDateRange(
      `custom&start_date=${formattedStart}&end_date=${formattedEnd}`
    );
  };

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Return "YYYY-MM-DD"
  };

  // Format the week range (e.g., "18 Nov 24 - 24 Nov 24")
  const formatWeekRange = () => {
    const sunday = new Date(startDate); //Sunday is the last day of the week
    sunday.setDate(startDate.getDate() + 6);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return `${startDate.toLocaleDateString("es-ES", options)} -
      ${sunday.toLocaleDateString("es-ES", options)}`;
  };

  const getDropDownLabel = () => {
    const today = formatLocalDate(new Date()); // "2024-11-26"
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = formatLocalDate(yesterday);

    if (dateRange.includes(`start_date=${today}&end_date=${today}`))
      return "Hoy";
    if (
      dateRange.includes(
        `custom&start_date=${formattedYesterday}&end_date=${formattedYesterday}`
      )
    )
      return "Ayer";
    if (dateRange === "esta semana") return "Esta semana";
    if (dateRange === "semana pasada") return "Semana pasada";
    if (dateRange.startsWith("custom")) return formatWeekRange();
    return "Hoy";
  };

  const handleDateRangeChange = (range) => {
    const today = new Date();
    switch (range) {
      case "hoy":
        setStartDate(today);
        setDateRange(
          `custom&start_date=${formatLocalDate(
            today
          )}&end_date=${formatLocalDate(today)}`
        );
        break;
      case "ayer":
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setStartDate(yesterday);
        setDateRange(
          `custom&start_date=${formatLocalDate(
            yesterday
          )}&end_date=${formatLocalDate(yesterday)}`
        );
        break;
      case "esta semana":
        const thisMonday = getCurrentMonday();
        setStartDate(thisMonday);
        setDateRange(
          `custom&start_date=${formatLocalDate(
            thisMonday
          )}&end_date=${formatLocalDate(
            new Date(thisMonday.getTime() + 6 * 24 * 60 * 60 * 1000) // Add 6 days for Sunday
          )}`
        );
        break;

      case "semana pasada":
        const lastMonday = getCurrentMonday();
        lastMonday.setDate(lastMonday.getDate() - 7); //With this I get the date for example 25
        setStartDate(lastMonday);
        setDateRange(
          `custom&start_date=${formatLocalDate(
            lastMonday
          )}&end_date=${formatLocalDate(
            new Date(lastMonday.getTime() + 6 * 24 * 60 * 60 * 1000) // Add 6 days for Sunday
          )}`
        );
        break;

      default:
        setDateRange(range);
    }
  };

  return (
    <div>
      <NavScrollExample
        onSearchResults={handleSearchResults}
        onLogout={handleCerrarSesion}
        showWeekDays={showWeekDays}
      />
      <Container>
        <Row>
          <Col md={2} className="d-none d-md-block">
            {" "}
            <Sidebar isOpen={isOpen} toggleSideBar={handleOpenSideBar} />
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
                    className="btn-agregar me-2 mb-5 btn-responsive"
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

            <div className="main-content">
              <Row>
                <h3 className="w-100 text-center">Rutinas de toda la semana</h3>
                {/* Navigation */}
                <Row className="mb-4 justify-content-center">
                  <Col xs="auto">
                    <div className="date-navigation ">
                      <Button
                        variant="outline-primary"
                        onClick={() => adjustWeek(-1)}
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </Button>

                      <Col xs="auto" className="text-center">
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="primary"
                            id="dropdown-basic"
                          >
                            {getDropDownLabel()}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => handleDateRangeChange("hoy")}
                            >
                              Hoy
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleDateRangeChange("ayer")}
                            >
                              Ayer
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleDateRangeChange("esta semana")
                              }
                            >
                              Esta semana
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleDateRangeChange("semana pasada")
                              }
                            >
                              Semana pasada
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                      <Col xs="auto">
                        <Button
                          variant="outline-primary"
                          onClick={() => adjustWeek(1)}
                        >
                          <FontAwesomeIcon icon={faChevronRight} />
                        </Button>
                      </Col>
                    </div>
                  </Col>
                </Row>
                <Row>
                  {historial && historial.length > 0 ? (
                    historial.map((entry, index) => (
                      <React.Fragment key={index}>
                        {/* Date Header */}
                        <Col xs={12} className="mb-3">
                          {" "}
                          <h5 className="text-center text-primary">
                            {entry.fecha
                              ? handleHistorialDate(entry.fecha)
                              : "Fecha no disponible"}
                          </h5>
                        </Col>
                        {/* Cards for Routines */}
                        <Row className="g-2 justify-content-center">
                          {" "}
                          {entry.rutinas.map((rutina) => {
                            const dia =
                              rutina.progreso[0]?.dia || "No disponible";

                            return (
                              <Col
                                xs={12}
                                sm={6}
                                md={4}
                                lg={5}
                                key={rutina.id_rutina}
                              >
                                {" "}
                                <Card
                                  className="asignar-rutina-modal h-100"
                                  key={rutina.id_rutina}
                                >
                                  <Card.Body>
                                    <Card.Title className="text-center">
                                      <strong>{rutina.nombre}</strong>
                                    </Card.Title>

                                    {/*<Card.Text className="w-100 text-center">
                          {entry.fecha}
                        </Card.Text>*/}
                                    <Card.Text>
                                      {rutina.descripcion || "Sin descripción"}
                                    </Card.Text>
                                    <Card.Text>
                                      <strong>Enfoque:</strong> {rutina.enfoque}
                                    </Card.Text>
                                    <Table
                                      responsive
                                      bordered
                                      className="table text-center"
                                    >
                                      <thead>
                                        <tr>
                                          <th>Ejercicio</th>
                                          <th>Promedio</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {rutina.progreso.map((ejercicio) => (
                                          <tr key={ejercicio.id_ejercicio}>
                                            <td>
                                              {ejercicio.max_serie} x{" "}
                                              {ejercicio.nombre}
                                            </td>
                                            <td>
                                              {ejercicio.avg_peso}kg x{" "}
                                              {ejercicio.avg_repeticiones}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </Card.Body>
                                  <Card.Footer>
                                    <div className="w-100 text-center">
                                      {" "}
                                      <Button
                                        variant="primary"
                                        className="me-2"
                                        onClick={() =>
                                          handleLlenarCamposRutinaProgreso(
                                            rutina.id_rutina,
                                            entry.fecha,
                                            dia
                                          )
                                        }
                                      >
                                        <FontAwesomeIcon
                                          icon={faEye}
                                          className="icon"
                                        />
                                      </Button>
                                      {/*Ver historial*/}
                                    </div>
                                  </Card.Footer>
                                </Card>
                              </Col>
                            );
                          })}
                        </Row>
                        {/*Spacing Between Date groups*/}
                        {index !== historial.length - 1 && (
                          <hr className="my-4" />
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <p>No hay historial para mostrar</p>
                  )}
                </Row>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Mostrar tarjetas días de la semana*/}

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
                <option value="Espalda">Espalda</option>
                <option value="Pecho">Pecho</option>
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
        onHide={() => setShowModalEjercicios(false)}
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
              <Dropdown.Item eventKey="Espalda">
                Espalda{/*brazos superiores*/}
              </Dropdown.Item>
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
              <Dropdown.Item eventKey="Piernas" /*"piernas inferiores"*/>
                Piernas
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
              <Dropdown.Item eventKey="Espalda">
                Espalda{/*brazos superiores*/}
              </Dropdown.Item>
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
              <Dropdown.Item eventKey="Piernas" /*"piernas inferiores"*/>
                Piernas
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
                <option value="Cuerpo completo">Cuerpo completo</option>
                <option value="Torso">Torso</option>
                <option value="Espalda">Espalda</option>
                <option value="Pecho">Pecho</option>
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
              //onClick={() => handleEditarRutina()}
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
      {/*Modal mostrar rutina completa asignada --sirve para editar la rutina-- */}
      <Modal
        show={showModalFullRoutine}
        onHide={() => handleCloseModalAsignarRuitina()}
        centered
        className="asignar-rutina-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Rutina asignada
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Workout Timer and Notes Section */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <FontAwesomeIcon icon={faBook} />
            <div className="w-100" style={{ flexGrow: 1, margin: "0 10px" }}>
              <Form.Control type="text" placeholder="Notas" />
            </div>
            {/*<Button variant="primary">Finalizar</Button>*/}
          </div>

          {/* Exercise List */}

          {imagenes.map((imagen, imgIndex) => {
            const ejercicioId = ejerciciosIds[imgIndex]; // Extract exercise ID
            const routine = sets[ejercicioId] || []; // Safely access sets for the exercise

            return (
              <Col key={imgIndex} md={12} className="mb-4">
                <Card className="d-flex align-items-center mb-2">
                  <Card.Img
                    src={imagen}
                    style={{
                      borderRadius: "50%",
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                  />
                  <Card.Title className="text-primary m-0 w-100 text-center">
                    {nombresEjercicios[imgIndex]} ({imgIndex + 1})
                  </Card.Title>

                  <Card.Body>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>SET</th>
                            <th>ASIGNADO</th>
                            <th>PESO (KG)</th>
                            <th>REPETICIONES</th>
                            <th>✔</th>
                          </tr>
                        </thead>
                        <tbody>
                          {routine.map((set, setIndex) => (
                            <tr key={setIndex}>
                              <td>{setIndex + 1}</td>
                              <td>{set.peso + "kg x " + set.repeticiones}</td>
                              <td>
                                {" "}
                                <Form.Control
                                  type="number"
                                  //value={parseInt(set.peso) || 0}
                                  onChange={(e) =>
                                    handleSetChange(
                                      ejercicioId,
                                      setIndex,
                                      "weight",
                                      e.target.value
                                    )
                                  }
                                  className="text-center"
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  //value={parseInt(set.repeticiones) || 0}
                                  onChange={(e) =>
                                    handleSetChange(
                                      ejercicioId,
                                      setIndex,
                                      "reps",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              <td>
                                <Form.Check
                                  type="checkbox"
                                  checked={set.completado}
                                  onChange={(e) =>
                                    handleSetChangeUpdate(
                                      ejercicioId,
                                      setIndex,
                                      "completado",
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                          {/*<tr>
                          <td colSpan="5" className="text-center">
                            <Button
                              variant="link"
                              /*onClick={() => handleAddSet(ejercicioId)}*/
                          /* >
                              Add Set
                            </Button>
                          </td>
                        </tr>*/}
                        </tbody>

                        {/*<Button
                          variant="primary"
                          className="w-100 text-center me-4 fw-bold gradient-primary btn-responsive"
                          //onClick={() => handleAddSet(ejercicioId)}
                        >
                          AGREGAR SET
                        </Button>*/}
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-responsive w-100 px-4 py-2 fw-bold gradient-primary"
            variant="primary"
            onClick={handleAgregarProgreso}
          >
            {/*Finalizar2*/}
            Finalizar
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Modal progreso historial cliente*/}
      <Modal
        show={showModalFullProgreso}
        onHide={() => setShowModalFullProgreso(false)}
        centered
        className="asignar-rutina-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Rutina asignada
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Workout Timer and Notes Section */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <FontAwesomeIcon icon={faBook} />
            <div className="w-100" style={{ flexGrow: 1, margin: "0 10px" }}>
              <Form.Control type="text" placeholder="Notas" />
            </div>
            {/*<Button variant="primary">Finalizar</Button>*/}
          </div>

          {/* Exercise List */}

          {imagenes.map((imagen, imgIndex) => {
            const ejercicioId = ejerciciosIds[imgIndex]; // Extract exercise ID
            const routine = sets[ejercicioId] || []; // Safely access sets for the exercise

            return (
              <Col key={imgIndex} md={12} className="mb-4">
                <Card className="d-flex align-items-center mb-2">
                  <Card.Img
                    src={imagen}
                    style={{
                      borderRadius: "50%",
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                  />
                  <Card.Title className="text-primary m-0 w-100 text-center">
                    {nombresEjercicios[imgIndex]} ({imgIndex + 1})
                  </Card.Title>

                  <Card.Body>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>SET</th>
                            <th>ASIGNADO</th>
                            <th>PESO (KG)</th>
                            <th>REPETICIONES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {routine.map((set, setIndex) => (
                            <tr key={setIndex}>
                              <td>{setIndex + 1}</td>
                              <td>{set.asignado}</td>
                              <td>
                                {" "}
                                <Form.Control
                                  type="number"
                                  value={set.progresoPeso || ""}
                                  readOnly={true}
                                  onChange={(e) =>
                                    handleSetChange(
                                      ejercicioId,
                                      setIndex,
                                      "weight",
                                      e.target.value
                                    )
                                  }
                                  className="text-center"
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={parseInt(set.progresoReps) || 0}
                                  readOnly={true}
                                  onChange={(e) =>
                                    handleSetChange(
                                      ejercicioId,
                                      setIndex,
                                      "reps",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                          {/*<tr>
                          <td colSpan="5" className="text-center">
                            <Button
                              variant="link"
                              /*onClick={() => handleAddSet(ejercicioId)}*/
                          /* >
                              Add Set
                            </Button>
                          </td>
                        </tr>*/}
                        </tbody>

                        {/*<Button
                          variant="primary"
                          className="w-100 text-center me-4 fw-bold gradient-primary btn-responsive"
                          //onClick={() => handleAddSet(ejercicioId)}
                        >
                          AGREGAR SET
                        </Button>*/}
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-responsive w-100 px-4 py-2 fw-bold gradient-primary"
            variant="primary"
            onClick={() => setShowModalFullProgreso(false)}
          >
            {/*Finalizar2*/}
            Finalizar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HistorialClienteCompleto;
