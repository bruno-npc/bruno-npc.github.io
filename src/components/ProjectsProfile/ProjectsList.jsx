import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import ProjectModal from "./modalProjects/ProjectModal";
import "./ProjectsList.css";

function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projetos"));
      const list = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setProjects(list);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
    }
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleCloseModal = (reload = false) => {
    setShowModal(false);
    setEditingProject(null);
    if (reload) fetchProjects();
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "projetos", id));
      fetchProjects();
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
    }
  };

  return (
    <div className="projects-list-container">
      <Button variant="success" onClick={handleNewProject}>
        + Novo Projeto
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Título</th>
            <th>Stacks</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const stacksText = Array.isArray(p.stacks)
              ? p.stacks.join(", ")
              : "";
            return (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{stacksText}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEditProject(p)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(p.id)}
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
        <ProjectModal
          show={showModal}
          handleClose={handleCloseModal}
          editingProject={editingProject}
        />
      )}
    </div>
  );
}

export default ProjectsList;