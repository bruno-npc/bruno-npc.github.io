import React from "react";
import { Table, Button } from "react-bootstrap";
import useAdminCollection from "../../hooks/useAdminCollection";
import ProjectModal from "./modalProjects/ProjectModal";
import "./ProjectsList.css";

function ProjectsList() {
  const {
    items: projects,
    showModal,
    editingItem,
    openNew,
    openEdit,
    closeModal,
    deleteItem,
  } = useAdminCollection("projetos", "projetos");

  return (
    <div className="projects-list-container">
      <Button variant="success" onClick={openNew}>
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
            const stacksText = Array.isArray(p.stacks) ? p.stacks.join(", ") : "";
            return (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{stacksText}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => openEdit(p)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteItem(p.id)}
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
          handleClose={closeModal}
          editingProject={editingItem}
        />
      )}
    </div>
  );
}

export default ProjectsList;
