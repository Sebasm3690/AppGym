import React, { useState } from "react";
import {
  InputGroup,
  FormControl,
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onSearch }) => {
  /*Assign each attribute   */
  const [searchParams, setSearchParams] = useState({
    nombre: "",
    enfoque: "",
  });

  //Update params
  const handleInputChange = (field, value) => {
    setSearchParams({ ...searchParams, [field]: value });
  };

  //Finally send the params to update to the function in DashboardAsignarRutina
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  return (
    <Form onSubmit={handleSearch}>
      <Row className="justify-content-center align-items-center">
        {/* Input for "Nombre" */}
        <Col xs={12} sm={5} md={4} lg={3} className="mb-2">
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Nombre"
              value={searchParams.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              style={{ marginBottom: "16px" }}
            />
          </InputGroup>
        </Col>
        {/* Input for "Enfoque" */}
        <Col xs={12} sm={5} md={4} lg={3} className="mb-2">
          <InputGroup>
            <Form.Select
              type="select"
              placeholder="Apellido"
              value={searchParams.enfoque}
              onChange={(e) => handleInputChange("enfoque", e.target.value)}
              style={{ marginBottom: "11px", height: "45px" }}
            >
              <option value="">Enfoque</option>
              <option value="Cuerpo completo">Cuerpo completo</option>
              <option value="Torso">Torso</option>
              <option value="Espalda">Espalda</option>
              <option value="Pecho">Pecho</option>
              <option value="Brazos">Brazos</option>
              <option value="Piernas">Pierna</option>
            </Form.Select>
          </InputGroup>
        </Col>
        {/* Search Button */}
        <Col xs={12} sm={2} className="text-center mb-2">
          <Button
            type="submit"
            variant="primary"
            className="w-100"
            style={{ marginBottom: "16px" }}
          >
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
