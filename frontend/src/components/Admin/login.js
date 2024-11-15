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
  Navbar,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Entrenador/Login.css";
import NavScrollExample from "../Otros/Navbar";
//import Footer from "../Otros/footer";
import { useNavigate } from "react-router-dom";
import "../Otros/navBar.css";

class LoginAdmin extends React.Component {
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
    event.preventDefault();
    const { username, password } = this.state;
    try {
      const response = await axios.post("http://localhost:8000/adminLogin/", {
        username,
        password,
      });
      const { token, administrador } = response.data;
      console.log("Token:", token);
      console.log("Datos del administrador", administrador);

      // Guardar el id del admin en el estado y en localStorage
      this.setState({ idAdmin: administrador.id_administrador }); //Actualiza el estado del id administrador
      localStorage.setItem("idAdmin", administrador.id_administrador); //Persiste aunque la página se recargue
      localStorage.setItem("userRole", "administrador");
      // Redirigir al usuario a la página de CrudTrainers después de iniciar sesión correctamente
      this.navigate("/homeAdmin/"); // Cambia '/crudTrainers' por la ruta correcta
    } catch (error) {
      this.setState({
        error:
          error.response?.data.error || "Error desconocido al iniciar sesión",
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
                          Introduzca sus datos o credenciales
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
                            style={{ width: "75%" }} // Ajustar ancho del botón para mejor estética
                          >
                            Iniciar sesión
                          </Button>
                          {error && <p style={{ color: "red" }}>{error}</p>}
                          <a
                            href="/loginEntrenador"
                            className="text-primary mt-3 d-block"
                          >
                            ¿Iniciar sesión como entrenador?
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

export default withRouter(LoginAdmin);
