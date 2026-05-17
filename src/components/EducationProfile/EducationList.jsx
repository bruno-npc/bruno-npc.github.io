import React from "react";
import { Table, Button } from "react-bootstrap";
import useAdminCollection from "../../hooks/useAdminCollection";
import { getPeriod } from "../../utils/date";
import EducationModal from "./modalEducation/EducationModal";
import "./EducationList.css";

function EducationList() {
  const {
    items: educations,
    showModal,
    editingItem,
    openNew,
    openEdit,
    closeModal,
    deleteItem,
  } = useAdminCollection("educations", "educação");

  return (
    <div className="education-list-container">
      <Button variant="success" onClick={openNew}>
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
                  onClick={() => openEdit(edu)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteItem(edu.id)}
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
          handleClose={closeModal}
          editingEdu={editingItem}
        />
      )}
    </div>
  );
}

export default EducationList;
