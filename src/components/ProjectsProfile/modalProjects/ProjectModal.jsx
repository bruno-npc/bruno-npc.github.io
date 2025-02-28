import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import "./ProjectModal.css";

function ProjectModal({ show, handleClose, editingProject }) {
  const [title, setTitle] = useState("");
  const [stacks, setStacks] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState(""); // campo de texto com vários links
  const [projectLink, setProjectLink] = useState("");
  const [repoLink, setRepoLink] = useState(""); // opcional: link do código

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title || "");
      setStacks(editingProject.stacks ? editingProject.stacks.join(", ") : "");
      setDescription(editingProject.description || "");

      // Se vier um array de imagens, convertemos em string separada por quebras de linha
      if (Array.isArray(editingProject.images)) {
        setImages(editingProject.images.join("\n"));
      } else {
        setImages(editingProject.images || "");
      }

      setProjectLink(editingProject.projectLink || "");
      setRepoLink(editingProject.repoLink || "");
    } else {
      // Novo
      setTitle("");
      setStacks("");
      setDescription("");
      setImages("");
      setProjectLink("");
      setRepoLink("");
    }
  }, [editingProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Transforma a string de imagens (separada por quebra de linha OU vírgula) em array
    let imagesArray = images
      .split(/\r?\n|,/)
      .map((url) => url.trim())
      .filter((url) => url !== "");

    // Transforma stacks em array
    let stacksArray = stacks
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    const payload = {
      title,
      description,
      images: imagesArray,
      stacks: stacksArray,
      projectLink,
      repoLink,
    };

    try {
      if (editingProject) {
        await updateDoc(doc(db, "projetos", editingProject.id), payload);
      } else {
        await addDoc(collection(db, "projetos"), payload);
      }
      handleClose(true);
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
    }
  };

  return (
    <Modal show={show} onHide={() => handleClose(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingProject ? "Editar Projeto" : "Novo Projeto"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stacks (separadas por vírgula)</Form.Label>
            <Form.Control
              type="text"
              value={stacks}
              onChange={(e) => setStacks(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          {/**
           * Novo campo: Múltiplos links de imagens.
           * O usuário pode digitar cada link numa linha ou separados por vírgula.
           */}
          <Form.Group className="mb-3">
            <Form.Label>Links das Imagens (1 por linha ou separado por vírgula)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={images}
              onChange={(e) => setImages(e.target.value)}
              placeholder="Exemplo:\nhttps://meusite.com/img1.jpg\nhttps://meusite.com/img2.jpg"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Link do Projeto (Deploy / Demo)</Form.Label>
            <Form.Control
              type="text"
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              placeholder="Ex: https://meusite.com"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Link do Código (GitHub / GitLab)</Form.Label>
            <Form.Control
              type="text"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              placeholder="Ex: https://github.com/meu-repo"
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

export default ProjectModal;