import React from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import NavScrollExample from "../Otros/Navbar";
//import Footer from "../Otros/footer";
import { useNavigate } from "react-router-dom";
import "../Entrenador/Login.css";
import Swal from "sweetalert2"; // Import SweetAlert

class LoginEntrenador extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorMessage: "",
    };

    this.navigate = props.navigate;
  }

  handleInputChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;

    // Show loading SweetAlert
    Swal.fire({
      title: "Cargando...",
      text: "Estamos validando tus credenciales.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Show loading spinner
      },
    });
    try {
      const response = await axios.post("http://localhost:8000/trainerLogin/", {
        username,
        password,
      });
      const { token, entrenador } = response.data;
      console.log("Token:", token);
      console.log("Datos del entrenador", entrenador);

      // Close loading and show success SweetAlert
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "¡Bienvenido a tu panel de entrenador!",
        timer: 2000, // Auto-close after 2 seconds
        timerProgressBar: true, // Show timer progress bar
        showConfirmButton: false, // Hide the "Confirm" button
      }).then(() => {
        this.setState({ idAdmin: entrenador.id_administrador });
        localStorage.setItem("idEntrenador", entrenador.id_entrenador);
        localStorage.setItem("userRole", "entrenador");
        this.navigate("/homeEntrenador/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text:
          error.response?.data.error ||
          "Hubo un problema al validar tus credenciales. Inténtalo nuevamente.",
        confirmButtonText: "Entendido",
      });
      console.log("Error al iniciar sesión", error.response?.data.error);
    }
  };

  render() {
    const { username, password, error } = this.state;
    return (
      <>
        <NavScrollExample />
        <div className="maincontainer">
          <Container fluid className="h-100">
            <Row className="no-gutters h-100 align-items-center">
              <Col
                md={6}
                className="d-flex bg-image align-items-center justify-content-center"
              ></Col>
              <Col
                md={6}
                className="bg-light d-flex align-items-center justify-content-center"
              >
                <div className="login px-4 py-5 d-flex flex-column justify-content-center">
                  <Container>
                    <Row>
                      <Col lg={9} md={11} sm={12} className="mx-auto">
                        <h3 className="display-4 mb-3 text-left">
                          Iniciar Sesión
                        </h3>
                        <p className="text-muted mb-4 text-left">
                          Introduzca sus datos o credenciales.
                        </p>
                        <Form
                          className="d-flex flex-column align-items-center"
                          onSubmit={this.handleSubmit}
                        >
                          <Form.Group className="mb-3 w-100">
                            <InputGroup>
                              <FormControl
                                id="username"
                                type="text"
                                placeholder="Nombre de usuario"
                                required
                                autoFocus
                                className="rounded-5 border-0 shadow px-4"
                                value={username}
                                onChange={this.handleInputChange}
                              />
                            </InputGroup>
                          </Form.Group>
                          <Form.Group className="mb-3 w-100">
                            <InputGroup>
                              <FormControl
                                id="password"
                                type="password"
                                placeholder="Contraseña"
                                required
                                className="rounded-5 border-0 shadow px-4 text-primary"
                                value={password}
                                onChange={this.handleInputChange}
                              />
                            </InputGroup>
                          </Form.Group>
                          <Button
                            type="submit"
                            className="btn-primary btn-block text-uppercase mb-2 rounded-5 shadow-sm"
                            style={{ width: "75%" }}
                          >
                            Iniciar sesión
                          </Button>
                          {error && <p style={{ color: "red" }}>{error}</p>}
                          <a
                            href="/loginAdmin"
                            className="text-primary mt-3 d-block"
                          >
                            ¿Iniciar sesión como administrador?
                          </a>
                          <a
                            href="/forgot-password"
                            className="text-primary mt-3 d-block"
                          >
                            ¿Olvidaste tu contraseña?
                          </a>
                        </Form>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        {/*<Footer /> */}
      </>
    );
  }
}

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  }

  return ComponentWithRouterProp;
}

export default withRouter(LoginEntrenador);
