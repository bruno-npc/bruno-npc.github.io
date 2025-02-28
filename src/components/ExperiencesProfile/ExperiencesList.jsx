import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import ExperienceModal from "./modalExperiences/ExperienceModal";
import "./ExperiencesList.css";

function ExperiencesList() {
  const [experiences, setExperiences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "experiences"));
      const list = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setExperiences(list);
    } catch (error) {
      console.error("Erro ao buscar experiências:", error);
    }
  };

  // Converte "YYYY-MM-DD" em "DD/MM/YYYY"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Monta período: ex.: "01/05/2022 - Atual" ou "01/05/2022 - 10/12/2022"
  const getPeriod = (exp) => {
    const start = formatDate(exp.startDate);
    const end = exp.endDate ? formatDate(exp.endDate) : "Atual";
    if (!start) return "";
    return `${start} - ${end}`;
  };

  const handleNewExp = () => {
    setEditingExp(null);
    setShowModal(true);
  };

  const handleEditExp = (exp) => {
    setEditingExp(exp);
    setShowModal(true);
  };

  const handleCloseModal = (reload = false) => {
    setShowModal(false);
    setEditingExp(null);
    if (reload) {
      fetchExperiences();
    }
  };

  const handleDeleteExp = async (id) => {
    try {
      await deleteDoc(doc(db, "experiences", id));
      fetchExperiences();
    } catch (error) {
      console.error("Erro ao excluir experiência:", error);
    }
  };

  return (
    <div className="experiences-list-container">
      <Button variant="success" onClick={handleNewExp}>
        + Novo
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Cargo</th>
            <th>Período</th>
            <th>Stacks</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {experiences.map((exp) => {
            // Converte array de stacks em string
            const stacksText = Array.isArray(exp.stacks)
              ? exp.stacks.join(", ")
              : "";

            return (
              <tr key={exp.id}>
                <td>{exp.company}</td>
                <td>{exp.role}</td>
                <td>{getPeriod(exp)}</td>
                <td>{stacksText}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEditExp(exp)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteExp(exp.id)}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {showModal && (
        <ExperienceModal
          show={showModal}
          handleClose={handleCloseModal}
          editingExp={editingExp}
        />
      )}
    </div>
  );
}

export default ExperiencesList;