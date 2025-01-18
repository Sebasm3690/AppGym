import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Dropdown,
} from "react-bootstrap";
import {
  faCoffee,
  faUtensils,
  faDrumstickBite,
  faChartPie,
  faPlusCircle,
  faSearch,
  faBreadSlice,
  faBacon,
  faEgg,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";
import Sidebar from "../Otros/sideBarAlimentos"; // Your sidebar component
import NavScrollExample from "../Otros/NavBarCliente"; // Your navbar component
import "./dashboardCalories.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale, // Register the category scale
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CaloriesDashboard = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable or fallback to localhost
  const [caloriesData, setCaloriesData] = useState({
    remaining: 0,
    consumed: 0,
    meals: [],
  });
  const idCliente = localStorage.getItem("idCliente");
  const [dateRange, setDateRange] = useState("hoy");
  const [macrosPorcentaje, setMacrosPorcentaje] = useState([]);
  const [macrosHoy, setMacrosHoy] = useState([]);
  const [macrosRestante, setMacrosRestante] = useState([]);
  const [macrosParteDia, setMacrosParteDia] = useState([]);
  const [tmb, setTmb] = useState(0);
  const [startDate, setStartDate] = useState(getCurrentMonday());
  const [totalCalorias, setTotalCalorias] = useState(0);
  const [promedioCalorias, setPromedioCalorias] = useState(0);
  const navigate = useNavigate();
  const totalMacros =
    macrosHoy.total_proteina +
    macrosHoy.total_carbohidratos +
    macrosHoy.total_grasa;

  const urlMacros = `${apiUrl}/calcularTotalMacrosAlimentos/${idCliente}/?range=${dateRange}`;
  const urlMacrosParteDia = `${apiUrl}/calcularTotalMacroAlimentosParteDia/${idCliente}/?range=${dateRange}`;
  const urlTmb = `${apiUrl}/obtenerTMB/${idCliente}/`;

  useEffect(() => {
    getMacros();
  }, [dateRange]);

  useEffect(() => {
    getMacrosParteDia();
  }, [dateRange]);

  useEffect(() => {
    getTmb();
  }, [dateRange]);

  const getMacros = async () => {
    const respuesta = await axios.get(urlMacros);
    setMacrosHoy(respuesta.data.consumo_hoy);
    setMacrosRestante(respuesta.data.consumo_restante);
    setMacrosPorcentaje(respuesta.data.consumo_logrado_porcentaje);
    setTotalCalorias(respuesta.data.consumo_hoy.total_calorias);
    setPromedioCalorias(respuesta.data.promedio_calorias);
  };

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Return "YYYY-MM-DD"
  };

  const getMacrosParteDia = async () => {
    try {
      const respuesta = await axios.get(urlMacrosParteDia);
      setMacrosParteDia(respuesta.data.daily_data);
    } catch (error) {
      console.error("Error obteniendo macros por parte del día:", error);
    }
  };

  const getTmb = () => {
    axios.get(urlTmb).then((respuesta) => {
      setTmb(respuesta.data.tmb);
    });
  };

  const spanishFormatter = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
  });

  // Generate dynamic labels (e.g., next 7 days in Spanish)
  const labels = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayName = spanishFormatter.format(date); // Get day name in Spanish
    /*
    1. dayName.charAt(0).toUpperCase()
    dayName is a string, for example, "sábado".
    dayName.charAt(0) retrieves the first character of the string ("s" in this case).
    .toUpperCase() converts this first character to uppercase ("S").
    Result: "S"
    
    2. dayName.slice(1)
    .slice(1) takes a portion of the string starting from the second character (index 1) to the end.
    For "sábado", this will return "ábado".
    Result: "ábado".

    3. Combining the Two Parts
    The first character is capitalized: "S".
    The rest of the string remains lowercase: "ábado".
    Combine these: "S" + "ábado" = "Sábado".

    4. ${date.getDate()}
    date.getDate() retrieves the day of the month as a number (e.g., 18 for January 18).
    This is added to the string to display both the day name and the numeric day of the month.
    .*/
    return `${
      dayName.charAt(0).toUpperCase() + dayName.slice(1)
    } ${date.getDate()}`; // Capitalize first letter
  });

  const barChartData = {
    labels /*macrosParteDia.map((meal) => meal.date),*/, // e.g., ['Lunes 20', 'Martes 21']
    datasets: [
      {
        label: "Desayuno",
        data: macrosParteDia.map((meal) => meal.desayuno), // Breakfast calories
        backgroundColor: "#FFA500",
        barPercentage: 0.4, // Reduce bar width
        categoryPercentage: 0.7, // Control space between bars
      },
      {
        label: "Almuerzo",
        data: macrosParteDia.map((meal) => meal.almuerzo), // Lunch calories
        backgroundColor: "#2ECC71",
        barPercentage: 0.4, // Reduce bar width
        categoryPercentage: 0.7, // Control space between bars
      },
      {
        label: "Merienda",
        data: macrosParteDia.map((meal) => meal.merienda), // Dinner calories
        backgroundColor: "#9B59B6",
        barPercentage: 0.4, // Reduce bar width
        categoryPercentage: 0.7, // Control space between bars
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Legend at the top
        labels: {
          boxWidth: 20, // Size of the legend boxes
          padding: 10, // Spacing between legend items
        },
        align: "center", // Center-align the legend items
      },
      title: {
        display: true,
        text: "Calorías por comida",
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        max: tmb, // Use caloricGoal as the max value
        ticks: {
          stepSize: tmb / 5, // Optional: Step size
          callback: (value) => `${Math.round(value)} kcal`, // Round to whole numbers
        },
        title: {
          display: true,
          text: "Calorías",
        },
      },
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Días",
        },
      },
    },
  };

  const pieChartData = {
    labels: ["Carbohidratos", "Grasa", "Proteina"],
    datasets: [
      {
        data:
          totalMacros > 0
            ? [
                ((macrosHoy.total_carbohidratos / totalMacros) * 100).toFixed(
                  2
                ),
                ((macrosHoy.total_proteina / totalMacros) * 100).toFixed(2),
                ((macrosHoy.total_grasa / totalMacros) * 100).toFixed(2),
              ]
            : [0, 0, 0],
        backgroundColor: ["#FFC107", "#FF6384", "#0DCAF0"], // Green and Yellow
        hoverBackgroundColor: ["#FFC107", "#FF6384", "#0DCAF0"],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Legend at the top
        labels: {
          boxWidth: 20, // Size of the legend boxes
          padding: 10, // Spacing between legend items
        },
        align: "center", // Center-align the legend items
      },
    },
  };

  const toFixedCalculate = (value) => {
    const fixedValue =
      value !== null && value !== undefined ? value.toFixed(2) : "0.00";
    return fixedValue;
  };

  // Helper function to get the current Monday
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

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idCliente");
    navigate("/loginCliente");
  };

  return (
    <Container fluid className="pt-4 mt-4">
      {/*Header*/}
      <Row className="mb-3">
        <Col xs={12} md={{ span: 5, offset: 4 }} className="text-center">
          <h1 className="h3 mb-0 mt-5 w-100 text-center ms-1">
            <strong>Resumen General</strong>
          </h1>
        </Col>
      </Row>

      {/* Sidebar */}
      <Col xs={12} md={3} lg={2} className="p-0">
        <Sidebar />
      </Col>

      {/* Main Content */}
      <Col xs={12} md={9} lg={10} className="container-dashboard">
        <NavScrollExample onLogout={handleCerrarSesion} />

        {/* Navigation */}
        <Row className="mb-4 justify-content-center">
          <Col xs="auto">
            <div className="date-navigation ">
              <Button variant="outline-primary" onClick={() => adjustWeek(-1)}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>

              <Col xs="auto" className="text-center">
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {getDropDownLabel()}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleDateRangeChange("hoy")}>
                      Hoy
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleDateRangeChange("ayer")}
                    >
                      Ayer
                    </Dropdown.Item>
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
              </Col>
              <Col xs="auto">
                <Button variant="outline-primary" onClick={() => adjustWeek(1)}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </Col>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Calories */}
          <Col
            xs={12}
            md={6}
            lg={4}
            className="mb-3"
            style={{ color: "green" }}
          >
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="text-center" style={{ color: "green" }}>
                  Total calorías
                </Card.Title>
                <h4 className="text-center">{totalCalorias} kcal</h4>
              </Card.Body>
            </Card>
          </Col>
          {/* Average Calories */}
          <Col xs={12} md={6} lg={4} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="text-center" style={{ color: "green" }}>
                  Promedio de Calorías
                </Card.Title>
                <h4 className="text-center">
                  {promedioCalorias.toFixed(2)} kcal
                </h4>
              </Card.Body>
            </Card>
          </Col>

          {/* Goal Calories */}
          <Col xs={12} md={6} lg={4} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="text-center" style={{ color: "green" }}>
                  Meta de Calorías
                </Card.Title>
                <h4 className="text-center">{tmb} kcal</h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Overview Cards */}
        <Row className="text-center">
          <Col xl={4} md={6} className="mb-4">
            <Card className="shadow h-100 py-2">
              <Card.Body>
                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  <FontAwesomeIcon icon={faBreadSlice} /> Carbohidratos
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {toFixedCalculate(macrosPorcentaje.carbohidratos_logrados)}%
                </div>
                <ProgressBar
                  now={macrosPorcentaje.carbohidratos_logrados}
                  variant="warning"
                  style={{ height: "15px", borderRadius: "8px" }}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col xl={4} md={6} className="mb-4">
            <Card className="shadow h-100 py-2">
              <Card.Body>
                <div
                  className="text-xs font-weight-bold text-uppercase mb-1"
                  style={{ color: "#FF6347" }} // Tomato Red
                >
                  <FontAwesomeIcon icon={faBacon} /> Grasa
                </div>

                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {toFixedCalculate(macrosPorcentaje.grasa_lograda)}%
                </div>
                <ProgressBar
                  now={macrosPorcentaje.grasa_lograda}
                  variant="custom"
                >
                  <div
                    className="progress-bar"
                    style={{
                      backgroundColor: "#FF6384", // Rose color for the fill
                      width: `${macrosPorcentaje.grasa_lograda}%`,
                      height: "100%",
                      borderRadius: "8px",
                    }}
                  />
                </ProgressBar>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={4} md={6} className="mb-4">
            <Card className="shadow h-100 py-2">
              <Card.Body>
                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                  <FontAwesomeIcon icon={faEgg} /> Proteina
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {toFixedCalculate(macrosPorcentaje.proteina_lograda)}%
                </div>
                <ProgressBar
                  now={macrosPorcentaje.proteina_lograda}
                  variant="info"
                  style={{ height: "15px", borderRadius: "8px" }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={8}>
            <Card className="shadow mb-4" style={{ height: "95%" }}>
              <Card.Header className="py-3">
                <h6 className="m-0 font-weight-bold text-primary w-100 text-center">
                  Calorías por comida
                </h6>
              </Card.Header>
              <Card.Body>
                <Bar data={barChartData} options={barChartOptions} />
              </Card.Body>
            </Card>
          </Col>

          <Col xl={4} lg={5}>
            <Card className="shadow mb-4" style={{ height: "95%" }}>
              <Card.Header className="py-3">
                <h6 className="m-0 font-weight-bold text-primary w-100 text-center">
                  Distribución calórica
                </h6>
              </Card.Header>
              <Card.Body>
                <Doughnut data={pieChartData} options={pieChartOptions} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Container>
  );
};

export default CaloriesDashboard;
