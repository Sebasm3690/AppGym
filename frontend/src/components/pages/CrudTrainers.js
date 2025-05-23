import React, { useState } from "react";
import useTrainers from "../hooks/useTrainers";
import TrainersTable from "../Admin/TrainersTable";
import AddTrainerModal from "../Admin/Modals/AddTrainerModal";
import EditTrainerModal from "../Admin/Modals/EditTrainerModal";
import DeleteTrainerModal from "../Admin/Modals/DeleteTrainerModal";
import DeletedTrainersModal from "../Admin/Modals/DeletedTrainersModal";
import NavbarAdmin from "../Otros/NavBarAdmin";

const CrudTrainers = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
  const { trainers, addTrainer, updateTrainer, deleteTrainer, restoreTrainer } =
    useTrainers(apiUrl);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedTrainersModal, setShowDeletedTrainersModal] =
    useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const handleDeleteTrainer = (id) => {
    setSelectedTrainer(id);
    setShowDeleteModal(true);
  };

  const handleRestoreTrainer = () => {
    if (selectedTrainer) restoreTrainer(selectedTrainer);
    setShowDeleteModal(false);
  };

  return (
    <>
      <NavbarAdmin />
      <TrainersTable
        trainers={trainers}
        onDelete={handleDeleteTrainer}
        onEdit={(trainer) => setSelectedTrainer(trainer)}
        onRestore={(trainerId) => restoreTrainer(trainerId)}
      />
      <AddTrainerModal onAdd={addTrainer} />
      <EditTrainerModal
        trainerToEdit={selectedTrainer}
        onUpdate={updateTrainer}
      />
      <DeleteTrainerModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => deleteTrainer(selectedTrainer)}
      />
      <DeletedTrainersModal
        show={showDeletedTrainersModal}
        onClose={() => setShowDeletedTrainersModal(false)}
        trainers={trainers}
        onRestore={restoreTrainer}
      />
    </>
  );
};

export default CrudTrainers;
