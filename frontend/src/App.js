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
import CrudClients from "./components/Entrenador/dashboardEntrenador";
import CrudRoutines from "./components/Entrenador/dashboardRutinas";
library.add(fas);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/loginAdmin" element={<LoginAdmin />} />
        <Route path="/loginEntrenador" element={<LoginEntrenador />} />
        <Route path="/homeAdmin/" element={<CrudTrainers />} />
        <Route path="/homeEntrenador/" element={<CrudClients />} />
        <Route path="/crudRutinas/" element={<CrudRoutines />} />
      </Routes>
    </Router>
  );
}

export default App;
