import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { db } from "../../../firebaseConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import "./EducationModal.css";

function EducationModal({ show, handleClose, editingEdu }) {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [details, setDetails] = useState("");
  const [link, setLink] = useState(""); // opcional
  // Novos campos de data
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (editingEdu) {
      setType(editingEdu.type || "");
      setName(editingEdu.name || "");
      setInstitution(editingEdu.institution || "");
      setDetails(editingEdu.details || "");
      setLink(editingEdu.link || "");

      // Se existirem, carregamos as datas salvas (strings "YYYY-MM-DD")
      setStartDate(editingEdu.startDate || "");
      setEndDate(editingEdu.endDate || "");
    } else {
      // Novo
      setType("");
      setName("");
      setInstitution("");
      setDetails("");
      setLink("");
      setStartDate("");
      setEndDate("");
    }
  }, [editingEdu]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      type,
      name,
      institution,
      details,
      link,
      // Salva as datas no formato YYYY-MM-DD (inputs type="date")
      startDate,
      endDate,
    };

    try {
      if (editingEdu) {
        await updateDoc(doc(db, "educations", editingEdu.id), payload);
      } else {
        await addDoc(collection(db, "educations"), payload);
      }
      handleClose(true);
    } catch (error) {
      console.error("Erro ao salvar educação:", error);
    }
  };

  return (
    <Modal show={show} onHide={() => handleClose(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingEdu ? "Editar Educação" : "Nova Educação"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tipo (Ex.: Graduação, Curso)</Form.Label>
            <Form.Control
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Instituição</Form.Label>
            <Form.Control
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </Form.Group>

          {/* Data de Início */}
          <Form.Group className="mb-3">
            <Form.Label>Data de Início</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Form.Text className="text-muted">
              Data no formato YYYY-MM-DD
            </Form.Text>
          </Form.Group>

          {/* Data de Término */}
          <Form.Group className="mb-3">
            <Form.Label>Data de Término</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Form.Text className="text-muted">
              Pode deixar em branco se ainda em andamento.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Detalhes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            <Form.Text className="text-muted">
              Se for curso com tópicos, você pode separar por vírgula.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Link (opcional)</Form.Label>
            <Form.Control
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Ex.: https://www.udemy.com/..."
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

export default EducationModal;