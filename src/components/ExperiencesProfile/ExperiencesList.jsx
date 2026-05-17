import React from "react";
import { Table, Button } from "react-bootstrap";
import useAdminCollection from "../../hooks/useAdminCollection";
import { getPeriod } from "../../utils/date";
import ExperienceModal from "./modalExperiences/ExperienceModal";
import "./ExperiencesList.css";

function ExperiencesList() {
  const {
    items: experiences,
    showModal,
    editingItem,
    openNew,
    openEdit,
    closeModal,
    deleteItem,
  } = useAdminCollection("experiences", "experiências");

  return (
    <div className="experiences-list-container">
      <Button variant="success" onClick={openNew}>
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
            const stacksText = Array.isArray(exp.stacks) ? exp.stacks.join(", ") : "";

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
                    onClick={() => openEdit(exp)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteItem(exp.id)}
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
          handleClose={closeModal}
          editingExp={editingItem}
        />
      )}
    </div>
  );
}

export default ExperiencesList;
