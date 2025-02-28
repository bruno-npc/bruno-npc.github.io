import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { db } from "../../../firebaseConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

function ExperienceModal({ show, handleClose, editingExp }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [details, setDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stacks, setStacks] = useState("");

  useEffect(() => {
    if (editingExp) {
      setCompany(editingExp.company || "");
      setRole(editingExp.role || "");
      setDetails(editingExp.details || "");
      setStartDate(editingExp.startDate || "");
      setEndDate(editingExp.endDate || "");

      // Se `editingExp.stacks` for um array, converte para string (join)
      if (Array.isArray(editingExp.stacks)) {
        setStacks(editingExp.stacks.join(", "));
      } else {
        setStacks(editingExp.stacks || "");
      }
    } else {
      // Cadastro novo
      setCompany("");
      setRole("");
      setDetails("");
      setStartDate("");
      setEndDate("");
      setStacks("");
    }
  }, [editingExp]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Converte o campo `stacks` (string) em array (separado por vírgula)
    const stacksArray = stacks
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const payload = {
      company,
      role,
      details,
      startDate, // salva no formato YYYY-MM-DD (campo type="date")
      endDate,
      stacks: stacksArray,
    };

    try {
      if (editingExp) {
        await updateDoc(doc(db, "experiences", editingExp.id), payload);
      } else {
        await addDoc(collection(db, "experiences"), payload);
      }
      handleClose(true); // Fecha modal e recarrega listagem
    } catch (error) {
      console.error("Erro ao salvar experiência:", error);
    }
  };

  return (
    <Modal show={show} onHide={() => handleClose(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingExp ? "Editar Experiência" : "Nova Experiência"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Empresa</Form.Label>
            <Form.Control
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cargo</Form.Label>
            <Form.Control
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Detalhes / Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data de Início</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Form.Text className="text-muted">
              Data de início (YYYY-MM-DD)
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data de Término</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Form.Text className="text-muted">
              Se estiver trabalhando atualmente, pode deixar em branco.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stacks (separadas por vírgula)</Form.Label>
            <Form.Control
              type="text"
              value={stacks}
              onChange={(e) => setStacks(e.target.value)}
              placeholder="Ex: Java, Spring Boot, Docker"
            />
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

export default ExperienceModal;