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
  faTrash,
  faBook,
  faChevronLeft,
  faChevronRight,
  faDumbbell,
  faClock,
  faChevronUp,
  faChevronDown,
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
  InputGroup,
  Dropdown,
  Table,
} from "react-bootstrap";
import { show_alerta } from "../../functions";
import "../Admin/styles.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Otros/sideBar";
import styles from "../Otros/cards.module.css"; // Import CSS Module
import WeekdayCards from "./weekdays";
import WeeklyRoutinePlan from "./tablePlan";
import "./routines.css";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./searchBarAsignar";
import "./routines.css";
import Header from "../Otros/header";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./dashboardAsignarRutina.css";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

const AssignRoutines = () => {
  const idEntrenador = localStorage.getItem("idEntrenador");
  const url = "http://127.0.0.1:8000/api/v1/client/";
  const urlAllowEliminar = "http://127.0.0.1:8000/allowDelete/";
  const urlAllowUpdate = "http://127.0.0.1:8000/allowUpdate/";
  const [idCliente, setIdCliente] = useState(0);
  const [clients, setClients] = useState([]);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [selectedEjercicios, setSelectedEjercicios] = useState([]);
  const [showModalAssignRoutine, setShowModalAssignRoutine] = useState(false);

  //Ejercicio
  const [ejercicios, setEjercicios] = useState([]);
  const [ejercicioInstrucciones, setEjercicioInstrucciones] = useState("");
  const [idEjercicio, setIdEjercicio] = useState(0);

  //Rutina
  const urlRoutine = "http://127.0.0.1:8000/api/v1/rutina/";
  const urlEjercicios = "http://127.0.0.1:8000/api/v1/ejercicio/";
  const [showModalRutinas, setShowModalRutinas] = useState(false);
  const [showModalInfoRutina, setShowModalInfoRutina] = useState(false);
  const [showModalRutinaEliminar, setShowModalRutinaEliminar] = useState(false);
  const [routines, setRoutines] = useState([]);
  const [filteredRoutines, setFilteredRoutines] = useState([]);
  const [idRutina, setIdRutina] = useState(0);
  const [nombreRutina, setNombreRutina] = useState("");
  const [descripcionRutina, setDescripcionRutina] = useState("");
  const [showModalRutinaEditar, setShowModalRutinaEditar] = useState(false);
  const [estadoRutinas, setEstadoRutinas] = useState([]);
  const urlEstadoRutina = "http://127.0.0.1:8000/mostrarEstadoRutina/";

  //seAsigna
  const urlSeAsigna = "http://127.0.0.1:8000/api/v1/seAsigna/";
  const [sets, setSets] = useState([
    { reps: "", weight: "", completado: "false", asignado: "0 kg x 0" },
  ]); // Initial set
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

  //Abrir sideBar
  const [isOpen, setIsOpen] = useState(false);

  //SearchTerm

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("esta semana");

  //Routine type

  const [routineType, setRoutineType] = useState("Creada");
  const [AssignRoutineType, setAssignRoutineType] = useState("Asignacion");
  const [routineTypeExercise, setRoutineTypeExercise] = useState("Informacion");

  //Dashboard

  const urlDashboard = "http://127.0.0.1:8000/getFuerzaRutina/";
  const urlDashboardFecha = `http://127.0.0.1:8000/getFuerzaRutinaFecha/`;
  const urlDashboardExercise = "http://127.0.0.1:8000/getFuerzaEjercicio/";
  const urlDashboardExerciseAssigned =
    "http://127.0.0.1:8000/getFuerzaEjercicioAsignado/";

  const [charData, setCharData] = useState([]);

  //Instrucciones
  const [
    showModalEjerciciosInstrucciones,
    setShowModalEjerciciosInstrucciones,
  ] = useState(false);

  //Filtros de busqueda

  const [startDate, setStartDate] = useState(getCurrentMonday());
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 7));

  //Permisos eliminar y editar rutina

  const [allowDelete, setAllowDelete] = useState(false);
  const [allowUpdate, setAllowUpdate] = useState(false);

  //Notas
  const [notas, setNotas] = useState({});
  const [allNotas, setAllNotas] = useState([]);
  const [allNotasProgreso, setAllNotasProgreso] = useState([]);
  //Descansos
  const [allDescansos, setAllDescansos] = useState([]);
  const [allDescansosProgreso, setAllDescansosProgreso] = useState([]);

  //Imágenes

  const imagenesCatalogo = [
    {
      id_rutina: 1,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/espalda-biceps-A.png",
    },
    {
      id_rutina: 2,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/espalda-biceps-B.png",
    },
    {
      id_rutina: 3,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pecho-triceps-A.png",
    },
    {
      id_rutina: 4,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pecho-triceps-B.png",
    },
    {
      id_rutina: 5,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pierna-A.png",
    },
    {
      id_rutina: 6,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pierna-B.png",
    },
    {
      id_rutina: 7,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pierna-C.png",
    },
    {
      id_rutina: 8,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pierna-D.png",
    },
    {
      id_rutina: 9,
      url: "https://storage.googleapis.com/gifs_exercises_regional/Pictures%20catalog/pierna-E.png",
    },
  ];

  //Historial

  const [historial, setHistorial] = useState([]);

  //Progreso

  const [showModalFullProgreso, setShowModalFullProgreso] = useState(false);
  const [initialSets, setInitialSets] = useState({});

  //defaultCharData

  const defaultCharData = [
    { fecha: "2024-01-01", "Ejercicio 1": 0, "Ejercicio 2": 0 },
  ];

  //Tiempos
  const [restTime, setRestTime] = useState("");

  // State for collapsibility
  const [showTrainerSection, setShowTrainerSection] = useState(true); // Trainer's section
  const [showClientSection, setShowClientSection] = useState(true); // Client's section

  useEffect(() => {
    getClients();
    getRoutines();
    getSeAsigna();
    getEjercicios();
  }, []);

  useEffect(() => {
    getEstadoRutinas();
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

  useEffect(() => {
    getProgresoCombinado();
  }, [routineTypeExercise]);

  useEffect(() => {
    getProgresoCombinado();
  }, [dateRange]);

  useEffect(() => {
    getFuerzaRutinaFecha();
  }, [dateRange]);

  useEffect(() => {
    getFuerzaRutinaFecha();
  }, [AssignRoutineType]);

  useEffect(() => {
    if (AssignRoutineType === "Historial") {
      handleVerHistorial();
    }
  }, [AssignRoutineType]);

  const getProgresoCombinado = () => {
    if (routineTypeExercise === "Progreso") {
      const params = { id_ejercicio: idEjercicio, id_cliente: idCliente };
      if (dateRange.startsWith("mes")) {
        const [, month, year] = dateRange.match(/month=(\d+)&year=(\d+)/);
        params.month = month;
        params.year = year;
        params.range = "mes";
      } else if (dateRange.startsWith("año")) {
        const [, year] = dateRange.match(/year=(\d+)/);
        params.year = year;
        params.range = "año";
      } else {
        params.range = dateRange.split("&")[0];
        if (dateRange.includes("start_date")) {
          params.start_date = dateRange.split("start_date=")[1].split("&")[0];
          params.end_date = dateRange.split("end_date=")[1];
        }
      }
      axios
        .get(urlDashboardExercise, {
          params: params,
        })
        .then((response) => {
          const volumen = response.data.volumen_por_ejercicio;
          const asignado_volumen = response.data.volumen_asignado;

          //alert(JSON.stringify(response.data, null, 2));

          // Transform the `volumen` data
          const transformedVolumen = volumen.reduce(
            (acc, { fecha, volumen }) => {
              let dateEntry = acc.find((entry) => entry.fecha === fecha);
              if (!dateEntry) {
                dateEntry = { fecha };
                acc.push(dateEntry);
              }
              dateEntry["Volumen"] = volumen;
              return acc;
            },
            []
          );

          // Transform the `asignado_volumen` data
          const transformedAsignado = asignado_volumen.reduce(
            (acc, { fecha, asignado_volumen }) => {
              let dateEntry = acc.find((entry) => entry.fecha === fecha);
              if (!dateEntry) {
                dateEntry = { fecha };
                acc.push(dateEntry);
              }
              dateEntry["Asignado Volumen"] = asignado_volumen;
              return acc;
            },
            []
          );

          // Combine both datasets
          const combinedData = [...transformedVolumen];
          transformedAsignado.forEach(
            ({ fecha, "Asignado Volumen": asignadoVolumen }) => {
              const entry = combinedData.find((data) => data.fecha === fecha);
              if (entry) {
                entry["Asignado Volumen"] = asignadoVolumen;
              } else {
                combinedData.push({
                  fecha,
                  "Asignado Volumen": asignadoVolumen,
                });
              }
            }
          );

          console.log("Combined Data:", combinedData);
          setCharData(combinedData);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  };

  const getFuerzaRutinaFecha = () => {
    if (AssignRoutineType === "Progreso" && idRutina !== 0) {
      //alert(dateRange);
      try {
        const params = { id_rutina: idRutina, id_cliente: idCliente };
        if (dateRange.startsWith("mes")) {
          const [, month, year] = dateRange.match(/month=(\d+)&year=(\d+)/);
          params.month = month;
          params.year = year;
          params.range = "mes";
        } else if (dateRange.startsWith("año")) {
          const [, year] = dateRange.match(/year=(\d+)/);
          params.year = year;
          params.range = "año";
        } else {
          params.range = dateRange.split("&")[0];
          if (dateRange.includes("start_date")) {
            params.start_date = dateRange.split("start_date=")[1].split("&")[0];
            params.end_date = dateRange.split("end_date=")[1];
          }
        }

        axios
          .get(urlDashboardFecha, {
            params: params,
          })
          .then((response) => {
            const rawData = response.data.volumen_por_fecha;

            // Step 1: Extract all unique exercise names
            if (rawData) {
              const allExercises = [
                //new Set([...]): Ensures that all exercise names are unique.
                ...new Set(rawData.map((item) => item.nombre).filter(Boolean)), //.filter(Boolean): Removes any null or undefined values from the array of exercise names.
                //... (spread operator): Converts the Set back into an array.
              ];

              //allExercises: Contains a list of all unique exercise names from the data.
              console.log("All exercises", allExercises);
              // Step 2: Initialize data for all dates
              const transformedData = rawData.reduce(
                (acc, { fecha, nombre, volumen }) => {
                  let dateEntry = acc.find((entry) => entry.fecha === fecha);
                  if (!dateEntry) {
                    dateEntry = { fecha };
                    acc.push(dateEntry);
                  }
                  //"Ejercicio Jalón en polea alta": 1530).
                  if (nombre) {
                    dateEntry[`Ejercicio ${nombre}`] = volumen;
                  }
                  return acc;
                },
                []
              );

              /* Transformed data 
              [{ fecha: "2024-12-05", "Ejercicio Jalón en polea alta": 1530 },
              { fecha: "2024-12-06", "Ejercicio Remo sentado en máquina": 2640 },]; */

              console.log("Partially Transformed Data:", transformedData);

              // Step 3: Fill missing exercises with 0 for all dates
              /* [{ fecha: "2024-12-05", "Ejercicio Jalón en polea alta": 1530, "Ejercicio Remo sentado en máquina": 0 },
              { fecha: "2024-12-06", "Ejercicio Jalón en polea alta": 2640, "Ejercicio Remo sentado en máquina": 2640 }];
              */
              const completedData = transformedData.map((entry) => {
                allExercises.forEach((exercise) => {
                  if (!entry[`Ejercicio ${exercise}`]) {
                    entry[`Ejercicio ${exercise}`] = 0; // Default missing exercises to 0
                  }
                });
                return entry;
              });
              console.log("Final Transformed Data for Chart:", completedData);
              setCharData(completedData);
            }
          });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
  };

  const handleVerHistorial = () => {
    const urlHistorial = "http://127.0.0.1:8000/historialCliente/";
    axios
      .get(urlHistorial, {
        params: {
          id_rutina: idRutina,
          id_cliente: idCliente,
          day: selectDay,
        },
      })
      .then((response) => {
        //Get detalles rutina
        if (response.data.historial) {
          setHistorial(response.data.historial);

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

  const getClients = async () => {
    const respuesta = await axios.get(url);
    if (Array.isArray(respuesta.data)) {
      setClients(respuesta.data);
    } else {
      console.error("Unexpected data format:", respuesta.data);
      setClients([]); // Maneja el caso donde la data no es un arreglo
    }
  };

  const getEjercicios = async () => {
    const respuesta = await axios.get(urlEjercicios);
    setEjercicios(respuesta.data);
  };

  const getRoutines = async () => {
    const respuesta = await axios.get(urlRoutine);
    setRoutines(respuesta.data);
    setFilteredRoutines(respuesta.data);
  };

  const getSeAsigna = async () => {
    const respuesta = await axios.get(urlSeAsigna);
    setSeAsigna(respuesta.data);
  };

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

  const handleSearchResults = (results) => {
    //4.-Actualiza los clientes con los resultados de las busquedas
    setClients(results);
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
    setRoutineTypeExercise("Informacion");
    setAssignRoutineType("Asignacion");
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
        //alert(JSON.stringify(response.data));
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

  //This is the way how it works

  //The value of each key is an array containing the sets for that exercise.
  //And basically we get the value of each exercise from the backend
  /* const sets = {
  1: [ { peso: 10, repeticiones: 12 }, { peso: 15, repeticiones: 10 } ],
  2: [ { peso: 20, repeticiones: 8 } ],
  3: [] // This exercise currently has no sets
}; */

  const handleSetChangeUpdate = (idEjercicio, setIndex, field, value) => {
    // Strip leading zeros by converting to a number and back to a string
    //const numericValue = value === "" ? 0 : parseInt(value, 10);

    // Update `sets` state
    setSets((prevSets) => {
      const updatedSets = { ...prevSets }; // Clone the previous state

      if (updatedSets[idEjercicio]) {
        // If the exercise exists in the state
        updatedSets[idEjercicio] = updatedSets[idEjercicio].map(
          (set, index) => {
            if (index === setIndex) {
              // If the current index matches the set we want to update
              return { ...set, [field]: value }; // Update the specific field (e.g., peso or repeticiones)
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
          return { ...routine, [field]: value }; // Update the specific field
        }

        return routine; // Leave other routines unchanged
      })
    );
  };

  // Edition function

  const handleAgregarProgreso = async () => {
    var allow = await allowActualizar(); // Wait for the result of allowActualizar
    const allWithData = verificarSetsBlancosProgreso();

    //alert(allow);
    if (allow === false) {
      if (!allWithData) {
        show_alerta(
          "Todos los sets deben tener peso y repeticiones",
          "warning"
        );
        return;
      }
      alert("Los datos son:" + JSON.stringify(rutinaCompletaCliente, null, 2));
      const urlUpdateRutinaAsignada =
        "http://127.0.0.1:8000/actualizarRutinaAsignada/";

      const updateData = rutinaCompletaCliente.map((routine) => ({
        id: routine.id,
        serie: parseInt(routine.serie),
        repeticiones: parseInt(routine.progresoReps),
        peso: parseInt(routine.progresoPeso),
        fecha: routine.fecha,
        dia: routine.dia,
        id_rutina: routine.id_rutina,
        id_ejercicio: routine.id_ejercicio,
        id_cliente: routine.id_cliente,
        notas: routine.notas,
        tiempoDescanso: routine.tiempoDescanso,
      }));

      // Send PUT request to the backend
      axios
        .put(urlUpdateRutinaAsignada, updateData)
        .then((response) => {
          show_alerta("Asignación realizada correctamente", "success");
          setShowModalRutinaEditar(false);
          setShowModalRutinasDisponibles(false);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((error) => {
          console.error("Error updating routines", error);
          show_alerta("Error al actualizar las rutinas", "danger");
        });
    } else {
      show_alerta(
        "No tiene permiso para agregar el progreso en este momento",
        "error"
      );
    }
  };

  const handleUpdateRutinaAsignda = async () => {
    const allow = await allowActualizar(); // Wait for the result of allowActualizar
    if (allow === true) {
      console.log(
        "Los datos son:" + JSON.stringify(rutinaCompletaCliente, null, 2)
      );
      const urlUpdateRutina = "http://127.0.0.1:8000/updateRutina/";

      const updateData = rutinaCompletaCliente.map((routine) => ({
        id: routine.id,
        serie: parseInt(routine.serie),
        repeticiones: parseInt(routine.repeticiones),
        peso: parseInt(routine.peso),
        fecha: routine.fecha,
        dia: routine.dia,
        id_rutina: routine.id_rutina,
        id_ejercicio: routine.id_ejercicio,
        id_cliente: routine.id_cliente,
      }));

      // Send PUT request to the backend
      axios
        .put(urlUpdateRutina, updateData)
        .then((response) => {
          show_alerta("Rutina actualizada con éxito", "success");
          setShowModalRutinaEditar(false);
          setShowModalRutinasDisponibles(false);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((error) => {
          console.error("Error updating routines", error);
          show_alerta("Error al actualizar las rutinas", "error");
        });
    } else {
      show_alerta(
        "No tienes permisos para editar la rutina en este momento",
        "error"
      );
    }
  };

  const handleAddSet = (exerciseId) => {
    // Clone the current sets state to avoid mutation
    setSets((prevSets) => {
      const updatedSets = { ...prevSets };

      // Check if the exercise already has sets
      if (updatedSets[exerciseId]) {
        // Add a new set with default values (adjust as necessary)
        const newSet = {
          serie: updatedSets[exerciseId].length + 1, // Default values for a new set
          repeticiones: 0,
          peso: 0,
        };
        updatedSets[exerciseId] = [...updatedSets[exerciseId], newSet]; // Append the new set
      } else {
        // If no sets exist for this exercise, create the first set
        updatedSets[exerciseId] = [{ serie: 1, repeticiones: 0, peso: 0 }]; // Default values for the first set
      }
      return updatedSets;
    });

    setRutinaCompletaCliente((prevRutinas) => {
      const newRoutine = {
        id_ejercicio: exerciseId,
        serie: sets[exerciseId].length + 1, //Depending on the width of the sets basically it will be the determinated serie
        repeticiones: 0,
        peso: 0,
        dia: selectDay,
        id_cliente: idCliente,
        id_rutina: idRutina,
      };
      return [...prevRutinas, newRoutine];
    });
  };

  const prepararDatos = () => {
    //Itera sobre cada excerciseId en la lista
    //Se obtiene una lista de todos los excerciseId
    let data = [];

    Object.keys(sets).forEach((exerciseId) => {
      //alert(notas[exerciseId]);
      //alert(restTime[exerciseId]);
      sets[exerciseId].forEach((set) => {
        data.push({
          routineId: idRutina,
          exerciseId: exerciseId,
          clientId: idCliente,
          set: set.set,
          reps: set.reps,
          weight: set.weight,
          day: selectDay,
          notas: notas[exerciseId] || "",
          tiempoDescanso: restTime[exerciseId] || 0,
        });
      });
    });
    return data;
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

  const verificarSetsBlancosProgreso = () => {
    return !Object.keys(sets).some((exerciseId) => {
      alert(JSON.stringify(sets[exerciseId], null, 2));
      return sets[exerciseId].some((set) => {
        return (
          !("progresoReps" in set) || // Check if "reps" key is missing
          !("progresoPeso" in set) || // Check if "weight" key is missing
          set.progresoReps === "" ||
          set.progresoReps === null || // Check if "reps" is empty
          set.progresoPeso === "" ||
          set.progresoPeso === null // Check if "weight" is empty
        );
      });
    });
  };

  const handleAsignarRutina = () => {
    const datos = prepararDatos();
    const allWithData = verificarSetsBlancos();

    if (!allWithData) {
      show_alerta("Todos los sets deben tener peso y repeticiones", "warning");
      return;
    }

    /*console.log(
      "Los datos asignados a la rutina son:" + JSON.stringify(datos, null, 2)
    );*/
    const urlAsignarRutina = "http://127.0.0.1:8000/asignarRutina/";
    //console.log(JSON.stringify(datos, null, 2));

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

  const handleOpenSideBar = () => {
    setIsOpen(!isOpen);
  };

  //id_cliente = request.query_params.get('id_cliente')
  //dia = request.query_params.get('dia')
  //id_rutina = request.query_params.get('id_rutina')

  const handleLlenarCamposRutinaEjercicio = (id_rutina, opcion) => {
    setIdRutina(id_rutina);
    let cont = 0;
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
        console.log("Los sets son:" + JSON.stringify(response.data, null, 2));
        //alert(JSON.stringify(response.data, null, 2));
        setRutinaCompletaCliente(response.data.asignas);
        setImagenes(response.data.imagenes);
        setEjerciciosIds(response.data.ejerciciosIds);
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

        //alert(JSON.stringify(response.data.ejerciciosIds, null, 2));
        setNombresEjercicios(response.data.nombresEjercicios);
        if (opcion === 1) {
          setShowModallFullRoutine(true);
        } else if (opcion === 2) {
          setShowModalRutinaEditar(true);
        }
        const setsData = response.data.sets || {};
        setSets(setsData);
        //alert(JSON.stringify(setsData));
        console.log(
          JSON.stringify("Los sets son:" + response.data.sets, null, 2)
        );
      });
  };

  const handleShowModalEliminar = (id_rutina) => {
    setIdRutina(id_rutina);
    setShowModalRutinaEliminar(true);
  };

  //Eliminar rutina -> Falta enviar el id del cliente como parámetro para eliminar la rutina asignada
  const handleEliminarRutinaAsignada = () => {
    allowEliminar();
    //if (allowDelete === true) {
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
    /*} else {
      show_alerta("No tiene permiso para eliminar la rutina", "error");
    }*/
  };

  const handleDeleteSet = (exerciseId, setIndex) => {
    // Clone the current state to avoid mutation
    const updatedSets = { ...sets };
    // Remove the set at the specified index
    updatedSets[exerciseId] = updatedSets[exerciseId].filter(
      (_, index) => index !== setIndex
    );
    // Update the state with the modified sets
    setSets(updatedSets);
    // Update rutinaCompletaCliente, removing the corresponding set
    setRutinaCompletaCliente((prevRutinaCompletaCliente) =>
      prevRutinaCompletaCliente.filter(
        (routine) =>
          !(
            (
              routine.id_ejercicio === exerciseId &&
              routine.serie === setIndex + 1
            ) // Adjust for zero-based index
          )
      )
    );
    console.log(JSON.stringify(rutinaCompletaCliente), null, 2);
  };

  const handleDeleteProgressSet = async (opcion, exerciseId, setIndex) => {
    var allow = await allowActualizar(); // Wait for the result of allowActualizar
    alert(opcion);
    alert(allow);
    if ((opcion === 1 && allow === false) || (opcion === 2 && allow === true)) {
      console.log("Deleting set:", { opcion, exerciseId, setIndex });

      const routine = sets[exerciseId];
      if (!routine || !routine[setIndex]) {
        console.warn("Set not found. Check exerciseId and setIndex.");
        return;
      }

      const deletedSet = routine[setIndex];

      // DELETE request to the backend
      const url = `http://127.0.0.1:8000/eliminarSets/`;

      axios
        .delete(url, {
          data: {
            id: deletedSet.id, // Assuming the set has an "id" field
            id_ejercicio: exerciseId,
            serie: deletedSet.serie,
          },
        })
        .then((response) => {
          console.log("Set deleted successfully:", response.data);

          // Update the frontend state after successful deletion
          setSets((prevSets) => {
            const updatedSets = { ...prevSets };
            updatedSets[exerciseId] = routine.filter(
              (_, index) => index !== setIndex
            );
            if (updatedSets[exerciseId].length === 0) {
              delete updatedSets[exerciseId]; // Remove empty exercises
            }
            return updatedSets;
          });
        })
        .catch((error) => {
          console.error("Error deleting set:", error);
        });
    } else {
      show_alerta("No se puede eliminar el set", "error");
    }
  };

  const handleMostrarInstruccionesEjercicio = (id_ejercicio) => {
    const ejercicio = ejercicios.find(
      (ejercicio) => parseInt(ejercicio.id_ejercicio) === parseInt(id_ejercicio)
    );
    setIdEjercicio(id_ejercicio);
    //alert(id_ejercicio);
    setEjercicioInstrucciones(ejercicio);
    setShowModalEjerciciosInstrucciones(true);
  };

  const handleCloseModalEjerciciosInstrucciones = () => {
    setRoutineTypeExercise("Informacion");
    setAssignRoutineType("Asignacion");
    setShowModalEjerciciosInstrucciones(false);
  };

  // Helper function to get the current Monday
  function getCurrentMonday() {
    const today = new Date(); // Wed Nov 22 2024
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const monday = new Date(today); //Creates a copy of the today date
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); //today.getDate() gives the day of the month (e.g., 22 for 2024-11-22).
    return monday;
  }

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Return "YYYY-MM-DD"
  };

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

  // Adjust the current month by +/-1 (next/previous month)
  const adjustMonth = (direction) => {
    const newDate = new Date(startDate);
    newDate.setMonth(newDate.getMonth() + direction);

    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const year = newDate.getFullYear();

    setStartDate(newDate);
    setDateRange(`mes&month=${month}&year=${year}`);
  };

  // Adjust the current year by +/-1 (next/previous year)
  const adjustYear = (direction) => {
    const newDate = new Date(startDate);
    newDate.setFullYear(newDate.getFullYear() + direction);

    const year = newDate.getFullYear();

    setStartDate(newDate);
    setDateRange(`año&year=${year}`);
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
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = formatLocalDate(yesterday);

    //if (dateRange === "esta semana") return "Esta semana";
    //if (dateRange === "semana pasada") return "Semana pasada";

    if (dateRange.startsWith("mes")) {
      const [, month, year] = dateRange.match(/mes&month=(\d+)&year=(\d+)/);
      const date = new Date(year, month - 1);
      return date.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      });
    }

    if (dateRange.startsWith("año")) {
      const [, year] = dateRange.match(/año&year=(\d+)/);
      return `Año ${year}`; // Display "Año YYYY"
    }

    if (dateRange.startsWith("custom")) return formatWeekRange();

    return "Esta semana";
  };

  const handleDateRangeChange = (range) => {
    const today = new Date();
    switch (range) {
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

  const allowEliminar = () => {
    //alert(idCliente);
    //alert(idRutina);
    axios
      .get(urlAllowEliminar, {
        params: {
          id_cliente: idCliente,
          id_rutina: idRutina,
        },
      })
      .then((response) => {
        setAllowDelete(response.data.allow);
      })
      .catch((error) => {
        console.error("Error al obtener la información", error);
      });
  };

  const allowActualizar = async () => {
    try {
      const response = await axios.get(urlAllowUpdate, {
        params: {
          id_cliente: idCliente,
          id_rutina: idRutina,
        },
      });
      setAllowUpdate(response.data.allow); // Update state (optional if you need it elsewhere)
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
    setNotas((prevNotas) => ({
      ...prevNotas,
      [id_ejercicio]: value,
    }));
  };

  const handleNotasChangeUpdate = (id_ejercicio, value) => {
    setAllNotas((prevNotas) => ({
      ...prevNotas,
      [id_ejercicio]: value,
    }));

    setRutinaCompletaCliente((prevRutinas) =>
      prevRutinas.map((rutina) => {
        if (rutina.id_ejercicio === id_ejercicio) {
          return { ...rutina, notas: value };
        }
        return rutina;
      })
    );
  };

  const handleDescansoChangeUpdate = (id_ejercicio, value) => {
    setAllDescansos((prevDescansos) => ({
      ...prevDescansos,
      [id_ejercicio]: value,
    }));

    setRutinaCompletaCliente((prevRutinas) =>
      prevRutinas.map((rutina) => {
        if (rutina.id_ejercicio === id_ejercicio) {
          return { ...rutina, tiempoDescanso: value };
        }
        return rutina;
      })
    );
  };

  const handleDescansoChange = (id_ejercicio, value) => {
    setRestTime((prevTime) => ({
      ...prevTime,
      [id_ejercicio]: value,
    }));
  };

  return (
    <div>
      <NavScrollExample
        onSearchResults={handleSearchResults}
        onLogout={handleCerrarSesion}
        showWeekDays={showWeekDays}
        showTableRoutines={showTableRoutines}
      />
      <Sidebar isOpen={isOpen} toggleSideBar={handleOpenSideBar} />
      {!showWeekDays && !showTableRoutines && (
        <Container className="mt-5">
          <Row>
            <Col md={2} className="d-none d-md-block">
              {" "}
              <Sidebar />
            </Col>
            <Col md={{ span: 12, offset: 1 }}>
              {/*<div className="main-content">
                <div className="panel-heading"></div>
                <Row>
                  <h3 className="w-100 text-center">Lista de Clientes</h3>
                </Row> 
              </div>*/}

              <div className="main-content" style={{ marginRight: "50px" }}>
                <Row className={styles.cardContainer}>
                  {Array.isArray(clients) && clients.length > 0 ? (
                    clients
                      .filter(
                        (client) =>
                          parseInt(client.id_entrenador) ===
                            parseInt(idEntrenador) && client.borrado !== true
                      )
                      .map((client) => (
                        <Col md={3} key={client.id_cliente} className="mb-4">
                          <Card className={styles.card}>
                            <Card.Img
                              variant="top"
                              src={
                                client.imagen !== null
                                  ? client.imagen
                                  : "https://previews.123rf.com/images/metelsky/metelsky1809/metelsky180900233/109815470-man-avatar-profile-male-face-icon-vector-illustration.jpg"
                              }
                              style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                margin: "0 auto",
                                display: "block",
                                border: "4px solid #f1f1f1",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            ></Card.Img>
                            <Card.Body className={styles.cardBody}>
                              <Card.Title className={styles.cardTitle}>
                                {client.nombre} {client.apellido}
                              </Card.Title>
                              <Card.Text className={styles.cardText}>
                                <Card.Text>{client.email}</Card.Text>
                                <div className={styles.buttonGroup}>
                                  <div className="d-flex flex-column gap-2">
                                    <Button
                                      variant="primary"
                                      className={styles.showWeekDaysButton}
                                      onClick={() =>
                                        handleShowWeekDays(client.id_cliente)
                                      }
                                    >
                                      <FontAwesomeIcon icon={faClipboardList} />{" "}
                                      Control de rutinas
                                    </Button>
                                    <Button
                                      variant="primary"
                                      className={styles.showWeekDaysButton}
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
                    <Row className="justify-content-start">
                      <Col xs={12} md={6} className="ms-md-4">
                        <p
                          style={{ marginLeft: "15px", marginRight: "auto" }}
                          className="mb-0"
                        >
                          No hay clientes disponibles
                        </p>
                      </Col>
                    </Row>
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
            <Col md={10}>
              <center>
                <h3 className="mt-4">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> Plan
                  de rutina semanal
                </h3>
              </center>

              <WeeklyRoutinePlan
                assignedRoutines={todasRutinasCliente.rutinas}
                onSelectAssignedRoutines={handleShowRutinasAsignadas}
                idCliente={idCliente}
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
          <Modal.Title className="w-100 text-center">
            Rutinas disponibles para asignar
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex justify-content-center gap-3 mb-4">
            {/* Button for "Creada" */}
            <Button
              variant={routineType === "Creada" ? "primary" : "outline-primary"}
              className={`filter-button ${
                routineType === "Creada" ? "active" : ""
              } me-4 fw-bold btn-responsive`}
              onClick={() => setRoutineType("Creada")}
            >
              Creadas
            </Button>
            {/* Button for "Cátalogo" */}
            <Button
              variant={
                routineType === "Catalogo" ? "primary" : "outline-primary"
              }
              className={`filter-button ${
                routineType === "Catalogo" ? "active" : ""
              } me-4 fw-bold btn-responsive`}
              onClick={() => setRoutineType("Catalogo")}
            >
              Catálogo
            </Button>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />
          {/*Filter buttons*/}
          <div className="d-flex justify-content-center gap-3 mb-4"></div>

          <div className="panel-body">
            <Row className="g-4">
              {filteredRoutines
                .filter(
                  (routine) =>
                    (parseInt(routine.id_entrenador) ===
                      parseInt(idEntrenador) &&
                      routineType === "Creada" &&
                      routine.tipo === "Creada") ||
                    (parseInt(routine.id_entrenador) === 1 &&
                      routineType === "Catalogo" &&
                      routine.tipo === "Catalogo")
                )
                .filter((routine) => !foundRoutineIds.has(routine.id_rutina))
                .map((routine) => {
                  //Find the corresponding image
                  const matchingImage = imagenesCatalogo.find(
                    (imagen) => imagen.id_rutina === routine.id_rutina
                  );
                  return (
                    <Col
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      key={routine.id_rutina}
                      className="d-flex align-items-stretch"
                    >
                      <Card className="h-100">
                        {/* Card Image */}
                        {matchingImage && (
                          <Card.Img
                            variant="top"
                            src={matchingImage.url}
                            alt={`Imagen de rutina ${routine.id_rutina}`}
                            style={{
                              objectFit: "cover", // This is correct.
                              height: "280px",
                            }}
                          />
                        )}
                        {/* Card Body */}
                        <CardBody>
                          <Card.Title>{routine.nombre}</Card.Title>
                          <Card.Text>{routine.descripcion}</Card.Text>
                          <Card.Text>
                            <Card.Text>
                              <strong>Enfoque: </strong>
                              {routine.enfoque.toLowerCase()}
                            </Card.Text>
                            <Button
                              variant="primary"
                              className="me-4 fw-bold gradient-primary btn-responsive"
                              onClick={() =>
                                handleLlenarCamposRutina(routine.id_rutina, 1)
                              }
                            >
                              <FontAwesomeIcon icon={faEye} /> Ver rutina
                            </Button>
                            <Button
                              variant="success"
                              className="me-2 fw-bold gradient-success btn-responsive"
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
                  );
                })}
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
          <Modal.Title className="w-100 text-center">
            Rutinas del día {selectDay}
          </Modal.Title>
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
                        <Card.Text>
                          <strong>Enfoque: </strong>
                          {routine.enfoque.toLowerCase()}
                        </Card.Text>
                        <div className="w-100 d-flex justify-content-center">
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
                            />{" "}
                            {/*Progreso*/}
                          </Button>
                          <Button
                            variant="danger"
                            className="me-2"
                            onClick={() =>
                              handleShowModalEliminar(routine.id_rutina)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="icon"
                            />{" "}
                            {/*Eliminar*/}
                          </Button>
                          <Button
                            variant="primary"
                            className="me-2"
                            onClick={() =>
                              handleLlenarCamposRutinaEjercicio(
                                routine.id_rutina,
                                2
                              )
                            }
                          >
                            <FontAwesomeIcon
                              icon={faPencilAlt}
                              className="icon"
                            />{" "}
                            {/*Editar*/}
                          </Button>
                        </div>
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
          <Modal.Title className="w-100 text-center">
            {nombreRutina}
          </Modal.Title>
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
                      <Card.Title className="text-dark">
                        {selectedEjercicio.nombre}
                      </Card.Title>
                      <Card.Text className="text-muted">
                        {selectedEjercicio.descripcion}
                      </Card.Text>
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
        className="asignar-rutina-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Asignar rutina
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="w-100 text-center">{descripcionRutina}</p>
          <Row>
            {selectedEjercicios.map((selectedEjercicio, index) => (
              <Col
                md={12}
                key={selectedEjercicio.id_ejercicio}
                className="mb-4"
              >
                {/* Workout Timer and Notes Section */}
                <div
                  className="d-flex justify-content-between align-items-center mb-3"
                  style={{
                    flexGrow: 1,
                    marginRight: "15px", // Add space between the inputs
                  }}
                >
                  <FontAwesomeIcon icon={faBook} className="me-2" />
                  <Form.Control
                    type="text"
                    placeholder="Notas"
                    // value={notas[selectedEjercicio.id_ejercicio] || ""} // Controlled input
                    onChange={(e) =>
                      handleNotasChange(
                        selectedEjercicio.id_ejercicio,
                        e.target.value
                      )
                    }
                  />
                  {/*<Button variant="primary">Finalizar</Button>*/}
                </div>
                {/* Exercise List */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <FontAwesomeIcon icon={faClock} className="me-2" />
                  <Form.Control
                    type="number"
                    id="restTime"
                    placeholder="Tiempo de descanso (segundos)"
                    style={{
                      width: "80px", // Keep the input narrow
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      textAlign: "center", // Center-align text
                      fontSize: "14px",
                    }}
                    onChange={(e) =>
                      handleDescansoChange(
                        selectedEjercicio.id_ejercicio,
                        e.target.value
                      )
                    }
                  />
                </div>
                <Card className="shadow-sm d-flex align-items-center mb-2">
                  {/* Exercise Image */}
                  <Card.Img
                    variant="top"
                    src={selectedEjercicio.imagen}
                    style={{
                      borderRadius: "50%",
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      margin: "0 auto ",
                    }} // To make the image rounded
                  ></Card.Img>
                  {/* Exercise Name */}
                  <h5 className="text-primary m-0 w-100 text-center">
                    {selectedEjercicio.nombre} ({index + 1})
                  </h5>

                  <Card.Body>
                    <Card.Text>{selectedEjercicio.descripcion}</Card.Text>
                    {/*Set e index se recorren al mismo tiempo*/}
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>SET</th>
                            <th>KG</th>
                            <th>REPETICIONES</th>
                            <th>ACCION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sets[selectedEjercicio.id_ejercicio]?.map(
                            (set, index) => (
                              <tr key={index} className="mb-3">
                                <td>{index + 1}</td>

                                <td>
                                  {" "}
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
                                </td>

                                {/* REPETICIONES Input */}
                                <td>
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
                                </td>
                                {/* Delete Button */}
                                <td>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="btn-delete-set text-center fw-bold "
                                    onClick={() =>
                                      handleDeleteSet(
                                        selectedEjercicio.id_ejercicio,
                                        index
                                      )
                                    }
                                    style={{
                                      width: "36px", // Ensures it's square
                                      height: "36px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderRadius: "50%", // Circular shape
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </td>
                              </tr>
                            )
                          )}
                          <tr>
                            <td colSpan="5" className="text-center">
                              {" "}
                              <Button
                                variant="link"
                                onClick={() =>
                                  handleAddSet(selectedEjercicio.id_ejercicio)
                                }
                              >
                                AGREGAR SET
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-responsive w-100 px-4 py-2 fw-bold gradient-primary"
            variant="primary"
            onClick={() => handleAsignarRutina()}
          >
            Finalizar
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Editar Rutina*/}
      <Modal
        show={showModalRutinaEditar}
        onHide={() => setShowModalRutinaEditar(false)}
        centered
        className="asignar-rutina-modal h-100 custom-modal-size"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">Editar rutina</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Exercise List */}
          {imagenes.map((imagen, imgIndex) => {
            const ejercicioId = ejerciciosIds[imgIndex]; // Extract exercise ID
            const routine = sets[ejercicioId] || []; // Safely access sets for the exercise

            return (
              <Col key={imgIndex} md={12} className="mb-4">
                {/* Trainer Notes */}
                <div className="mb-4 p-3 border rounded shadow-sm">
                  {" "}
                  <h5
                    className="text-primary mb-3 text-center d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowTrainerSection(!showTrainerSection)}
                  >
                    Tus notas y tiempo de descanso
                    <FontAwesomeIcon
                      icon={showTrainerSection ? faChevronUp : faChevronDown}
                    />
                  </h5>
                  {showTrainerSection && (
                    <div className="d-flex justify-content-between align-items-center">
                      {/* Trainer Notes */}
                      <div
                        className="d-flex align-items-center"
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
                          onChange={(e) =>
                            handleNotasChangeUpdate(ejercicioId, e.target.value)
                          }
                          style={{ resize: "none" }}
                        />
                        {/*<Button variant="primary">Finalizar</Button>*/}
                      </div>
                      {/* Trainer Rest Time */}
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                        <Form.Control
                          type="number"
                          id="restTime"
                          placeholder="Tiempo de descanso (minutos)"
                          value={allDescansos[ejercicioId] || ""}
                          style={{
                            width: "80px", // Keep the input narrow
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            textAlign: "center", // Center-align text
                            fontSize: "14px",
                          }}
                          onChange={(e) =>
                            handleDescansoChangeUpdate(
                              ejercicioId,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mb-4 p-3 border rounded shadow-sm bg-light">
                  <h5
                    className="text-primary mb-3 text-center d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowClientSection(!showClientSection)}
                  >
                    Notas cliente y tiempo descanso
                    <FontAwesomeIcon
                      icon={showClientSection ? faChevronUp : faChevronDown}
                    />
                  </h5>
                  {showClientSection && (
                    <div className="d-flex justify-content-between align-items-center">
                      <div
                        className="d-flex align-items-center"
                        style={{
                          flexGrow: 1,
                          marginRight: "15px", // Add space between the inputs
                        }}
                      >
                        <FontAwesomeIcon icon={faBook} className="me-2" />
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Sin notas que mostrar"
                          value={allNotasProgreso[ejercicioId] || ""} // Controlled input
                          readOnly
                          onChange={(e) =>
                            handleNotasChangeUpdate(ejercicioId, e.target.value)
                          }
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
                          onChange={(e) =>
                            handleDescansoChangeUpdate(
                              ejercicioId,
                              e.target.value
                            )
                          }
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
                            <th>KG</th>
                            <th>REPETICIONES</th>
                            <th>ACCION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {routine.map((set, setIndex) => (
                            <tr key={setIndex}>
                              <td
                                style={{
                                  color: "blue",
                                }}
                              >
                                {setIndex + 1}
                              </td>
                              <td>{set.peso + "kg x " + set.repeticiones}</td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={set.peso || ""}
                                  onChange={(e) =>
                                    handleSetChangeUpdate(
                                      ejercicioId,
                                      setIndex,
                                      "peso",
                                      e.target.value
                                    )
                                  }
                                  className="text-center"
                                />
                              </td>

                              <td>
                                <Form.Control
                                  type="number"
                                  value={set.repeticiones || ""}
                                  onChange={(e) =>
                                    handleSetChangeUpdate(
                                      ejercicioId,
                                      setIndex,
                                      "repeticiones",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              <td>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteProgressSet(
                                      2,
                                      ejercicioId,
                                      setIndex
                                    )
                                  }
                                  style={{
                                    width: "36px", // Ensures it's square
                                    height: "36px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "50%", // Circular shape
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan="5" className="text-center">
                              <Button
                                variant="link"
                                onClick={() => handleAddSet(ejercicioId)}
                              >
                                AGREGAR SET
                              </Button>
                            </td>
                          </tr>
                        </tbody>
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
            onClick={() => handleUpdateRutinaAsignda()}
          >
            {/*Finalizar2*/}
            Finalizar
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Modal mostrar rutina completa asignada --sirve para editar la rutina-- */}

      <Modal
        show={showModalFullRoutine}
        onHide={() => handleCloseModalAsignarRuitina()}
        centered
        className="asignar-rutina-modal h-100 custom-modal-size"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Rutina asignada
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Workout Timer and Notes Section */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            {/* Navigation */}

            {/* Button for "Creada" */}
            <Button
              variant={
                AssignRoutineType === "Asignacion"
                  ? "primary"
                  : "outline-primary"
              }
              className={`filter-button ${
                AssignRoutineType === "Asignacion" ? "active" : ""
              } me-4 fw-bold btn-responsive`}
              onClick={() => setAssignRoutineType("Asignacion")}
            >
              Asignación
            </Button>
            {/* Button for "Creada" */}
            <Button
              variant={
                AssignRoutineType === "Historial"
                  ? "primary"
                  : "outline-primary"
              }
              className={`filter-button ${
                AssignRoutineType === "Historial" ? "active" : ""
              } me-4 fw-bold btn-responsive`}
              onClick={() => setAssignRoutineType("Historial")}
            >
              Historial
            </Button>
            {/* Button for "Cátalogo" */}
            <Button
              variant={
                AssignRoutineType === "Progreso" ? "primary" : "outline-primary"
              }
              className={`filter-button ${
                AssignRoutineType === "Progreso" ? "active" : ""
              } me-4 fw-bold btn-responsive`}
              onClick={() => setAssignRoutineType("Progreso")}
            >
              Progreso
            </Button>
          </div>

          {AssignRoutineType === "Historial" &&
            (historial && historial.length > 0 ? (
              <>
                {/* Filter by Month */}
                <Row className="mb-4">
                  <Form.Label>Filtrar por mes</Form.Label>
                  <Col xs={8} md={10}>
                    <Form.Control
                      type="month"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="w-100 mb-3"
                      placeholder="Selecciona un mes"
                    />
                  </Col>
                  <Col xs={4} md={2} className="py-1">
                    <Button variant="primary" onClick={handleSearch}>
                      <FontAwesomeIcon icon={faSearch} className="icon" />
                    </Button>
                  </Col>
                </Row>

                {/* Historical Data */}
                {historial.map((entry, index) => (
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
                          </div>
                        </Card.Footer>
                      </Card>
                    ))}
                  </Col>
                ))}
              </>
            ) : (
              <>
                <Row className="mb-4">
                  <Form.Label>Filtrar por mes</Form.Label>
                  <Col xs={8} md={10}>
                    <Form.Control
                      type="month"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="w-100 mb-3"
                      placeholder="Selecciona un mes"
                    />
                  </Col>
                  <Col xs={4} md={2} className="py-1">
                    <Button variant="primary" onClick={handleSearch}>
                      <FontAwesomeIcon icon={faSearch} className="icon" />
                    </Button>
                  </Col>
                </Row>
                <p className="w-100 text-center">
                  No hay historial para mostrar
                </p>
              </>
            ))}

          {AssignRoutineType === "Progreso" && (
            <div className="chart-container">
              {/* Section Title */}
              <h5 className="text-center mb-4">Progreso de Ejercicios</h5>

              {/* Navigation Controls */}
              <div className="navigation-controls">
                {/* Weekly Navigation */}
                <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                  <Button
                    variant="outline-primary"
                    onClick={() => adjustWeek(-1)}
                    style={{ minWidth: "160px" }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} /> Semana anterior
                  </Button>
                  <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                      {getDropDownLabel()}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => handleDateRangeChange("esta semana")}
                      >
                        Esta semana
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleDateRangeChange("semana pasada")}
                      >
                        Semana pasada
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button
                    variant="outline-primary"
                    onClick={() => adjustWeek(1)}
                    style={{ minWidth: "180px" }}
                  >
                    Semana siguiente <FontAwesomeIcon icon={faChevronRight} />
                  </Button>
                </div>

                {/* Monthly and Yearly Navigation */}
                <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
                  <Button
                    variant="outline-primary"
                    onClick={() => adjustMonth(-1)}
                    style={{ minWidth: "135px" }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} /> Mes anterior
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => adjustMonth(1)}
                    style={{ minWidth: "143px" }}
                  >
                    Mes siguiente <FontAwesomeIcon icon={faChevronRight} />
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => adjustYear(-1)}
                    style={{ minWidth: "143px" }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} /> Año anterior
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => adjustYear(1)}
                    style={{ minWidth: "143px" }}
                  >
                    Año siguiente <FontAwesomeIcon icon={faChevronRight} />
                  </Button>
                </div>
              </div>

              {/* Chart */}
              <ResponsiveContainer width="100%" height={500}>
                <LineChart data={charData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.keys(charData[0] || {})
                    .filter((key) => key.startsWith("Ejercicio"))
                    .map((key, index) => (
                      <Line
                        key={key}
                        dataKey={key}
                        name={key}
                        stroke={["#8884d8", "#82ca9d", "#ffc658"][index % 3]} // Color selection
                      />
                    ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Exercise List */}

          {AssignRoutineType === "Asignacion" &&
            imagenes.map((imagen, imgIndex) => {
              const ejercicioId = ejerciciosIds[imgIndex]; // Extract exercise ID
              const routine = sets[ejercicioId] || []; // Safely access sets for the exercise

              return (
                <Col
                  key={`${ejercicioId}-${imgIndex}`}
                  md={12}
                  className="mb-4"
                >
                  <div className="mb-4 p-3 border rounded shadow-sm">
                    {" "}
                    <h5
                      className="text-primary mb-3 text-center d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowTrainerSection(!showTrainerSection)}
                    >
                      Tus notas y tiempo de descanso
                      <FontAwesomeIcon
                        icon={showTrainerSection ? faChevronUp : faChevronDown}
                      />
                    </h5>
                    {showTrainerSection && (
                      <div className="d-flex justify-content-between align-items-center">
                        {/* Trainer Notes */}
                        <div
                          className="d-flex align-items-center"
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
                            onChange={(e) =>
                              handleNotasChangeUpdate(
                                ejercicioId,
                                e.target.value
                              )
                            }
                            style={{ resize: "none" }}
                          />
                          {/*<Button variant="primary">Finalizar</Button>*/}
                        </div>
                        {/* Trainer Rest Time */}
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faClock} className="me-2" />
                          <Form.Control
                            type="number"
                            id="restTime"
                            placeholder="Tiempo de descanso (minutos)"
                            value={allDescansos[ejercicioId] || ""}
                            style={{
                              width: "80px", // Keep the input narrow
                              padding: "8px",
                              border: "1px solid #ccc",
                              borderRadius: "5px",
                              textAlign: "center", // Center-align text
                              fontSize: "14px",
                            }}
                            onChange={(e) =>
                              handleDescansoChangeUpdate(
                                ejercicioId,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Client Notes and Rest Time Section */}

                  <div className="mb-4 p-3 border rounded shadow-sm bg-light">
                    <h5
                      className="text-primary mb-3 text-center d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowClientSection(!showClientSection)}
                    >
                      Notas cliente y tiempo descanso1
                      <FontAwesomeIcon
                        icon={showClientSection ? faChevronUp : faChevronDown}
                      />
                    </h5>
                    {showClientSection && (
                      <div className="d-flex justify-content-between align-items-center">
                        <div
                          className="d-flex align-items-center"
                          style={{
                            flexGrow: 1,
                            marginRight: "15px", // Add space between the inputs
                          }}
                        >
                          <FontAwesomeIcon icon={faBook} className="me-2" />
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Sin notas que mostrar"
                            value={allNotasProgreso[ejercicioId] || ""} // Controlled input
                            readOnly
                            onChange={(e) =>
                              handleNotasChangeUpdate(
                                ejercicioId,
                                e.target.value
                              )
                            }
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
                            onChange={(e) =>
                              handleDescansoChangeUpdate(
                                ejercicioId,
                                e.target.value
                              )
                            }
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
                              <th>KG</th>
                              <th>REPETICIONES</th>
                              <th>ACCION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {routine.map((set, setIndex) => (
                              <tr key={setIndex}>
                                <td style={{ color: "blue" }}>
                                  {setIndex + 1}
                                </td>
                                <td>{set.peso + "kg x " + set.repeticiones}</td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    value={set.progresoPeso ?? ""}
                                    onChange={(e) =>
                                      handleSetChangeUpdate(
                                        ejercicioId,
                                        setIndex,
                                        "progresoPeso",
                                        e.target.value
                                      )
                                    }
                                    className="text-center"
                                  />
                                </td>

                                <td>
                                  <Form.Control
                                    type="number"
                                    value={set.progresoReps ?? ""} // Preserve progresoReps; fallback to repeticiones
                                    onChange={(e) =>
                                      handleSetChangeUpdate(
                                        ejercicioId,
                                        setIndex,
                                        "progresoReps",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteProgressSet(
                                        1,
                                        ejercicioId,
                                        setIndex
                                      )
                                    }
                                    style={{
                                      width: "36px", // Ensures it's square
                                      height: "36px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderRadius: "50%", // Circular shape
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan="5" className="text-center">
                                <Button
                                  variant="link"
                                  onClick={() => handleAddSet(ejercicioId)}
                                >
                                  AGREGAR SET
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Modal.Body>

        {AssignRoutineType === "Asignacion" && (
          <Modal.Footer>
            <Button
              className="btn-responsive w-100 px-4 py-2 fw-bold gradient-primary"
              variant="primary"
              onClick={handleAgregarProgreso}
            >
              {/*Finalizar2 rutina asignada*/}
              Finalizar
            </Button>
          </Modal.Footer>
        )}
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
      {/*Modal instrucciones ejercicio*/}
      <Modal
        show={showModalEjerciciosInstrucciones}
        onHide={() => handleCloseModalEjerciciosInstrucciones()}
        centered
        className="asignar-rutina-modal h-100 custom-modal-size"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            {ejercicioInstrucciones?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-100 text-center">
            {" "}
            <Button
              variant={
                routineTypeExercise === "Informacion"
                  ? "primary"
                  : "outline-primary"
              }
              className={`filter-button ${
                routineTypeExercise === "Informacion" ? "active" : ""
              } me-4 fw-bold btn-responsive`}
              onClick={() => setRoutineTypeExercise("Informacion")}
            >
              Información
            </Button>
            {/* Button for "Cátalogo" */}
            <Button
              variant={
                routineTypeExercise === "Progreso"
                  ? "primary"
                  : "outline-primary"
              }
              className={`filter-button ${
                routineTypeExercise === "Progreso" ? "active" : ""
              } me-4 fw-bold btn-responsive`}
              onClick={() => setRoutineTypeExercise("Progreso")}
            >
              Progreso
            </Button>
          </div>
          {routineTypeExercise === "Informacion" && (
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
          )}
        </Modal.Body>
        <Modal.Footer>
          {/*<Button
              variant="secondary"
              onClick={() => setShowModalEjerciciosInstrucciones(false)}
            >
              Cerrar
            </Button>*/}
        </Modal.Footer>

        {routineTypeExercise === "Progreso" && (
          <div className="chart-container">
            {/* Section Title */}

            <h5 className="text-center mb-4">Progreso de Ejercicios</h5>

            {/* Navigation Controls */}
            <div className="navigation-controls">
              <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                <Button
                  variant="outline-primary"
                  onClick={() => adjustWeek(-1)}
                  style={{ minWidth: "160px" }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} /> Semana anterior
                </Button>
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {getDropDownLabel()}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleDateRangeChange("esta semana")}
                    >
                      Esta semana
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleDateRangeChange("semana pasada")}
                    >
                      Semana pasada
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button
                  variant="outline-primary"
                  onClick={() => adjustWeek(1)}
                  style={{ minWidth: "180px" }}
                >
                  Semana siguiente <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </div>

              {/* Monthly and Yearly Navigation */}
              <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
                <Button
                  variant="outline-primary"
                  onClick={() => adjustMonth(-1)}
                  style={{ minWidth: "135px" }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} /> Mes anterior
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => adjustMonth(1)}
                  style={{ minWidth: "143px" }}
                >
                  Mes siguiente <FontAwesomeIcon icon={faChevronRight} />
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => adjustYear(-1)}
                  style={{ minWidth: "143px" }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} /> Año anterior
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => adjustYear(1)}
                  style={{ minWidth: "143px" }}
                >
                  Año siguiente <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={600}>
              <LineChart data={charData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Line for Volumen */}
                <Line
                  type="monotone"
                  dataKey="Volumen"
                  name="Volumen Logrado"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                {/* Line for Asignado Volumen */}
                <Line
                  type="monotone"
                  dataKey="Asignado Volumen"
                  name="Volumen Asignado"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
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
                <div className="mb-4 p-3 border rounded shadow-sm">
                  {" "}
                  <h5
                    className="text-primary mb-3 text-center d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowTrainerSection(!showTrainerSection)}
                  >
                    Tus notas y tiempo de descanso
                    <FontAwesomeIcon
                      icon={showTrainerSection ? faChevronUp : faChevronDown}
                      className="d-flex align-items-center me-2"
                    />
                  </h5>
                  {showTrainerSection && (
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
                          onChange={(e) =>
                            handleNotasChangeUpdate(ejercicioId, e.target.value)
                          }
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
                          style={{
                            width: "80px", // Keep the input narrow
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            textAlign: "center", // Center-align text
                            fontSize: "14px",
                          }}
                          onChange={(e) =>
                            handleDescansoChangeUpdate(
                              ejercicioId,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Workout Timer and Notes Section */}
                <div className="mb-4 p-3 border rounded shadow-sm bg-light">
                  <h5
                    className="text-primary mb-3 text-center d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowClientSection(!showClientSection)}
                  >
                    Notas cliente y tiempo descanso
                    <FontAwesomeIcon
                      icon={showClientSection ? faChevronUp : faChevronDown}
                      className="d-flex align-items-center me-2"
                    />
                  </h5>

                  {showClientSection && (
                    <div className="d-flex justify-content-between align-items-center">
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
                          placeholder="Sin notas que mostrar"
                          value={allNotasProgreso[ejercicioId] || ""} // Controlled input
                          readOnly
                          onChange={(e) =>
                            handleNotasChangeUpdate(ejercicioId, e.target.value)
                          }
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
                          onChange={(e) =>
                            handleDescansoChangeUpdate(
                              ejercicioId,
                              e.target.value
                            )
                          }
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
                              <td style={{ color: "blue" }}>{setIndex + 1}</td>
                              <td>{set.asignado}</td>
                              <td>
                                {" "}
                                <Form.Control
                                  type="number"
                                  value={set.progresoPeso || 0}
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

export default AssignRoutines;
