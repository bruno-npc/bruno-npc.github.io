import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Profile.css";

function Profile() {
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutSubtitle, setAboutSubtitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [message, setMessage] = useState("");

  const docId = "meuPerfil";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = doc(db, "profileData", docId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setAboutTitle(data.aboutTitle || "");
          setAboutSubtitle(data.aboutSubtitle || "");
          setAboutDescription(data.aboutDescription || "");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const ref = doc(db, "profileData", docId);
      await setDoc(ref, {
        aboutTitle,
        aboutSubtitle,
        aboutDescription
      });

      setMessage("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setMessage(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="profile-container">
      {message && <Alert variant="info">{message}</Alert>}

      <Form>
        <Form.Group>
          <Form.Label>Título (Sobre Mim)</Form.Label>
          <Form.Control
            type="text"
            value={aboutTitle}
            onChange={(e) => setAboutTitle(e.target.value)}
            placeholder="Ex: Bruno Souza"
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Subtítulo</Form.Label>
          <Form.Control
            type="text"
            value={aboutSubtitle}
            onChange={(e) => setAboutSubtitle(e.target.value)}
            placeholder="Ex: Desenvolvedor Full Stack"
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={aboutDescription}
            onChange={(e) => setAboutDescription(e.target.value)}
            placeholder="Fale um pouco sobre você..."
          />
        </Form.Group>

        <Button className="mt-3" variant="primary" onClick={handleSave}>
          Salvar
        </Button>
      </Form>
    </div>
  );
}

export default Profile;