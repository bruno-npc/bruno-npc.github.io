import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { InfoOutlined } from "@mui/icons-material";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (error) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
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

          <Button variant="primary" type="submit" className="w-100">
            Entrar
          </Button>
        </Form>
      </Container>
    </section>
  );
}

export default Login;