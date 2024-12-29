import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Form,
  FormGroup,
  FormControl,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { BiChevronRight, BiMinus, BiPlus } from "react-icons/bi"; // Icon from react-icons
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
} from "@fortawesome/free-solid-svg-icons";
import ControlCalorico from "../../assets/ControlCalorico.jpg"; // Replace with your image path
import Rutinas from "../../assets/Rutinas.jpg"; // Replace with your image path
import porDefectoFood from "../../assets/porDefectoFood.jpg";
import CamposNutrition2 from "../../assets/CamposNutrition2.png";
import "../Cliente/styles.css";
import NavScrollExample from "../Otros/NavBarCliente";
import axios from "axios";
import { FaEdit, FaTrash, FaUtensils } from "react-icons/fa";
import { show_alerta } from "../../functions";
import SidebarAlimentos from "../Otros/sideBarAlimentos";
import "../Otros/sideBar.css";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const ClientControl = () => {
  // Create a new Date object for the local time in Ecuador
  const today = new Date()
    .toLocaleDateString("es-EC", {
      timeZone: "America/Guayaquil", // Ecuador's timezone
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-"); // Rearranges to "YYYY-MM-DD"

  const idCliente = localStorage.getItem("idCliente");
  const url = `http://127.0.0.1:8000/api/v1/client/${idCliente}`;
  const urlDispone = `http://127.0.0.1:8000/obtenerDisponeCliente/${idCliente}/`;
  const urlMacros = `http://127.0.0.1:8000/calcularTotalMacrosAlimentos/${idCliente}`;
  const urlMeals = "http://127.0.0.1:8000/api/v1/parteDia/";
  const urlConsumos = "http://127.0.0.1:8000/api/v1/consume/";
  const [showDetails, setShowDetails] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImages, setShowImages] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showModalNutrients, setShowModalNutrients] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [parteDia, setParteDia] = useState("");
  const [nutrients, setNutrients] = useState({});
  const [porcion, setPorcion] = useState("");
  const [fecha, setFecha] = useState("");
  //***********************************************/ */
  const [dispones, setDispones] = useState([]);
  const [client, setClient] = useState([]);
  const [foods, setFoods] = useState([]);
  const [macrosHoy, setMacrosHoy] = useState([]);
  const [macrosRestante, setMacrosRestante] = useState([]);
  const [macrosPorcentaje, setMacrosPorcentaje] = useState([]);
  const [meals, setMeals] = useState([]);
  const [consumos, setConsumos] = useState([]);
  const [showModalUpdateFood, setShowModalUpdateFood] = useState(false);
  const [foodToUpdate, setFoodToUpdate] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getClient();
    console.log(today);
  }, []);

  useEffect(() => {
    getDispone();
    console.log("Dispone are: " + dispones);
  }, []);

  useEffect(() => {
    getMacros();
  }, [dispones]);

  useEffect(() => {
    getMeals();
  }, []);

  useEffect(() => {
    getConsumos();
    // console.log("Fecha in consumo is: " + consumos[0].fecha);
    // console.log("Today is: " + today);
  }, []);

  useEffect(() => {
    console.log("Updated Nutrients:", JSON.stringify(nutrients, null, 2));
  }, [nutrients]); // This will run every time `nutrients` changes

  const getClient = async () => {
    const respuesta = await axios.get(url);
    setClient(respuesta.data);
  };

  const getDispone = async () => {
    const respuesta = await axios.get(urlDispone);
    setDispones(respuesta.data.dispone);
  };

  const getConsumos = async () => {
    const respuesta = await axios.get(urlConsumos);
    setConsumos(respuesta.data);
  };

  const getMacros = async () => {
    const respuesta = await axios.get(urlMacros);
    setMacrosHoy(respuesta.data.consumo_hoy);
    setMacrosRestante(respuesta.data.consumo_restante);
    setMacrosPorcentaje(respuesta.data.consumo_logrado_porcentaje);
  };

  const getMeals = async () => {
    const respuesta = await axios.get(urlMeals);
    setMeals(respuesta.data);
  };

  const handleImageClick = () => {
    setShowImages(false);
    setShowDetails(true);
    setShowNavbar(true);
  };

  const handleSearchClick = (index) => {
    console.log(index);
    console.log(meals[index].nombre);
    setParteDia(meals[index].nombre);
    setShowDetails(false);
    setShowSearchBar(true);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);

  const decreaseQuantity = () => setQuantity((prev) => prev - 1);

  const getIcono = (iconName) => Icons[iconName];

  const getNutrientValue = (value) => {
    var numericValue = parseFloat(value);
    const unit = value.replace(/[0-9.]/g, "").trim(); //it allows to only mantain the words and remove the numeric part
    return `${numericValue * quantity} ${unit}`; //36 chips
  };

  const getTotalValue = (value) => value * quantity;

  const toFixedCalculate = (value) => {
    const fixedValue =
      value !== null && value !== undefined ? value.toFixed(2) : "0.00";
    return fixedValue;
  };

  const parseNutrients = (description) => {
    //"Per 12 chips - Calories: 150kcal | Fat: 8.00g | Carbs: 18.00g | Protein: 2.00g"
    const parts = description.split("-"); //parts = [ "Per 12 chips", "Calories: 150kcal | Fat: 8.00g | Carbs: 18.00g | Protein: 2.00g"];
    const serving = parts[0].replace("Per", "").trim(); //"12 chips"

    console.log("Serving:", serving); // Check that serving is parsed correctly

    const nutrientValues = parts[1].split("|").reduce((acc, item) => {
      //nutrientValues = ["Calories: 150kcal", "Fat: 8.00g", "Carbs: 18.00g", "Protein: 2.00g"];
      const [key, value] = item.split(":").map((str) => str.trim()); //key = "Calories"; value = "150kcal";
      acc[key.toLowerCase()] = value; //acc = { calories: "150kcal" };
      return acc;
    }, {});

    //acc = {calories: "150kcal",fat: "8.00g",carbs: "18.00g",protein: "2.00g"};
    return { serving, nutrientValues };
    //Finally ->  {"serving": "1 serving","nutrientValues": {"calories": "190kcal","fat": "9.00g","carbs": "25.00g","protein": "2.00g"}}
  };

  const handleViewDetails = async (food_id, nombre) => {
    const query = nombre !== "" ? nombre : searchQuery || "";
    if (nombre !== "") {
      setSearchQuery(nombre);
    }
    console.log("El id de la comida es: " + food_id);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/food/${food_id}/?search=${query}`
      );

      setSelectedFood(response.data.food);
      /*Split nutrients*/
      //const parsedNutrients = parseNutrients(response.data.food);
      const parsedNutrients = response.data.food.servings.serving;

      setNutrients(parsedNutrients);
      setShowModalNutrients(true);
      /*******************/
      //alert(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log("Error obteniendo el alimento", error);
    }
  };

  /*const translateToSpanish = async (text) => {
    try {
      const response = await axios.post(
        "https://translation.googleapis.com/language/translate/v2",
        {},
        {
          params: {
            q: text,
            target: "es",
            key: "AIzaSyA9MJWfPY16RCRZL9Z91r4n1e05f1HkgYM", // Replace with your API key
          },
        }
      );
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Translation error", error);
      return text; // Fallback to original text if translation fails
    }
  }; */

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/nutrition/?search=${searchQuery}`
      );

      console.log("Foods v3:", JSON.stringify(response.data, null, 2));

      const foods = response.data.foods_search.results?.food || [];

      setFoods(foods);
      /*const foods = response.data.foods.food;

      const translatedFoods = await Promise.all(
        foods.map(async (food) => {
          const translatedFood = await translateToSpanish(food.food_name);
          return { ...food, food_name: translatedFood };
        })
      );
      setFoods(translatedFoods);*/
    } catch (error) {
      console.error("Error oteniendo comidas", error);
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idCliente");
    navigate("/loginCliente");
  };

  const handleAddFood = () => {
    const urlAddFood = "http://127.0.0.1:8000/addFood/";
    console.log("Selected food:", JSON.stringify(selectedFood, null, 2));
    const datos = {
      id_alimento: selectedFood.food_id,
      nombre: selectedFood.food_name,
      calorias: parseFloat(nutrients[0].calories),
      grasa: parseFloat(nutrients[0].fat),
      carbohidratos: parseFloat(nutrients[0].carbohydrate),
      proteina: parseFloat(nutrients[0].protein),
      cantidad: quantity,
      porcion: nutrients[0].serving_description,
      parte_dia: parteDia,
      id_cliente: parseInt(idCliente),
    };
    console.log("Si entra 2");
    try {
      axios.post(urlAddFood, datos).then((response) => {
        show_alerta("El alimento ha sido agregado exitosamente", "success");
        setShowModalNutrients(false);
        window.location.reload();
      });
    } catch (error) {
      show_alerta("Error al agregar el alimento", error);
    }
  };

  const handleShowModalUpdate = (idAlimento, idParteDia, fecha) => {
    const urlGetFoodUpdate = `http://127.0.0.1:8000/obtenerDatosDisponeActual/`;
    const datos = {
      id_cliente: idCliente,
      id_alimento: idAlimento,
      id_parte_dia: idParteDia,
      fecha: fecha,
    };
    axios.get(urlGetFoodUpdate, { params: datos }).then(
      (response) => {
        setShowModalUpdateFood(true);
        setFoodToUpdate(response.data.dispone.id_alimento);
        setQuantity(response.data.dispone.cantidad);
        setPorcion(response.data.dispone.tamaño_porcion_g);
        setParteDia(response.data.dispone.id_parte_dia);
        setFecha(response.data.dispone.fecha);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const handleUpdateFood = () => {
    const urlUpdateFood = `http://127.0.0.1:8000/updateFood/`;
    const datos = {
      id_alimento: foodToUpdate.id_alimento,
      id_cliente: parseInt(idCliente),
      id_parte_dia: parseInt(parteDia),
      fecha: fecha,
      cantidad: quantity,
    };
    axios.post(urlUpdateFood, datos).then((response) => {
      show_alerta("El alimento ha sido actualizado exitosamente", "success");
      setShowModalUpdateFood(false);
      const updatedDispone = response.data.dispone;
      //Update dispone
      setDispones((prevDispones) => {
        return prevDispones.map((item) =>
          item.id_cliente === updatedDispone.id_cliente &&
          item.id_parte_dia.id_parte_dia ===
            updatedDispone.id_parte_dia.id_parte_dia &&
          item.id_alimento.id_alimento ===
            updatedDispone.id_alimento.id_alimento &&
          item.fecha === updatedDispone.fecha
            ? updatedDispone
            : item
        );
      });
    });
  };

  const handleDeleteFood = () => {
    const urlDeleteFood = `http://127.0.0.1:8000/deleteFood/`;
    const datos = {
      id_alimento: foodToUpdate.id_alimento,
      id_cliente: parseInt(idCliente),
      id_parte_dia: parseInt(parteDia),
      fecha: fecha,
    };
    axios.delete(urlDeleteFood, { data: datos }).then((response) => {
      show_alerta("El alimento ha sido eliminado exitosamente", "success");
      setShowModalUpdateFood(false);
      //Delete dispone
      setDispones((prevDispones) => {
        return prevDispones.filter(
          (item) =>
            item.id_cliente !== idCliente &&
            item.id_parte_dia !== parteDia &&
            item.id_alimento.id_alimento !== foodToUpdate.id_alimento &&
            item.fecha !== fecha
        );
      });
      window.location.reload();
    });
  };

  const MacroNutrientPieChart = ({ carbs, fat, protein }) => {
    const data = {
      labels: ["Carbohidratos", "Grasa", "Proteina"],
      datasets: [
        {
          data: [carbs, fat, protein],
          backgroundColor: ["#FFCD56", "#FF6384", "#36A2EB"],
          hoverBackgroundColor: ["#FFCD56", "#FF6384", "#36A2EB"],
        },
      ],
    };

    const options = {
      responsive: true,
      cotout: "60%",
      plugins: {
        legend: {
          display: false,
        },

        //This is not necessary at all
        tooltip: {
          callbacks: {
            label: (context) => {
              // Customize tooltip to show the label with percentage
              let label = context.label || "";
              if (label) {
                label += `: ${context.raw}g`;
              }
              return label;
            },
          },
        },
      },
    };
    return <Doughnut data={data} options={options} />;
  };

  /*const meals = [
    { icon: faCoffee, name: "Desayuno", calories: 200 },
    { icon: faUtensils, name: "Almuerzo", calories: 300 },
    { icon: faDrumstickBite, name: "Merienda", calories: 400 },
  ];*/

  return (
    <>
      {showNavbar && <NavScrollExample onLogout={handleCerrarSesion} />}
      {showNavbar && <SidebarAlimentos />}
      <Container fluid className="pt-5 mt-4 d-flex justify-content-center">
        <Row className="w-100" style={{ maxWidth: "1000px" }}>
          {" "}
          {/*w-100 helped me to move the content to the right*/}
          {/*{showImages && (
            <>
              <Col xs={12} md={6} className="mb-2 mb-md-0">
                <img
                  src={Rutinas}
                  alt="Rutinas"
                  width="500px"
                  style={{ cursor: "pointer" }}
                  onClick={handleImageClick}
                />
              </Col>
              <Col xs={12} md={6}>
                <img
                  src={ControlCalorico}
                  alt="ControlCalorico"
                  width="480px"
                  style={{ cursor: "pointer" }}
                  onClick={handleImageClick}
                />
              </Col>
            </>
          )}*/}
          {/*Search Button appears after push in the + button*/}
          {showSearchBar && (
            <Form
              onSubmit={handleSearchSubmit}
              className="search-bar-form mb-4"
            >
              {/* Image Section */}
              {/*<Row className="justify-content-center">
                <Col md={6} className="text-center">*/}
              {/*The styles has applied to move everything inside here*/}
              {/* <img
                    src={CamposNutrition2}
                    alt=""
                    className="img-fluid"
                    style={{ height: "180px", marginBottom: "-10px" }}
                  /> */}
              {/*</Col>
              </Row>*/}
              {/* Search Bar Section */}
              <Row className="justify-content-center mt-3">
                <Col xs={12} md={10} lg={8} className="offset-md-2 offset-lg-3">
                  <FormGroup controlId="searchQuery">
                    <div className="input-group search-bar-input-group">
                      <Form.Control
                        type="text"
                        placeholder="Ingrese un alimento..."
                        value={searchQuery}
                        className="search-bar-input-group"
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        className="search-bar-button"
                      >
                        <FontAwesomeIcon icon={faSearch} /> Buscar
                      </Button>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}
          {/*This is the main screen when the user click on the food picture*/}
          <div className="main-content-wrapper mt-3 mb-3">
            {showDetails && (
              <Col
                xs={12}
                md={{ span: 12, offset: 2 }}
                lg={8}
                xl={6}
                className="main-content-food"
              >
                <Card className="p-4 shadow">
                  {/* Calories Section */}
                  <Row className="text-center mb-4">
                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                      <h3 className="fs-4">Calorias Restantes</h3>
                      <h1 className="fs-2">
                        {macrosRestante.calorias_restantes} kcal
                      </h1>
                    </Col>
                    <Col xd={12} md={6}>
                      <h3 className="fs-4">Calorías Consumidas</h3>
                      <h1 className="fs-2">{macrosHoy.total_calorias} kcal</h1>
                    </Col>
                  </Row>
                  {/* Meal Sections */}
                  {meals.map((meal, index) => (
                    <div key={index}>
                      <Card
                        className="mb-3 shadow-sm"
                        style={{ borderRadius: "10px" }}
                      >
                        <Card.Body>
                          {/* Flexbox layout for header */}
                          <Row className="align-items-center d-flex justify-content-between">
                            {/* Left: Icon */}
                            <Col xs={2} md={1} className="text-center">
                              <FontAwesomeIcon
                                icon={getIcono(meal.icono)}
                                size="2x"
                              />
                            </Col>

                            {/* Center: Meal Name */}
                            <Col xs={6} md={2}>
                              <h4 className="fs-5 text-center">
                                {meal.nombre}
                              </h4>
                            </Col>
                            <Col>
                              <hr
                                style={{
                                  margin: "13px 0",
                                  borderTop: "3.5px solid #ccc",
                                }}
                              />
                              {dispones
                                .filter(
                                  (dispone) =>
                                    dispone.id_parte_dia ===
                                      meal.id_parte_dia &&
                                    dispone.id_cliente ===
                                      parseInt(idCliente) &&
                                    dispone.fecha === today
                                )
                                .map((dispone) => (
                                  <div
                                    style={{ marginBottom: "10px" }}
                                    key={dispone.id_alimento.id_alimento}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "10px",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          maxWidth: "80%",
                                        }}
                                      >
                                        {" "}
                                        <h6>{dispone.id_alimento.nombre} </h6>
                                      </div>

                                      <FaEdit
                                        onClick={() =>
                                          handleShowModalUpdate(
                                            dispone.id_alimento.id_alimento,
                                            dispone.id_parte_dia,
                                            dispone.fecha
                                          )
                                        }
                                        style={{
                                          cursor: "pointer",
                                          color: "#17a2b8",
                                          fontSize: "1.25rem", // Consistent font size
                                          verticalAlign: "middle", // Align icon properly with text
                                        }}
                                      />
                                    </div>

                                    <h6 style={{ color: "green", margin: "0" }}>
                                      {dispone.id_alimento.calorias *
                                        dispone.cantidad +
                                        " kcal"}
                                    </h6>

                                    {/*Button update and delete*/}

                                    {/*Divider */}
                                    <hr
                                      style={{
                                        margin: "15px 0",
                                        borderTop: "3.5px solid #ccc",
                                      }}
                                    />
                                  </div>
                                ))}
                            </Col>
                            <Col md={4} xs={8} className="text-end">
                              <Button
                                variant="outline-success"
                                onClick={() => handleSearchClick(index)}
                                className="me-3"
                              >
                                <FontAwesomeIcon icon={faPlusCircle} /> Agregar
                              </Button>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}

                  {/* Macronutrient Summary */}
                  {/*<Row className="text-center">
                  <Col>
                    <h4>Resumen Macronutrientes</h4>
                  </Col>
                </Row> */}
                  <Row className="text-center mb-4">
                    <Col md={4} xs={12}>
                      <hr className="my-3" />

                      <h5>
                        <FontAwesomeIcon icon={faBreadSlice} /> Carbohidratos
                      </h5>
                      <p className="mb-1">
                        {toFixedCalculate(
                          macrosPorcentaje.carbohidratos_logrados
                        )}
                        %
                      </p>
                      <ProgressBar
                        now={macrosPorcentaje.carbohidratos_logrados}
                        variant="warning"
                        style={{ height: "15px", borderRadius: "8px" }}
                      />
                    </Col>

                    <Col md={4} xs={12}>
                      <hr className="my-3" />

                      <h5>
                        <FontAwesomeIcon icon={faBacon} /> Grasa
                      </h5>
                      <p className="mb-1">
                        {toFixedCalculate(macrosPorcentaje.grasa_lograda)}%
                      </p>
                      {/*Here I add a custom color for te bar*/}
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
                      {/*************/}
                    </Col>

                    <Col md={4} xs={12}>
                      <hr className="my-3" />
                      <h5>
                        <FontAwesomeIcon icon={faEgg} /> Proteina
                      </h5>
                      <p className="mb-1">
                        {toFixedCalculate(macrosPorcentaje.proteina_lograda)}%
                      </p>
                      <ProgressBar
                        now={macrosPorcentaje.proteina_lograda}
                        variant="info"
                        style={{ height: "15px", borderRadius: "8px" }}
                      />
                    </Col>

                    <hr
                      style={{
                        margin: "30px 0",
                        borderTop: "3.5px solid #ccc",
                      }}
                    />

                    {/* Macronutrients details */}
                  </Row>

                  {/* Macronutrient Pie Chart */}
                  {/*<Row className="text-center mb-4">
                  <Col xs={6}>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                      }}
                    >
                      <span
                        style={{
                          color: "#FFCD56",
                          fontSize: "1.65em",
                        }}
                      >
                        ●
                      </span>{" "}
                      Carbohidratos: {macrosHoy.total_carbohidratos}g
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                      }}
                    >
                      <span style={{ color: "#FF6384", fontSize: "1.65em" }}>
                        ●
                      </span>{" "}
                      Grasa: {macrosHoy.total_grasa}g
                    </p>

                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2em",
                      }}
                    >
                      <span style={{ color: "#36A2EB", fontSize: "1.65em" }}>
                        ●
                      </span>{" "}
                      Proteina: {macrosHoy.total_proteina}g
                    </p>
                  </Col>

                  <Col
                    xs={6}
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {/* Pie Chart showing the macronutrient distribution */}
                  {/*  <div
                      style={{
                        width: "250px",
                        height: "250px",
                      }}
                    >
                      <MacroNutrientPieChart
                        carbs={macrosHoy.total_carbohidratos}
                        fat={macrosHoy.total_grasa}
                        protein={macrosHoy.total_proteina}
                      />
                    </div>
                  </Col>

                  <hr
                    style={{
                      margin: "30px 0",
                      borderTop: "3.5px solid #ccc",
                    }}
                  />
                </Row>*/}
                </Card>
              </Col>
            )}
          </div>
          {/*Appears all the food after push "Search" button*/}
          {foods.length > 0 && (
            <Row className="justify-content-center food-list-row ">
              {foods.map((food) => (
                <Col
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={food.food_id}
                  className="food-list-col"
                >
                  <Card className="food-card">
                    <Card.Body>
                      <Card.Title className="food-card-title">
                        {food.food_name}
                      </Card.Title>
                      <p className="food-card-serving">
                        {food.servings.serving[0].serving_description}
                      </p>
                      <p className="food-card-calories">
                        {food.servings.serving[0].calories + "kcal"}
                      </p>
                    </Card.Body>
                    <Card.Footer className="food-card-footer">
                      <Button
                        variant="success"
                        className="food-card-button"
                        onClick={() => handleViewDetails(food.food_id, "")}
                        aria-label={`View details for ${food.food_name}`}
                      >
                        Ver mas
                        <BiChevronRight size={20} />
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          {/*Modal for food detail*/}
          <Modal
            show={showModalNutrients}
            onHide={() => setShowModalNutrients(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title className="w-100 text-center">
                {selectedFood?.food_name || "Food Item"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedFood ? (
                <div className="text-center">
                  {/* Quantity Input with +/- Buttons */}
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    {" "}
                    {/*d-flex help us to put everything in the same line*/}
                    <Button
                      variant="outline-secondary"
                      onClick={decreaseQuantity}
                    >
                      <BiMinus />
                    </Button>
                    <FormControl
                      type="number"
                      value={quantity}
                      readOnly
                      className="text-center mx-2"
                      style={{ maxWidth: "60px" }}
                    ></FormControl>
                    <Button
                      variant="outline-secondary"
                      onClick={increaseQuantity}
                    >
                      <BiPlus />
                    </Button>
                  </div>
                  <p>
                    <strong>Porción: </strong>
                    {getNutrientValue(nutrients[0].serving_description) ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Calorías:</strong>{" "}
                    {getNutrientValue(nutrients[0].calories + "kcal") || "N/A"}
                  </p>
                  <p>
                    <strong>Grasa:</strong>{" "}
                    {getNutrientValue(nutrients[0].fat + "g") || "N/A"}
                  </p>
                  <p>
                    <strong>Carbohidratos:</strong>{" "}
                    {getNutrientValue(nutrients[0].carbohydrate + "g") || "N/A"}
                  </p>
                  <p>
                    <strong>Proteina:</strong>{" "}
                    {getNutrientValue(nutrients[0].protein + "g") || "N/A"}
                  </p>
                </div>
              ) : (
                <p>Cargando detalles</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                className="d-flex align-items-center"
                onClick={handleAddFood}
              >
                <FaUtensils className="me-2" />
                Agregar alimento
              </Button>
            </Modal.Footer>
          </Modal>
          {/*Modal for update food*/}
          <Modal
            show={showModalUpdateFood}
            onHide={() => setShowModalUpdateFood(false)}
            centered
            className="modal-update-food"
          >
            <Modal.Header closeButton>
              <Modal.Title className="w-100 text-center">
                {foodToUpdate?.nombre || "Food Item"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {foodToUpdate ? (
                <div className="text-center">
                  {/* Quantity Input with +/- Buttons */}
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    {" "}
                    {/*d-flex help us to put everything in the same line*/}
                    <Button
                      variant="outline-secondary"
                      onClick={decreaseQuantity}
                    >
                      <BiMinus />
                    </Button>
                    <FormControl
                      type="number"
                      value={quantity}
                      readOnly
                      className="text-center mx-2"
                      style={{ maxWidth: "60px" }}
                    ></FormControl>
                    <Button
                      variant="outline-secondary"
                      onClick={increaseQuantity}
                    >
                      <BiPlus />
                    </Button>
                  </div>
                  <p>
                    <strong>Porción:</strong>{" "}
                    {getNutrientValue(porcion) || "N/A"}
                  </p>
                  <p>
                    <strong>Calorías:</strong>{" "}
                    {getTotalValue(foodToUpdate.calorias) + " kcal" || "N/A"}
                  </p>
                  <p>
                    <strong>Grasa:</strong>{" "}
                    {getTotalValue(foodToUpdate.grasa_g) + " g" || "N/A"}
                  </p>
                  <p>
                    <strong>Carbohidratos:</strong>{" "}
                    {getTotalValue(foodToUpdate.carbohidratos_g) + " g" ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Proteina:</strong>{" "}
                    {getTotalValue(foodToUpdate.proteina_g) + " g" || "N/A"}
                  </p>
                </div>
              ) : (
                <p>Cargando detalles</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                className="d-flex align-items-center"
                onClick={handleUpdateFood}
              >
                <FaUtensils className="me-2" />
                Editar alimento
              </Button>
              <Button
                variant="danger"
                className="d-flex align-items-center"
                onClick={handleDeleteFood}
              >
                <FaTrash />
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
      </Container>
    </>
  );
};

export default ClientControl;
