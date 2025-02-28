import React, { useState, useEffect } from "react";
import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import { db } from "../../../firebaseConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import "./ModalSkills.css";

const allIcons = [
  "FaReact",
  "FaNodeJs",
  "FaPython",
  "FaHtml5",
  "FaJava",
  "FaAws",
  "FaDocker",
  "FaDatabase",
  "FaAngular",
  "FaVuejs",
];

function SkillsModal({ show, handleClose, editingSkill }) {

  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState([""]);
  const [tags, setTags] = useState([]);
  const [icon, setIcon] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [iconSearch, setIconSearch] = useState("");

  useEffect(() => {
    if (editingSkill) {
      setTitle(editingSkill.title || "");
      setDescriptions(editingSkill.descriptions || [""]);
      setTags(editingSkill.tags || []);
      setIcon(editingSkill.icon || "");
      setTagInput("");
      setIconSearch("");
    } else {
      setTitle("");
      setDescriptions([""]);
      setTags([]);
      setIcon("");
      setTagInput("");
      setIconSearch("");
    }
  }, [editingSkill]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      descriptions,
      tags,
      icon,
    };

    try {
      if (editingSkill) {
        await updateDoc(doc(db, "skills", editingSkill.id), payload);
      } else {
        await addDoc(collection(db, "skills"), payload);
      }
      handleClose(true);
    } catch (error) {
      console.error("Erro ao salvar skill:", error);
    }
  };

  const handleAddDescription = () => {
    setDescriptions([...descriptions, ""]);
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const handleRemoveDescription = (index) => {
    const newDescriptions = descriptions.filter((_, i) => i !== index);
    setDescriptions(newDescriptions.length > 0 ? newDescriptions : [""]);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const filteredIcons = allIcons.filter((iconName) =>
    iconName.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const handleSelectIcon = (iconName) => {
    setIcon(iconName);
  };

  return (
    <Modal show={show} onHide={() => handleClose(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {editingSkill ? "Editar Skill" : "Nova Skill"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* TÍTULO */}
          <Form.Group className="mb-3">
            <Form.Label>Título da Skill</Form.Label>
            <Form.Control
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Java, Microserviços, React, etc."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Seções de Descrição</Form.Label>
            {descriptions.map((desc, index) => (
              <div key={index} className="description-item mb-2">
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={desc}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    placeholder={`Descrição ${index + 1}`}
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() => handleRemoveDescription(index)}
                  >
                    X
                  </Button>
                </InputGroup>
              </div>
            ))}

            <Button variant="outline-primary" onClick={handleAddDescription}>
              + Adicionar Descrição
            </Button>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <div className="d-flex mb-2">
              <Form.Control
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Ex: java, spring boot, microserviços"
              />
              <Button variant="outline-primary" onClick={handleAddTag} className="ms-2">
                Adicionar
              </Button>
            </div>
            <div className="tags-container">
              {tags.map((tag) => (
                <span key={tag} className="tag-badge">
                  {tag}
                  <Button
                    variant="link"
                    className="tag-remove-btn"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    &times;
                  </Button>
                </span>
              ))}
            </div>
          </Form.Group>

          {/* ÍCONE */}
          <Form.Group className="mb-3">
            <Form.Label>Buscar Ícone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite para filtrar ícones disponíveis..."
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
            />
            <div className="icon-list mt-2">
              {filteredIcons.map((iconName) => (
                <Button
                  key={iconName}
                  variant={icon === iconName ? "primary" : "outline-secondary"}
                  className="icon-btn"
                  onClick={() => handleSelectIcon(iconName)}
                >
                  {iconName}
                </Button>
              ))}
            </div>
            {icon && (
              <Form.Text className="text-success">
                Ícone selecionado: <strong>{icon}</strong>
              </Form.Text>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose(false)}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Salvar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SkillsModal;