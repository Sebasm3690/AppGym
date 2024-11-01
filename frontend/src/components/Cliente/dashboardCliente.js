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
import { FaEdit, FaUtensils } from "react-icons/fa";
import { show_alerta } from "../../functions";
import SidebarAlimentos from "../Otros/sideBarAlimentos";
import "../Otros/sideBar.css";
import * as Icons from "@fortawesome/free-solid-svg-icons";

const ClientControl = () => {
  // Create a new Date object for the local time in Ecuador
  const today = new Date().toLocaleDateString("es-EC", {
    timeZone: "America/Guayaquil", // Ecuador's time zone
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Reformat '29/10/2024' to '2024-10-29'
  const [day, month, year] = today.split("/");
  const formattedToday = `${year}-${month}-${day}`;
  const idCliente = localStorage.getItem("idCliente");
  const url = `http://127.0.0.1:8000/api/v1/client/${idCliente}`;
  const urlConsumo = `http://127.0.0.1:8000/obtenerConsumoCliente/${idCliente}/`;
  const urlMacros = `http://127.0.0.1:8000/calcularTotalMacrosAlimentos/${idCliente}`;
  const urlMeals = "http://127.0.0.1:8000/api/v1/parteDia/";
  const [showDetails, setShowDetails] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImages, setShowImages] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showModalNutrients, setShowModalNutrients] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [parteDia, setParteDia] = useState("");
  const [nutrients, setNutrients] = useState({});
  //***********************************************/ */
  const [consumos, setConsumos] = useState([]);
  const [client, setClient] = useState([]);
  const [foods, setFoods] = useState([]);
  const [macrosHoy, setMacrosHoy] = useState([]);
  const [macrosRestante, setMacrosRestante] = useState([]);
  const [macrosPorcentaje, setMacrosPorcentaje] = useState([]);
  const [meals, setMeals] = useState([]);
  useEffect(() => {
    getClient();
    console.log(today);
  }, []);

  useEffect(() => {
    getConsumo();
  }, []);

  useEffect(() => {
    getMacros();
  }, []);

  useEffect(() => {
    getMeals();
  }, []);

  useEffect(() => {
    console.log("Updated Nutrients:", JSON.stringify(nutrients, null, 2));
  }, [nutrients]); // This will run every time `nutrients` changes

  const getClient = async () => {
    const respuesta = await axios.get(url);
    setClient(respuesta.data);
  };

  const getConsumo = async () => {
    const respuesta = await axios.get(urlConsumo);
    setConsumos(respuesta.data.consumo);
    console.log("El consumo es:" + JSON.stringify(respuesta.data, null, 2));
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
    console.log(food_id);
    console.log(nombre);
    if (nombre !== "") {
      setSearchQuery(nombre);
    }
    console.log("El id de la comida es: " + food_id);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/food/${food_id}/?search=${searchQuery}`
      );

      setSelectedFood(response.data);
      /*Split nutrients*/
      const parsedNutrients = parseNutrients(response.data.food_description);

      console.log(
        "Parsed Nutrients:",
        JSON.stringify(parsedNutrients, null, 2)
      );

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

      setFoods(response.data.foods.food);
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

  const handleAddFood = () => {
    const urlAddFood = "http://127.0.0.1:8000/addFood/";
    const datos = {
      id_alimento: selectedFood.food_id,
      nombre: selectedFood.food_name,
      calorias: parseFloat(nutrients.nutrientValues.calories),
      grasa: parseFloat(nutrients.nutrientValues.fat),
      carbohidratos: parseFloat(nutrients.nutrientValues.carbs),
      proteina: parseFloat(nutrients.nutrientValues.protein),
      cantidad: quantity,
      porcion: parseInt(nutrients.serving),
      parte_dia: parteDia,
      id_cliente: parseInt(idCliente),
    };
    console.log("Si entra 2");
    try {
      axios.post(urlAddFood, datos).then((response) => {
        show_alerta("El alimento ha sido agregado exitosamente", "success");
        setShowModalNutrients(false);
      });
    } catch (error) {
      show_alerta("Error al agregar el alimento", error);
    }
  };

  /*const meals = [
    { icon: faCoffee, name: "Desayuno", calories: 200 },
    { icon: faUtensils, name: "Almuerzo", calories: 300 },
    { icon: faDrumstickBite, name: "Merienda", calories: 400 },
  ];*/

  return (
    <>
      {showNavbar && <NavScrollExample />}
      {showNavbar && <SidebarAlimentos />}
      <Container fluid className="pt-5 mt-4 d-flex justify-content-center">
        <Row className="w-100" style={{ maxWidth: "800px" }}>
          {" "}
          {/*w-100 helped me to move the content to the right*/}
          {showImages && (
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
          )}
          {/*Search Button appears after push in the + button*/}
          {showSearchBar && (
            <Form onSubmit={handleSearchSubmit} className="mb-4">
              {/* Image Section */}
              <Row className="justify-content-center">
                <Col md={6} className="text-center">
                  {/*The styles has applied to move everything inside here*/}
                  {/* <img
                    src={CamposNutrition2}
                    alt=""
                    className="img-fluid"
                    style={{ height: "180px", marginBottom: "-10px" }}
                  /> */}
                </Col>
              </Row>
              {/* Search Bar Section */}
              <Row className="justify-content-center">
                <Col md={10}>
                  <FormGroup controlId="searchQuery">
                    <div className="input-group">
                      <Form.Control
                        type="text"
                        placeholder="Search for food..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button type="submit" variant="primary">
                        <FontAwesomeIcon icon={faSearch} /> Search
                      </Button>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}
          {/*This is the main screen when the user click on the food picture*/}
          {showDetails && (
            <Col xs={12}>
              <Card className="p-4 shadow">
                {/* Calories Section */}
                <Row className="text-center mb-4">
                  <Col>
                    <h3>Calorias Restantes</h3>
                    <h1>{macrosRestante.calorias_restantes} kcal</h1>
                  </Col>
                  <Col>
                    <h3>Calorías Consumidas</h3>
                    <h1>{macrosHoy.total_calorias} kcal</h1>
                  </Col>
                </Row>
                {/* Meal Sections */}
                {meals.map((meal, index) => (
                  <div key={index}>
                    <Card
                      className="mb-3 shadow-sm"
                      key={index}
                      style={{ borderRadius: "10px" }}
                    >
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col xs={2} className="text-center">
                            <FontAwesomeIcon
                              icon={getIcono(meal.icono)}
                              size="2x"
                            />
                          </Col>
                          <Col xs={6}>
                            <h4>{meal.nombre}</h4>
                            <hr
                              style={{
                                margin: "13px 0",
                                borderTop: "3.5px solid #ccc",
                              }}
                            />
                            {consumos
                              .filter(
                                (consumo) =>
                                  //consumo.parte_dia === meal.name &&
                                  consumo.fecha === formattedToday
                              )
                              .map((consumo) => (
                                <div
                                  style={{ marginBottom: "10px" }}
                                  key={consumo.id_alimento.id_alimento}
                                >
                                  <div style={{ display: "flex", gap: "10px" }}>
                                    <h6>{consumo.id_alimento.nombre} </h6>
                                    <FaEdit
                                      onClick={() =>
                                        handleViewDetails(
                                          consumo.id_alimento.id_alimento,
                                          consumo.id_alimento.nombre
                                        )
                                      }
                                      style={{
                                        cursor: "pointer",
                                        color: "#17a2b8",
                                        fontSize: "20px",
                                      }}
                                    />
                                  </div>

                                  <h6 style={{ color: "green" }}>
                                    {consumo.id_alimento.calorias + " kcal"}
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
                          <Col xs={4} className="text-end">
                            <Button
                              variant="outline-success"
                              onClick={() => handleSearchClick(index)}
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
                  <Col xs={4}>
                    <hr
                      style={{
                        margin: "20px 0",
                        borderTop: "3.5px solid #ccc",
                      }}
                    />

                    <h5>
                      <FontAwesomeIcon icon={faBreadSlice} /> Carbohidratos
                    </h5>
                    <p className="mb-1">
                      {macrosPorcentaje.carbohidratos_logrados.toFixed(2)}%
                    </p>
                    <ProgressBar
                      now={macrosPorcentaje.carbohidratos_logrados}
                      variant="warning"
                      style={{ height: "15px", borderRadius: "8px" }}
                    />
                  </Col>

                  <Col xs={4}>
                    <hr
                      style={{
                        margin: "20px 0",
                        borderTop: "3.5px solid #ccc",
                      }}
                    />

                    <h5>
                      <FontAwesomeIcon icon={faBacon} /> Grasa
                    </h5>
                    <p className="mb-1">
                      {macrosPorcentaje.grasa_lograda.toFixed(2)}%
                    </p>
                    <ProgressBar
                      now={macrosPorcentaje.grasa_lograda}
                      variant="success"
                    />
                  </Col>

                  <Col xs={4}>
                    <hr
                      style={{
                        margin: "20px 0",
                        borderTop: "3.5px solid #ccc",
                      }}
                    />
                    <h5>
                      <FontAwesomeIcon icon={faEgg} /> Proteina
                    </h5>
                    <p className="mb-1">
                      {macrosPorcentaje.proteina_lograda.toFixed(2)}%
                    </p>
                    <ProgressBar
                      now={macrosPorcentaje.proteina_lograda}
                      variant="info"
                      style={{ height: "15px", borderRadius: "8px" }}
                    />
                  </Col>

                  <hr
                    style={{ margin: "30px 0", borderTop: "3.5px solid #ccc" }}
                  />

                  {/* Macronutrients details */}

                  <Col>
                    <p>Grasa Total: {macrosHoy.total_grasa}g</p>
                    <p>Total carbohidratos: {macrosHoy.total_calorias}g</p>
                    <p>Proteina: {macrosHoy.total_proteina}g</p>
                  </Col>

                  <hr
                    style={{ margin: "30px 0", borderTop: "3.5px solid #ccc" }}
                  />
                </Row>

                {/* Macronutrient Pie Chart */}
                {/*<Row className="text-center">
                  <Col>
                    <FontAwesomeIcon icon={faChartPie} size="3x" />
                    <p>Carbs: 60%, Fat: 30%, Protein: 50%</p>
                  </Col>
                </Row> */}
              </Card>
            </Col>
          )}
          {/*Appears all the food after push "Search" button*/}
          {foods.length > 0 && (
            <Row className="justify-content-center g-4">
              {foods.map((food) => (
                <Col
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={food.food_id}
                  className="mb-3 d-flex justify-content-center"
                >
                  <Card
                    className="food-card"
                    style={{ width: "100%", borderRadius: "10px" }}
                  >
                    <Card.Img variant="top" src={porDefectoFood} />
                    <Card.Body>
                      <Card.Title className="text-center">
                        {food.brand_name}
                      </Card.Title>
                      <p className="text-center">{food.food_name}</p>
                      {/*<p>
                            <strong>Macros: </strong>
                            {food.food_description}
                          </p> */}
                    </Card.Body>
                    <Card.Footer>
                      <Button
                        variant="success"
                        className="ms-auto d-flex align-items-center"
                        onClick={() => handleViewDetails(food.food_id, "")}
                      >
                        Ver mas
                        <BiChevronRight size={20} className="ms-1" />
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
              <Modal.Title>
                {selectedFood?.brand_name || "Food Item"}
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
                    <strong>Porción:</strong>{" "}
                    {getNutrientValue(nutrients?.serving) || "N/A"}
                  </p>
                  <p>
                    <strong>Calorías:</strong>{" "}
                    {getNutrientValue(nutrients?.nutrientValues?.calories) ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Grasa:</strong>{" "}
                    {getNutrientValue(nutrients?.nutrientValues?.fat) || "N/A"}
                  </p>
                  <p>
                    <strong>Carbohidratos:</strong>{" "}
                    {getNutrientValue(nutrients?.nutrientValues?.carbs) ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Proteina:</strong>{" "}
                    {getNutrientValue(nutrients.nutrientValues?.protein) ||
                      "N/A"}
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
        </Row>
      </Container>
    </>
  );
};

export default ClientControl;
