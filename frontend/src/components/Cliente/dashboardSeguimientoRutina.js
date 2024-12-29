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
  faMinus,
  faForward,
  faChevronUp,
  faChevronDown,
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
  ProgressBar,
} from "react-bootstrap";
import { show_alerta } from "../../functions";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Otros/sideBarSeguimiento";
//import "../Entrenador/routines.css";
import { FaDumbbell } from "react-icons/fa";
import WeekdayCards from "./dashboardWeekDays";
import { format, parseISO } from "date-fns";
import { es, id } from "date-fns/locale";
import {
  faCalendarAlt,
  faCheckCircle,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";

//import "../Otros/form.css";
//import "./ModalDesign.css";
import "./dashboardSeguimientoRutina.css";

const FollowRoutines = () => {
  const navigate = useNavigate();
  const url = "http://127.0.0.1:8000/api/v1/rutina/";
  const urlEjercicios = "http://127.0.0.1:8000/api/v1/ejercicio/";
  const urlRutinaCliente = "http://localhost:8000/clienteRutinas/";
  const urlAllowInsert = "http://127.0.0.1:8000/allowUpdate/";
  const urlGetRest = "http://localhost:8000/getRestClient/";
  const [routines, setRoutines] = useState([]);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalDescanso, setShowModalDescanso] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 7));
  const [allowInsert, setAllowInsert] = useState(false);
  const urlEstadoRutina = "http://127.0.0.1:8000/mostrarEstadoRutina/";

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
  const [idCliente, setIdCliente] = useState(localStorage.getItem("idCliente"));
  const [initialSets, setInitialSets] = useState({});
  // Historial
  const [showModalHistorial, setShowModalHistorial] = useState(false);
  const [progresos, setProgresos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [showModalHistorialEditar, setShowModalHistorialEditar] =
    useState(false);
  const [historial, setHistorial] = useState([]);
  const [estadoRutinas, setEstadoRutinas] = useState([]);
  const [idEjercicio, setIdEjercicio] = useState(0);
  //Notas
  const [notas, setNotas] = useState({});
  const [allNotasEntrenador, setAllNotasEntrenador] = useState([]);
  const [allNotas, setAllNotas] = useState([]);
  //Descansos
  const [allDescansos, setAllDescansos] = useState([]);
  //Timer
  const [initialTime, setInitialTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTime); // Time left state
  const [isRunning, setIsRunning] = useState(false); // Timer running status
  const [exerciseTimers, setExerciseTimers] = useState({}); // Exercise timers
  const [activeTimer, setActiveTimer] = useState(null); // Active timers
  //Progress
  const progress =
    ((exerciseTimers.initialTime - exerciseTimers.timeLeft) /
      exerciseTimers.initialTime) *
    100;
  const [allNotasProgreso, setAllNotasProgreso] = useState([]);
  //Rest time
  const [restTime, setRestTime] = useState("");
  const [allDescansosProgreso, setAllDescansosProgreso] = useState([]);
  //Last exercise Id
  const [lastSelectedExerciseId, setLastSelectedExerciseId] = useState(0);
  const [lastSerie, setLastSerie] = useState(0);
  // State for collapsibility
  const [showTrainerSection, setShowTrainerSection] = useState(true); // Trainer's section
  const [showClientSection, setShowClientSection] = useState(true); // Client's section

  useEffect(() => {
    getRoutines();
    getEjercicios();
  }, []);

  useEffect(() => {
    filterEjercicios();
  }, [searchTerm, bodyPart, ejercicios]);

  useEffect(() => {
    getEstadoRutinas();
  }, []);

  useEffect(() => {
    console.log("Active Timer:", activeTimer);
    console.log("Last Selected Exercise ID:", lastSelectedExerciseId);
    console.log("Exercise Timers:", exerciseTimers);
  }, [activeTimer, lastSelectedExerciseId, exerciseTimers]);

  useEffect(() => {
    let intervalId = null;

    if (activeTimer && exerciseTimers[activeTimer]?.isRunning) {
      console.log(`Starting interval for activeTimer: ${activeTimer}`);

      intervalId = setInterval(() => {
        setExerciseTimers((prevTimers) => {
          const currentTimer = prevTimers[activeTimer];

          if (!currentTimer) return prevTimers; // No timer, return unchanged

          if (currentTimer.timeLeft <= 0) {
            clearInterval(intervalId);
            show_alerta("¡Tiempo de descanso finalizado!", "success");
            setShowModalDescanso(false);
            console.log(`Timer finished for: ${activeTimer}`);
            return {
              ...prevTimers,
              [activeTimer]: {
                ...currentTimer,
                isRunning: false,
                timeLeft: 0,
              },
            };
          }

          return {
            ...prevTimers,
            [activeTimer]: {
              ...currentTimer,
              timeLeft: currentTimer.timeLeft - 1,
            },
          };
        });
      }, 1000); // Run every second
    }

    return () => {
      if (intervalId) {
        console.log(`Clearing interval for activeTimer: ${activeTimer}`);
        clearInterval(intervalId);
      }
    };
  }, [activeTimer, exerciseTimers]); // Watch activeTimer and exerciseTimers

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

  const getRoutines = async () => {
    if (selectDay !== null) {
      await axios
        .get(urlRutinaCliente, {
          params: {
            id_cliente: idCliente,
            dia: selectDay,
          },
        })
        .then((response) => {
          setRoutines(response.data.rutinas);
          setShowWeekDays(false);
        });
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
        setAllNotasEntrenador(
          response.data.ejerciciosIds.reduce((acc, id, index) => {
            acc[id] = response.data.notas_asigna[index] || "";
            return acc;
          }, {})
        );
        setAllNotasProgreso(
          response.data.ejerciciosIds.reduce((acc, id, index) => {
            acc[id] = response.data.notas_progreso[index] || "";
            return acc;
          }, {})
        );
        setAllDescansos(
          response.data.ejerciciosIds.reduce((acc, id, index) => {
            acc[id] = response.data.descansos_asigna[index] || "";
            return acc;
          }, {})
        );
        setAllDescansosProgreso(
          response.data.ejerciciosIds.reduce((acc, id, index) => {
            if (!acc[id]) {
              acc[id] = { total: 0, count: 0 };
            }
            // Sum the rest times for this exercise
            if (response.data.descansos_progreso[index]) {
              acc[id].total += response.data.descansos_progreso[index];
              acc[id].count += 1;
            }
            return acc;
          }, {})
        );
        setNombresEjercicios(response.data.nombresEjercicios);
        if (value === 1) {
          setShowModalFullRoutine(true);
        }
        //alert(JSON.stringify(response.data.sets, null, 2));
        const setsData = response.data.sets || {};
        //alert("Entra aqui");
        setSets(setsData);
        //alert(JSON.stringify(setsData, null, 2));
        setInitialSets(setsData);
        console.log(
          JSON.stringify("Los sets son:" + response.data.sets, null, 2)
        );
      });
  };

  const handleLlenarCamposRutinaProgreso = (id_rutina, fecha) => {
    setIdRutina(id_rutina);
    console.log("El id del cliente es: " + idCliente);
    console.log("El id de la rutina es: " + id_rutina);
    console.log("Pertenece al dia: " + selectDay);

    const url = "http://127.0.0.1:8000/obtenerRutinaProgresoDetalleCompleto/";
    axios
      .get(url, {
        params: {
          id_cliente: idCliente,
          dia: selectDay,
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
        setAllDescansos(
          response.data.ejerciciosIds.reduce((acc, id, index) => {
            acc[id] = response.data.descansos_asigna[index] || "";
            return acc;
          }, {})
        );
        setAllDescansosProgreso(
          response.data.ejerciciosIds.reduce((acc, id, index) => {
            if (!acc[id]) {
              acc[id] = { total: 0, count: 0 };
            }
            // Sum the rest times for this exercise
            if (response.data.descansos_progreso[index]) {
              acc[id].total += response.data.descansos_progreso[index];
              acc[id].count += 1;
            }
            return acc;
          }, {})
        );
        setAllDescansosProgreso((prev) =>
          Object.keys(prev).reduce((averageAcc, id) => {
            const { total, count } = prev[id];
            averageAcc[id] = count > 0 ? total / count : 0;
            return averageAcc;
          }, {})
        );

        setAllNotas(
          response.data.ejerciciosIds.reduce((acc, id, index) => {
            //alert("Acumulador:" + JSON.stringify(acc, null, 2)); //Accumulator:{"30":"asd"}, Id:31, Index:1
            //alert("Id" + id);
            //alert("Index" + index);
            acc[id] = response.data.notas_asigna[index] || "";
            return acc;
          }, {})
        );
        setAllNotasProgreso(
          response.data.ejerciciosIds.reduce((acc, id, index) => {
            //alert("Acumulador:" + JSON.stringify(acc, null, 2)); //Accumulator:{"30":"asd"}, Id:31, Index:1
            //alert("Id" + id);
            //alert("Index" + index);
            acc[id] = response.data.notas_progreso[index] || "";
            return acc;
          }, {})
        );
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

  const updateExerciseTimer = (idEjercicio, serie, newTimerState) => {
    const timerKey = `${idEjercicio}-${serie}`;
    setExerciseTimers((prevTimers) => ({
      ...prevTimers,
      [timerKey]: {
        ...prevTimers[timerKey],
        ...newTimerState,
      },
    }));
  };

  const handleSetChangeUpdate = (idEjercicio, setIndex, field, value) => {
    //alert(idEjercicio);
    //alert(setIndex + 1);
    const serie = setIndex + 1;
    const timerKey = `${idEjercicio}-${serie}`;
    //alert(timerKey);

    if (field === "completado" && value) {
      setActiveTimer(timerKey);
      setIsRunning(true);
      setLastSelectedExerciseId(idEjercicio);
      setLastSerie(serie);
      setIdEjercicio(idEjercicio);
      //alert(JSON.stringify(exerciseTimers), null, 2);
      axios
        .get(urlGetRest, {
          params: {
            id_ejercicio: idEjercicio,
            id_cliente: idCliente,
            id_rutina: idRutina,
            dia: selectDay,
          },
        })
        .then((response) => {
          //alert(response.data.tiempoDescanso);
          updateExerciseTimer(idEjercicio, serie, {
            isRunning: true,
            initialTime: response.data.tiempoDescanso || 180,
            timeLeft: response.data.tiempoDescanso || 180,
          });
          setShowModalDescanso(true);
        });
    } else {
      setIsRunning(false);
      setExerciseTimers((prevTimers) => ({
        ...prevTimers,
        [timerKey]: {
          isRunning: false,
          timeLeft: 0,
        },
      }));
      setActiveTimer(null);
      //setShowModalDescanso(false);
    }
    // Strip leading zeros by converting to a number and back to a string
    //const numericValue = value === "" ? null : parseInt(value, 10);
    //if (isNaN(numericValue)) return; // Skip if the value is not a valid number

    // Update `sets` state
    setSets((prevSets) => {
      const updatedSets = { ...prevSets }; // Clone the previous state
      if (updatedSets[idEjercicio]) {
        // If the exercise exists in the state
        updatedSets[idEjercicio] = updatedSets[idEjercicio].map(
          (set, index) => {
            if (index === setIndex) {
              return {
                ...set,
                [field]: field === "completado" ? value : set[field], // Explicit handling for "completado"
              }; // Update the specific field (e.g., peso or repeticiones)
            }
            return set; // Leave other sets unchanged
          }
        );
      }
      //alert(JSON.stringify(updatedSets), null, 2);
      return updatedSets; // Return the updated state
    });

    // Update `rutinaCompletaCliente` state

    /*setRutinaCompletaCliente((prevRutinas) =>
      prevRutinas.map((routine) => {
        if (
          routine.id_ejercicio === idEjercicio &&
          routine.serie === setIndex + 1
        ) {
          // Update the matching routine
          //alert(JSON.stringify(routine), null, 2);
          return { ...routine, [field]: value }; // Update the specific field
        }

        return routine; // Leave other routines unchanged
      })
    );*/

    /*if (field === "completado" && value) {
      setInitialTime(120);
      setTimeLeft(120);
      setIsRunning(true);
      setShowModalDescanso(true);
    } else {
      setInitialTime(0);
      setTimeLeft(0);
      setIsRunning(false);
      setShowModalDescanso(false);
    }*/
  };

  const prepararDatos = () => {
    let data = [];

    console.log("Sets object:", sets);
    console.log("ExerciseTimers object:", exerciseTimers);

    Object.keys(sets).forEach((exerciseId) => {
      // Process sets
      sets[exerciseId].forEach((set) => {
        const timerKey = `${exerciseId}-${set.serie}`; // Build the correct timer key
        const timer = exerciseTimers[timerKey];
        console.log(
          `Timer for Exercise ${exerciseId}, Serie ${set.serie}:`,
          timer
        );

        //alert(notas[exerciseId]);

        console.log(`Processing Exercise ID: ${exerciseId}`);
        console.log(`Timer for Exercise ${exerciseId}:`, timer);

        // Validate timer existence and values
        if (!timer) {
          console.log(`No timer found for Exercise ID: ${exerciseId}`);
          return;
        }
        if (timer.initialTime <= 0 || timer.timeLeft < 0) {
          console.log(
            `Invalid timer values for Exercise ID: ${exerciseId}`,
            timer
          );
          return;
        }

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
          notas: allNotas[exerciseId] || "",
          exerciseTimers: {
            initialTime: timer.initialTime,
            timeLeft: timer.timeLeft,
          },
        });
      });
    });

    console.log("Final Data:", data);
    return data;
  };

  const verificarTodosCompletados = () => {
    let allCompleted = true;

    Object.keys(sets).forEach((exerciseId) => {
      sets[exerciseId].forEach((set) => {
        if (!set.completado) {
          allCompleted = false;
        }
      });
    });

    return allCompleted;
  };

  //Object.keys(sets);
  //Output: ["30", "31"]
  const verificarSetsBlancos = () => {
    return !Object.keys(sets).some((exerciseId) => {
      return sets[exerciseId].some((set) => {
        return (
          !("reps" in set) || // Check if "reps" key is missing
          !("weight" in set) || // Check if "weight" key is missing
          set.reps === "" || // Check if "reps" is empty
          set.weight === "" // Check if "weight" is empty
        );
      });
    });
  };

  const handleAgregarProgreso = async () => {
    alert(JSON.stringify(allNotas));
    const allCompleted = verificarTodosCompletados();
    const allWithData = verificarSetsBlancos();

    var allow = await allowInsertar(); // Wait for the result of allowActualizar
    if (allow === true) {
      if (!allCompleted) {
        show_alerta(
          "Se deben completar todas las series antes de finalizar",
          "warning"
        );
        return;
      }

      if (!allWithData) {
        show_alerta(
          "Todos los sets deben tener peso y repeticiones",
          "warning"
        );
        return;
      }
      const datos = prepararDatos();
      //alert(JSON.stringify(datos, null, 2));
      const urlAsignarProgreso = "http://127.0.0.1:8000/agregarProgreso/";
      axios.post(urlAsignarProgreso, datos).then((response) => {
        show_alerta("Rutina finalizada exitosamente", "success");
        setShowModalFullRoutine(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        //setShowModalAssignRoutine(false);
      });
    } else {
      show_alerta(
        "Se debe esperar hasta que el entrenador asigne nuevos registros",
        "warning"
      );
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

  const allowInsertar = async () => {
    try {
      const response = await axios.get(urlAllowInsert, {
        params: {
          id_cliente: idCliente,
          id_rutina: idRutina,
        },
      });
      setAllowInsert(response.data.allow); // Update state (optional if you need it elsewhere)
      return response.data.allow; // Return the value for immediate use
    } catch (error) {
      console.error("Error al obtener la información", error);
      show_alerta("Error al verificar permisos de actualización", "error");
    }
  };

  const findEstado = (id_rutina) => {
    const estado = estadoRutinas.find(
      (estadoRutina) => Number(estadoRutina.id_rutina) === Number(id_rutina) // Ensure matching types
    );
    return estado ? estado.status : null; // Return default text if no match
  };

  const handleNotasChange = (id_ejercicio, value) => {
    //alert(id_ejercicio + " " + value);
    setAllNotas((prevNotas) => ({
      ...prevNotas,
      [id_ejercicio]: value,
    }));
  };

  // Adjust Timer (+30 or -30)
  const adjustTime = (seconds) => {
    setExerciseTimers((prevTimers) => {
      const currentTimer = prevTimers[activeTimer];
      if (!currentTimer) {
        return prevTimers;
      }
      return {
        ...prevTimers,
        [activeTimer]: {
          ...currentTimer,
          timeLeft: Math.max(currentTimer.timeLeft + seconds, 0),
        },
      };
    });
  };

  // Skip Rest Timer
  const skipRest = () => {
    setTimeLeft(0);
    setIsRunning(false);
    setShowModalDescanso(false);
  };

  const handleDescansoChange = (id_ejercicio, value) => {
    setRestTime((prevTime) => ({
      ...prevTime,
      [id_ejercicio]: value,
    }));
  };

  const handleOpenRestModal = (idEjercicio) => {
    axios
      .get(urlGetRest, {
        params: {
          id_ejercicio: idEjercicio,
          id_cliente: idCliente,
          id_rutina: idRutina,
          dia: selectDay,
        },
      })
      .then((response) => {
        //setInitialTime(response.data.tiempoDescanso);
        //setTimeLeft(response.data.tiempoDescanso);
        //setIsRunning(true);

        setExerciseTimers((prevTimers) => ({
          ...prevTimers,
          [idEjercicio]: {
            isRunning: true,
            initialTime: response.data.tiempoDescanso,
            timeLeft: response.data.tiempoDescanso,
          },
        }));
        setShowModalDescanso(true);
      });
  };

  return (
    <div>
      <NavScrollExample
        onSearchResults={handleSearchResults}
        onLogout={handleCerrarSesion}
        showWeekDays={showWeekDays}
      />
      {!showWeekDays && (
        <Container>
          <Row>
            <Col md={2} className="d-none d-md-block">
              {" "}
              <Sidebar isOpen={isOpen} toggleSideBar={handleOpenSideBar} />
            </Col>
            <Col md={{ span: 12, offset: 1 }}>
              <div className={`main-content ${isOpen ? "shrinked" : ""}`}>
                <div className="panel-heading"></div>
                <Row className="ms-3">
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

              <div className={`main-content ${isOpen ? "shrinked" : ""}`}>
                <Row>
                  <h3 className="w-100 text-center">
                    Rutinas del día {selectDay}
                  </h3>
                  {routines.map((routine, index) => (
                    <Col md={4} key={routine.id_rutina} className="mb-4">
                      <Card
                        className={index % 2 === 0 ? "bg-light" : "bg-white"}
                      >
                        <Card.Body>
                          {" "}
                          <Card.Title className="w-100 text-start">
                            <strong>{routine.nombre}</strong>
                          </Card.Title>
                          <Card.Text className="w-100 text-start">
                            {routine.descripcion
                              ? routine.descripcion
                              : "Sin descripción"}
                          </Card.Text>
                          <Card.Text>
                            {" "}
                            {/*Duración: {routine.duracion} mins*/}
                            <Card.Text className="w-100 text-start">
                              <strong>Enfoque:</strong>{" "}
                              {routine.enfoque.toLowerCase()}
                            </Card.Text>
                            <Card.Text className="w-100 text-start">
                              <strong>Estado:</strong>{" "}
                              {findEstado(routine.id_rutina) ? (
                                <FontAwesomeIcon
                                  icon={faHourglassHalf}
                                  className="text-success w-100 icon"
                                  title="Completado"
                                />
                              ) : (
                                <FontAwesomeIcon
                                  icon={faCheckCircle}
                                  className="text-success w-100 icon"
                                  title="Completado"
                                />
                              )}
                            </Card.Text>
                            <div className="w-100 text-center">
                              {" "}
                              <Button
                                variant="primary"
                                className="me-2"
                                onClick={() =>
                                  handleLlenarCamposRutinaEjercicio(
                                    routine.id_rutina,
                                    1
                                  )
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faDumbbell}
                                  className="icon"
                                />
                                {/*Empezar rutina*/}
                              </Button>
                              <Button
                                variant="primary"
                                className="me-2"
                                onClick={() =>
                                  handleVerHistorial(routine.id_rutina)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faBook}
                                  className="icon"
                                />
                              </Button>
                              {/*Ver historial*/}
                            </div>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
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

        {/*<Modal
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
        {/*<div>
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
        {/*</Modal.Footer>
        </Modal> */}
      </Modal>
      {/*Modal mostrar rutina completa asignada --sirve para agregar el progreso-- */}
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
          {/* Exercise List */}

          {imagenes.map((imagen, imgIndex) => {
            const ejercicioId = ejerciciosIds[imgIndex]; // Extract exercise ID
            const routine = sets[ejercicioId] || []; // Safely access sets for the exercise
            const timerKey = `${lastSelectedExerciseId}-${lastSerie}`;
            const timer = exerciseTimers[activeTimer];

            //alert(JSON.stringify(timer, null, 2));

            return (
              <Col key={`${ejercicioId}-${imgIndex}`} md={12} className="mb-4">
                {(() => {
                  console.log(
                    "activeTimer" + JSON.stringify(activeTimer, null, 2)
                  );
                  console.log("timerKey" + timerKey);
                  if (timer?.isRunning) {
                    //alert(activeTimer + " and " + timerKey);
                  }
                })()}
                {timerKey === activeTimer &&
                  timer?.isRunning &&
                  ejercicioId === lastSelectedExerciseId && (
                    // Ensure activeTimer matches
                    <div className="d-flex justify-content-center align-items-center text-muted mb-3  ">
                      <FontAwesomeIcon icon={faClock} className="mt-3 me-2" />
                      <ProgressBar
                        now={
                          ((timer?.initialTime - timer?.timeLeft) /
                            timer?.initialTime) *
                          100
                        }
                        className="mt-3"
                        style={{ width: "38%", height: "25px" }}
                      />
                      <span className="ms-2 mt-3">
                        {Math.floor(timer?.timeLeft / 60)}:
                        {(timer?.timeLeft % 60).toString().padStart(2, "0")}
                      </span>
                    </div>
                  )}

                <div className="mb-3">
                  {/* Notes Section */}
                  <div className="d-flex flex-column align-items-center">
                    {/* Trainer Notes */}

                    <div className="p-3 border rounded shadow-sm w-100">
                      <h5
                        className="text-primary mb-3 text-center d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setShowTrainerSection(!showTrainerSection)
                        }
                      >
                        Notas entrenador
                        <FontAwesomeIcon
                          icon={
                            showTrainerSection ? faChevronUp : faChevronDown
                          }
                        />
                      </h5>

                      {showTrainerSection && (
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center w-100">
                            <FontAwesomeIcon icon={faBook} className="me-2" />
                            <Form.Control
                              as="textarea"
                              placeholder="Notas entrenador"
                              rows={2}
                              value={allNotasEntrenador[ejercicioId] || ""} // Controlled input
                              readOnly
                            />
                            {/*<Button variant="primary">Finalizar</Button>*/}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-3 border rounded shadow-sm w-100">
                      <h5
                        className="text-primary mb-3 text-center d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowClientSection(!showClientSection)}
                      >
                        Tus notas
                        <FontAwesomeIcon
                          icon={
                            showTrainerSection ? faChevronUp : faChevronDown
                          }
                        />
                      </h5>
                      {showClientSection && (
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center w-100">
                            <FontAwesomeIcon icon={faBook} className="me-2" />
                            <Form.Control
                              as="textarea"
                              placeholder="Tus notas aquí...."
                              value={allNotasProgreso[ejercicioId] || ""} // Controlled input
                              rows={2}
                              onChange={(e) =>
                                handleNotasChange(ejercicioId, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      )}

                      {/*<Button variant="primary">Finalizar</Button>*/}
                    </div>
                  </div>
                </div>

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
                  {/* Workout Timer and Notes Section */}

                  <Card.Title
                    className="text-primary m-0 w-100 text-center"
                    onClick={() =>
                      handleMostrarInstruccionesEjercicio(ejercicioId)
                    }
                  >
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
                            {/*<th>
                              {" "}
                              <FontAwesomeIcon icon={faClock} />
                            </th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {routine.map((set, setIndex) => (
                            <tr
                              key={setIndex}
                              className={set.completado ? "completed-set" : ""} // Add class when completed
                              style={{
                                backgroundColor: set.completado
                                  ? "#e6ffe6"
                                  : "transparent",
                                transition: "background-color 0.3s ease",
                              }} // Inline style for green highlight
                            >
                              <td
                                style={{
                                  color: "blue",
                                }}
                              >
                                {setIndex + 1}
                              </td>
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
                    {/*Rest Timer*/}
                    {isRunning && lastSelectedExerciseId === ejercicioId && (
                      <div className="text-center mt-3">
                        <Button
                          variant="primary"
                          onClick={() => handleOpenRestModal(ejercicioId)}
                        >
                          Ver descanso <FontAwesomeIcon icon={faClock} />
                        </Button>
                      </div>
                    )}
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

      {/*Modal reloj*/}

      <Modal
        show={showModalDescanso}
        onHide={() => setShowModalDescanso(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Tiempo de descanso
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          {/* Circular Timer UI */}
          <div
            style={{
              width: "200px",
              height: "200px",
              margin: "0 auto",
              borderRadius: "50%",
              border: "10px solid #007bff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#007bff",
            }}
          >
            {Math.floor(exerciseTimers[activeTimer]?.timeLeft / 60)}:
            {(exerciseTimers[activeTimer]?.timeLeft % 60)
              .toString()
              .padStart(2, "0")}
          </div>
          <ProgressBar
            now={
              ((exerciseTimers[activeTimer]?.initialTime -
                exerciseTimers[activeTimer]?.timeLeft) /
                exerciseTimers[activeTimer]?.initialTime) *
              100
            }
            className="mt-3"
          />
          <div className="d-flex justify-content-around mt-3">
            <Button variant="secondary" onClick={() => adjustTime(-30)}>
              <FontAwesomeIcon icon={faMinus} /> 30s
            </Button>
            <Button variant="secondary" onClick={() => adjustTime(30)}>
              <FontAwesomeIcon icon={faPlus} /> 30s
            </Button>
            <Button variant="danger" onClick={skipRest}>
              <FontAwesomeIcon icon={faForward} /> Saltar
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button
            variant="primary"
            onClick={() => setShowModalDescanso(false)}
            disabled={timeLeft > 0}
          >
            Continuar
          </Button> */}
        </Modal.Footer>
      </Modal>

      {/* Modal historial */}
      <Modal
        closeButton
        show={showModalHistorial}
        onHide={() => setShowModalHistorial(false)}
        centered
        className="asignar-rutina-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">Historial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="">
            <Form.Label>Filtrar por mes</Form.Label>
            <Col xs={8} md={10}>
              <Form.Control
                type="month"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-100 mb-5"
                placeholder="Selecciona un mes"
              />
            </Col>
            <Col xs={4} md={2} className="py-1">
              <Button variant="primary" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} className="icon" />
              </Button>
            </Col>
          </Row>{" "}
          {historial && historial.length > 0 ? (
            historial.map((entry, index) => (
              <Col md={12} key={index} className="mb-4">
                {/* Date Header */}
                <h5 className="text-center text-primary">
                  {entry.fecha
                    ? handleHistorialDate(entry.fecha)
                    : "Fecha no disponible"}
                </h5>
                {entry.rutinas.map((rutina) => (
                  <Card
                    className={
                      index % 2 === 0
                        ? "bg-light mb-3 mx-auto"
                        : "bg-white mb-3 mx-auto"
                    }
                    style={{ maxWidth: "98%" }}
                  >
                    <Card.Body>
                      <Card.Title className="w-100 text-center">
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
                      <Table responsive bordered className="table">
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
                                {ejercicio.max_serie} x {ejercicio.nombre}
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
                              entry.fecha
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faEye} className="icon" />
                        </Button>
                        {/*Ver historial*/}
                      </div>
                    </Card.Footer>
                  </Card>
                ))}
              </Col>
            ))
          ) : (
            <p>No hay historial para mostrar</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* <Button
            className="btn-responsive w-100 px-4 py-2 fw-bold gradient-primary"
            variant="primary"
          >
            Guardar cambios
          </Button> */}
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
          {/* Exercise List */}

          {imagenes.map((imagen, imgIndex) => {
            const ejercicioId = ejerciciosIds[imgIndex]; // Extract exercise ID
            const routine = sets[ejercicioId] || []; // Safely access sets for the exercise

            return (
              <Col key={imgIndex} md={12} className="mb-4">
                <div className="mb-4 p-3 border rounded shadow-sm ">
                  {" "}
                  <h5
                    className="text-primary mb-3 text-center d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowClientSection(!showClientSection)}
                  >
                    Notas entrenador y descanso
                    <FontAwesomeIcon
                      icon={showClientSection ? faChevronUp : faChevronDown}
                    />
                  </h5>
                  {showClientSection && (
                    <div className="d-flex justify-content-between align-items-center">
                      {/* Trainer Notes */}
                      <div
                        className="d-flex align-items-center me-2"
                        style={{
                          flexGrow: 1,
                          marginRight: "15px", // Add space between the inputs
                        }}
                      >
                        <FontAwesomeIcon icon={faBook} className="me-2" />
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Tus notas"
                          value={allNotas[ejercicioId] || ""} // Controlled input
                          style={{ resize: "none" }}
                        />
                        {/*<Button variant="primary">Finalizar</Button>*/}
                      </div>

                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                        <Form.Control
                          type="number"
                          id="restTime"
                          placeholder="Tiempo de descanso (minutos)"
                          value={allDescansos[ejercicioId] || ""}
                          readOnly
                          style={{
                            width: "80px", // Keep the input narrow
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            textAlign: "center", // Center-align text
                            fontSize: "14px",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4 p-3 border rounded shadow-sm bg-light">
                  <h5
                    className="text-primary mb-3 text-center d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowTrainerSection(!showTrainerSection)}
                  >
                    Tus notas y descanso
                    <FontAwesomeIcon
                      icon={showTrainerSection ? faChevronUp : faChevronDown}
                      className="d-flex align-items-center me-2"
                    />
                  </h5>

                  {showTrainerSection && (
                    <div className="d-flex justify-content-between align-items-center">
                      <div
                        className="d-flex align-items-center me-2"
                        style={{
                          flexGrow: 1,
                          marginRight: "15px", // Add space between the inputs
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faBook}
                          className="me-2"
                          style={{
                            flexGrow: 1,
                            marginRight: "15px", // Add space between the inputs
                          }}
                        />
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Sin notas que mostrar"
                          value={allNotasProgreso[ejercicioId] || ""} // Controlled input
                          style={{ resize: "none" }}
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                        <Form.Control
                          type="number"
                          id="restTime"
                          placeholder="Sin descanso que mostrar"
                          value={allDescansosProgreso[ejercicioId] || ""}
                          readOnly
                          style={{
                            width: "80px", // Keep the input narrow
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            textAlign: "center", // Center-align text
                            fontSize: "14px",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

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

                  {/* Workout Timer and Notes Section */}

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
          {
            <>
              <div className="w-100 d-flex justify-content-center">
                {" "}
                <Card.Img
                  variant="top"
                  src={ejercicioInstrucciones?.imagen}
                  alt={`${ejercicioInstrucciones?.nombre} preview`}
                  style={{ maxWidth: "65%", borderRadius: "10px" }}
                  className="w-100 d-flex justify-content-center align-items-center"
                ></Card.Img>
              </div>

              {/* Display Steps */}
              <div>
                <h5 className="w-100 text-center">
                  <strong>Instrucciones</strong>
                </h5>
                <ol>
                  {ejercicioInstrucciones.instrucciones &&
                    JSON.parse(ejercicioInstrucciones.instrucciones).map(
                      (instruccion, index) => <li key={index}>{instruccion}</li>
                    )}
                </ol>
              </div>
            </>
          }
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
    </div>
  );
};

export default FollowRoutines;
