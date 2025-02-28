import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Link } from "react-router-dom";
import "./Projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projetos"));
        const projectsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsList);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        setError("Erro ao carregar os projetos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Trunca descrição para 100 caracteres
  const truncateDescription = (desc = "", maxLen = 100) => {
    if (desc.length <= maxLen) return desc;
    return desc.substring(0, maxLen) + "...";
  };

  // Trunca stacks (mostra apenas 3)
  const truncateStacks = (stacks = [], maxCount = 3) => {
    if (stacks.length <= maxCount) return stacks.join(", ");
    const sliced = stacks.slice(0, maxCount);
    return sliced.join(", ") + " ...";
  };

  return (
    <section id="projects" className="projects-section">
      <Container>
        <h2 className="text-center mb-4">Projetos</h2>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          </div>
        )}
        {error && <p className="text-center text-danger">{error}</p>}
        {!loading && projects.length === 0 && (
          <p className="text-center text-muted">Nenhum projeto cadastrado.</p>
        )}

        {!loading && projects.length > 0 && (
          <Row>
            {projects.map((proj) => {
              const truncatedDesc = truncateDescription(proj.description, 100);
              const truncatedStacks = Array.isArray(proj.stacks)
                ? truncateStacks(proj.stacks)
                : "";

              const firstImage =
                Array.isArray(proj.images) && proj.images[0]
                  ? proj.images[0]
                  : "https://via.placeholder.com/300x200?text=Sem+Imagem";

              return (
                <Col md={4} key={proj.id} className="mb-4">
                  <Card className="project-card h-100">
                    <Card.Img variant="top" src={firstImage} alt={proj.title} />
                    <Card.Body>
                      <div className="card-content">
                        <Card.Title>{proj.title}</Card.Title>
                        <Card.Text>
                          <strong>Stacks:</strong> {truncatedStacks}
                        </Card.Text>
                        <Card.Text>{truncatedDesc}</Card.Text>
                      </div>

                      {/* Único botão: "Ver Mais" */}
                      <div className="buttons-container">
                        <Link to={`/project/${proj.id}`}>
                          <Button variant="primary">Ver Mais</Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </section>
  );
}

export default Projects;