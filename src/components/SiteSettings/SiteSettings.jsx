import React, { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { DEFAULT_SITE_SETTINGS } from "../../services/siteSettings";

const mergeSettings = (settings = {}) => ({
  navbar: { ...DEFAULT_SITE_SETTINGS.navbar, ...(settings.navbar || {}) },
  maintenance: { ...DEFAULT_SITE_SETTINGS.maintenance, ...(settings.maintenance || {}) },
  contact: { ...DEFAULT_SITE_SETTINGS.contact, ...(settings.contact || {}) },
  footer: { ...DEFAULT_SITE_SETTINGS.footer, ...(settings.footer || {}) },
});

function SiteSettings() {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!db) return;

        const snap = await getDoc(doc(db, "siteSettings", "main"));
        if (snap.exists()) {
          setSettings(mergeSettings(snap.data()));
        }
      } catch (error) {
        console.error("Erro ao buscar configurações:", error);
        setMessage(`Erro: ${error.message}`);
      }
    };

    fetchSettings();
  }, []);

  const updateField = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      if (!db) {
        throw new Error("Firebase indisponível.");
      }

      await setDoc(doc(db, "siteSettings", "main"), settings, { merge: true });
      setMessage("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      setMessage(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="profile-container">
      {message && <Alert variant="info">{message}</Alert>}

      <Form>
        <h5>Navegação</h5>
        <Form.Group className="mt-3">
          <Form.Label>Nome no menu</Form.Label>
          <Form.Control
            value={settings.navbar.brand}
            onChange={(e) => updateField("navbar", "brand", e.target.value)}
          />
        </Form.Group>
        {["home", "skills", "experiences", "education", "projects", "contact", "login", "admin", "logout"].map((field) => (
          <Form.Group className="mt-3" key={field}>
            <Form.Label>Texto: {field}</Form.Label>
            <Form.Control
              value={settings.navbar[field]}
              onChange={(e) => updateField("navbar", field, e.target.value)}
            />
          </Form.Group>
        ))}

        <h5 className="mt-4">Contato e EmailJS</h5>
        <Form.Group className="mt-3">
          <Form.Label>Título da seção</Form.Label>
          <Form.Control
            value={settings.contact.title}
            onChange={(e) => updateField("contact", "title", e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Subtítulo da seção</Form.Label>
          <Form.Control
            value={settings.contact.subtitle}
            onChange={(e) => updateField("contact", "subtitle", e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>EmailJS Service ID</Form.Label>
          <Form.Control
            value={settings.contact.emailJsServiceId}
            onChange={(e) => updateField("contact", "emailJsServiceId", e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>EmailJS Template ID</Form.Label>
          <Form.Control
            value={settings.contact.emailJsTemplateId}
            onChange={(e) => updateField("contact", "emailJsTemplateId", e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>EmailJS Public Key</Form.Label>
          <Form.Control
            value={settings.contact.emailJsPublicKey}
            onChange={(e) => updateField("contact", "emailJsPublicKey", e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Mensagem de sucesso</Form.Label>
          <Form.Control
            value={settings.contact.successMessage}
            onChange={(e) => updateField("contact", "successMessage", e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Mensagem de erro</Form.Label>
          <Form.Control
            value={settings.contact.errorMessage}
            onChange={(e) => updateField("contact", "errorMessage", e.target.value)}
          />
        </Form.Group>

        <h5 className="mt-4">Manutenção</h5>
        {Object.keys(settings.maintenance).map((field) => (
          <Form.Group className="mt-3" key={field}>
            <Form.Label>{field}</Form.Label>
            <Form.Control
              as={field.toLowerCase().includes("message") || field.toLowerCase().includes("footer") ? "textarea" : "input"}
              rows={3}
              value={settings.maintenance[field]}
              onChange={(e) => updateField("maintenance", field, e.target.value)}
            />
          </Form.Group>
        ))}

        <h5 className="mt-4">Rodapé</h5>
        <Form.Group className="mt-3">
          <Form.Label>Nome/assinatura do copyright</Form.Label>
          <Form.Control
            value={settings.footer.copyrightName}
            onChange={(e) => updateField("footer", "copyrightName", e.target.value)}
          />
        </Form.Group>

        <Button className="mt-3" variant="primary" onClick={handleSave}>
          Salvar Configurações
        </Button>
      </Form>
    </div>
  );
}

export default SiteSettings;
