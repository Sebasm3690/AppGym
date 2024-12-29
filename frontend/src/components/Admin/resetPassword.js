import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { show_alerta } from "../../functions";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = "Admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/reset-password/${uid}/${token}/`,
        {
          password,
        }
      );
      show_alerta(response.data.mensaje, "success");
      navigate("/login" + user + "/");
      setError("");
    } catch (err) {
      show_alerta(
        err.response?.data?.error || "Algo ocurrió inesperadamente",
        "error"
      );
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Reset Password
        </Button>
      </Form>
    </div>
  );
};

export default ResetPassword;
