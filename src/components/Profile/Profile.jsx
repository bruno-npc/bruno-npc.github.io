import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Profile.css";

function Profile() {
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutSubtitle, setAboutSubtitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const docId = "meuPerfil";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!db) return;

        const ref = doc(db, "profileData", docId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setAboutTitle(data.aboutTitle || "");
          setAboutSubtitle(data.aboutSubtitle || "");
          setAboutDescription(data.aboutDescription || "");
          setProfileImageUrl(data.profileImageUrl || "");
          setResumeUrl(data.resumeUrl || "");
          setGithubUrl(data.socialLinks?.github || "");
          setLinkedinUrl(data.socialLinks?.linkedin || "");
          setInstagramUrl(data.socialLinks?.instagram || "");
          setEmail(data.socialLinks?.email || "");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      if (!db) {
        throw new Error("Firebase indisponível.");
      }

      const ref = doc(db, "profileData", docId);
      await setDoc(ref, {
        aboutTitle,
        aboutSubtitle,
        aboutDescription,
        profileImageUrl,
        resumeUrl,
        socialLinks: {
          github: githubUrl,
          linkedin: linkedinUrl,
          instagram: instagramUrl,
          email,
        },
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

        <Form.Group className="mt-3">
          <Form.Label>URL da foto de perfil</Form.Label>
          <Form.Control
            type="url"
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            placeholder="https://..."
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>URL do currículo</Form.Label>
          <Form.Control
            type="url"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>GitHub</Form.Label>
          <Form.Control
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/seu-usuario"
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>LinkedIn</Form.Label>
          <Form.Control
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://www.linkedin.com/in/seu-usuario"
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Instagram</Form.Label>
          <Form.Control
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="https://www.instagram.com/seu-usuario"
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu-email@dominio.com"
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
