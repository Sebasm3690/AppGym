// index.js or App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import LoginAdmin from "./components/Admin/Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CrudTrainers from "./components/Admin/dashboardAdmin";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Optional if you want to use the styles directly
import LoginEntrenador from "./components/Entrenador/Login";
import LoginCliente from "./components/Cliente/Login";
import CrudClients from "./components/Entrenador/dashboardEntrenador";
import CrudRoutines from "./components/Entrenador/dashboardRutinas";
import AssignRoutines from "./components/Entrenador/dashboardAsignarRutina";
import ClientControl from "./components/Cliente/dashboardCliente";
import HomeClient from "./components/Cliente/Home";
import Home from "./components/Otros/Home";
library.add(fas);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/loginAdmin" element={<LoginAdmin />} />
        <Route path="/loginEntrenador" element={<LoginEntrenador />} />
        <Route path="/loginCliente" element={<LoginCliente />} />
        <Route path="/homeAdmin/" element={<CrudTrainers />} />
        <Route path="/homeEntrenador/" element={<CrudClients />} />
        <Route path="/crudRutinas/" element={<CrudRoutines />} />
        <Route path="/assignRoutines/" element={<AssignRoutines />} />
        <Route path="/dashboardControlCalorico/" element={<ClientControl />} />
        <Route path="/homeCliente/" element={<HomeClient />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
