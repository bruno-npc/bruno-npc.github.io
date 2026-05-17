import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { auth, firebaseInitializationError, isFirebaseConfigured } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { InfoOutlined } from "@mui/icons-material";
import "./Login.css";

const getLoginErrorMessage = (error) => {
  switch (error?.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email ou senha inválidos.";
    case "auth/invalid-email":
      return "Email inválido.";
    case "auth/too-many-requests":
      return "Muitas tentativas de login. Aguarde alguns minutos e tente novamente.";
    case "auth/operation-not-allowed":
      return "Login por email/senha não está habilitado no Firebase Authentication.";
    case "auth/network-request-failed":
      return "Falha de rede ao conectar no Firebase.";
    default:
      return `Erro ao fazer login${error?.code ? ` (${error.code})` : ""}.`;
  }
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!auth || !isFirebaseConfigured) {
        throw new Error(
          firebaseInitializationError?.message ||
          "Firebase não configurado neste ambiente. Verifique o .env.local ou os secrets do deploy."
        );
      }

      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (error) {
      console.error("Erro ao fazer login:", {
        code: error.code,
        message: error.message,
        name: error.name,
      });
      setError(error.code ? getLoginErrorMessage(error) : error.message);
    }
  };

  return (
    <section className="login-section">
      <Container className="login-container">
        <h2 className="text-center mb-4">Login</h2>

        {/* Mensagem informativa */}
        <Card className="info-card mb-4">
          <Card.Body>
            <div className="d-flex align-items-center mb-2">
              <InfoOutlined className="info-icon me-2" />
              <h5 className="mb-0">Acesso Restrito</h5>
            </div>
            <p className="mb-0">
              Esta área é exclusiva para o proprietário do portfólio. Apenas o administrador possui permissão para realizar atualizações no sistema.
            </p>
          </Card.Body>
        </Card>

        {!auth && (
          <Alert variant="warning">
            Firebase Auth não está configurado neste ambiente. Para testar localmente, crie um arquivo
            <code> .env.local </code>
            com as variáveis <code>REACT_APP_FIREBASE_*</code>.
          </Alert>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={!auth}>
            Entrar
          </Button>
        </Form>
      </Container>
    </section>
  );
}

export default Login;
