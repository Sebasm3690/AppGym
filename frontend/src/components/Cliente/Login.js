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
//import "../Admin/Login.css";
import NavScrollExample from "../Otros/Navbar";
import "../Entrenador/Login.css";
//import Footer from "../Otros/footer";
import { useNavigate } from "react-router-dom";
import "../Otros/navBar.css";
import Swal from "sweetalert2"; // Import SweetAlert

class LoginCliente extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorMessage: "",
      idAdmin: null,
    };
    this.navigate = props.navigate; // Obtener la función de navegación de las props
  }

  handleInputChange = (event) => {
    const { id, value } = event.target; //El id es el username o el password y el value es el valor ingresado
    this.setState({ [id]: value });
  };

  handleSubmit = async (event) => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
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
      const response = await axios.post(`${apiUrl}/clientLogin/`, {
        username,
        password,
      });
      const { access, refresh, cliente } = response.data;

      console.log("Access Token:", access);
      console.log("Refresh Token:", refresh);
      console.log("Datos del cliente:", cliente);

      // Save tokens and user data in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("idCliente", cliente.id_cliente); // For client-specific logic
      localStorage.setItem("userRole", "cliente");

      // Close loading and show success SweetAlert
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "¡Bienvenido al panel del cliente!",
        timer: 2000, // Auto-close after 2 seconds
        timerProgressBar: true, // Show timer progress bar
        showConfirmButton: false, // Hide the "Confirm" button
      }).then(() => {
        // Guardar el id del admin en el estado y en localStorage
        //this.setState({ idCliente: cliente.id_cliente }); //Actualiza el estado del id administrador

        // Redirigir al usuario a la página de CrudTrainers después de iniciar sesión correctamente
        this.navigate("/homeCliente/"); // Cambia '/crudTrainers' por la ruta correcta
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text:
          error.response?.data.error ||
          "Hubo un problema al validar tus credenciales. Inténtelo nuevamente.",
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
                        <h3 className="display-4 mb-3 text-center">
                          Iniciar Sesión
                        </h3>
                        <p className="text-muted mb-4 text-center">
                          Introduzca sus datos de cliente
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
                                className="rounded-3 border-0 shadow px-4"
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
                                className="rounded-3 border-0 shadow px-4 text-primary"
                                value={password}
                                onChange={this.handleInputChange}
                              />
                            </InputGroup>
                          </Form.Group>
                          <Button
                            type="submit"
                            className="btn-primary btn-block text-uppercase mb-2 rounded-3 shadow-sm"
                            style={{ width: "75%" }} // Ajustar ancho del botón para mejor estética
                          >
                            Iniciar sesión
                          </Button>
                          {error && <p style={{ color: "red" }}>{error}</p>}
                          <a
                            href="/forgotPassword?userType=cliente"
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
        {/* <Footer /> */}
      </>
    );
  }
}

// Crear un componente de orden superior para usar la función navigate de react-router-dom
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  }

  return ComponentWithRouterProp;
}

export default withRouter(LoginCliente);
