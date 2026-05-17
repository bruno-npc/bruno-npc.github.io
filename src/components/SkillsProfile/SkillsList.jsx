import React from "react";
import { Table, Button } from "react-bootstrap";
import useAdminCollection from "../../hooks/useAdminCollection";
import SkillsModal from "./modalSkills/ModalSkills";
import "./SkillsList.css";
import { getIconComponent } from "../../utils/iconRegistry";

function SkillsList() {
  const {
    items: skills,
    showModal,
    editingItem,
    openNew,
    openEdit,
    closeModal,
    deleteItem,
  } = useAdminCollection("skills", "skills");

  return (
    <div className="skills-list-container">
      <Button variant="success" onClick={openNew}>
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
            const IconComponent = getIconComponent(skill.icon);
            const description = Array.isArray(skill.descriptions)
              ? skill.descriptions.filter(Boolean).join(" / ")
              : skill.description;

            return (
              <tr key={skill.id}>
                <td>{skill.title || skill.name}</td>
                <td>{description}</td>
                <td>{IconComponent && <IconComponent size={24} />}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => openEdit(skill)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteItem(skill.id)}
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
          handleClose={closeModal}
          editingSkill={editingItem}
        />
      )}
    </div>
  );
}

export default SkillsList;
