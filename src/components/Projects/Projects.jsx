import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Link } from "react-router-dom";
import localforage from "localforage"; // Importa o localforage
import "./Projects.css";

const CACHE_KEY = "projectsData";
const ONE_HOUR = 60 * 60 * 1000; // 3600000 ms

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Tenta obter os dados do cache
        const cachedData = await localforage.getItem(CACHE_KEY);

        if (cachedData) {
          const { projects: cachedProjects, lastFetched } = cachedData;
          // Atualiza o estado com os dados do cache imediatamente
          setProjects(cachedProjects);

          // Se os dados foram buscados há menos de 1 hora, não refaz a consulta
          if (Date.now() - lastFetched < ONE_HOUR) {
            setLoading(false);
            return;
          }
          // Caso contrário, cai para atualizar os dados (caso o cache esteja desatualizado)
        }

        // Busca os dados atualizados no Firestore
        const querySnapshot = await getDocs(collection(db, "projetos"));
        const projectsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsList);

        // Salva os dados atualizados no cache junto com o timestamp atual
        await localforage.setItem(CACHE_KEY, {
          projects: projectsList,
          lastFetched: Date.now(),
        });
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        setError("Erro ao carregar os projetos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Funções auxiliares para truncar descrição e stacks
  const truncateDescription = (desc = "", maxLen = 100) => {
    if (desc.length <= maxLen) return desc;
    return desc.substring(0, maxLen) + "...";
  };

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