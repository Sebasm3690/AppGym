import { useState, useEffect } from "react";
import axios from "axios";

const useTrainers = (apiUrl) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTrainers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/v1/trainer/`);
      setTrainers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTrainer = async (trainerData) => {
    try {
      await axios.post(`${apiUrl}/trainerRegister/`, trainerData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getTrainers(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTrainer = async (id, trainerData) => {
    try {
      await axios.put(`${apiUrl}/updateTrainer/${id}/`, trainerData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getTrainers();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTrainer = async (id) => {
    try {
      await axios.post(`${apiUrl}/borradoLogicoEntrenador/${id}/`);
      getTrainers();
    } catch (err) {
      setError(err.message);
    }
  };

  const restoreTrainer = async (id) => {
    try {
      await axios.post(`${apiUrl}/recuperarEntrenador/${id}/`);
      getTrainers();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getTrainers();
  }, []);

  return {
    trainers, // List of trainers (state)
    addTrainer, // Function to add a trainer
    updateTrainer, // Function to update a trainer
    deleteTrainer, // Function to delete a trainer (soft delete)
    restoreTrainer, // Function to restore a deleted trainer
  };
};

export default useTrainers;
