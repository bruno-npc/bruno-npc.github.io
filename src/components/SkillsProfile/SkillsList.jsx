import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import SkillsModal from "./modalSkills/ModalSkills";
import "./SkillsList.css";
import { FaReact, FaNodeJs, FaPython, FaHtml5 } from "react-icons/fa";
const iconMap = {
  FaReact: FaReact,
  FaNodeJs: FaNodeJs,
  FaPython: FaPython,
  FaHtml5: FaHtml5,
};

function SkillsList() {
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  // Carrega skills no início
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "skills"));
      const skillsList = [];
      querySnapshot.forEach((docSnap) => {
        skillsList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setSkills(skillsList);
    } catch (error) {
      console.error("Erro ao buscar skills:", error);
    }
  };

  const handleNewSkill = () => {
    setEditingSkill(null);
    setShowModal(true);
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setShowModal(true);
  };

  const handleCloseModal = (reload = false) => {
    setShowModal(false);
    setEditingSkill(null);
    if (reload) {
      fetchSkills();
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteDoc(doc(db, "skills", id));
      fetchSkills();
    } catch (error) {
      console.error("Erro ao excluir skill:", error);
    }
  };

  return (
    <div className="skills-list-container">
      <Button variant="success" onClick={handleNewSkill}>
        + Novo
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ícone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => {
            const IconComponent = iconMap[skill.icon] || null;
            return (
              <tr key={skill.id}>
                <td>{skill.name}</td>
                <td>{skill.description}</td>
                <td>
                  {/* Se skill.icon existir no map, exibe o componente */}
                  {IconComponent && <IconComponent size={24} />}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEditSkill(skill)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteSkill(skill.id)}
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
        <SkillsModal
          show={showModal}
          handleClose={handleCloseModal}
          editingSkill={editingSkill}
        />
      )}
    </div>
  );
}

export default SkillsList;