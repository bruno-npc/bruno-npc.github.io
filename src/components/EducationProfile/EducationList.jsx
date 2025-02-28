import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import EducationModal from "./modalEducation/EducationModal";
import "./EducationList.css";

function EducationList() {
  const [educations, setEducations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "educations"));
      const list = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setEducations(list);
    } catch (error) {
      console.error("Erro ao buscar educations:", error);
    }
  };

  // Converte "YYYY-MM-DD" em "DD/MM/YYYY"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Monta período: "DD/MM/YYYY - DD/MM/YYYY" ou "Atual" se não tiver endDate
  const getPeriod = (edu) => {
    const start = formatDate(edu.startDate);
    const end = edu.endDate ? formatDate(edu.endDate) : "Atual";
    if (!start) return "";
    return `${start} - ${end}`;
  };

  const handleNewEdu = () => {
    setEditingEdu(null);
    setShowModal(true);
  };

  const handleEditEdu = (edu) => {
    setEditingEdu(edu);
    setShowModal(true);
  };

  const handleCloseModal = (reload = false) => {
    setShowModal(false);
    setEditingEdu(null);
    if (reload) {
      fetchEducations();
    }
  };

  const handleDeleteEdu = async (id) => {
    try {
      await deleteDoc(doc(db, "educations", id));
      fetchEducations();
    } catch (error) {
      console.error("Erro ao excluir educação:", error);
    }
  };

  return (
    <div className="education-list-container">
      <Button variant="success" onClick={handleNewEdu}>
        + Novo
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Nome</th>
            <th>Instituição</th>
            <th>Período</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {educations.map((edu) => (
            <tr key={edu.id}>
              <td>{edu.type}</td>
              <td>{edu.name}</td>
              <td>{edu.institution}</td>
              <td>{getPeriod(edu)}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEditEdu(edu)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteEdu(edu.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <EducationModal
          show={showModal}
          handleClose={handleCloseModal}
          editingEdu={editingEdu}
        />
      )}
    </div>
  );
}

export default EducationList;