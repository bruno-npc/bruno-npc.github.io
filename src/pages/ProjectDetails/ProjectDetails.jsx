import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Spinner, Alert, Button, Carousel } from "react-bootstrap";
import "./ProjectDetails.css";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projetos", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Projeto não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar projeto:", err);
        setError("Erro ao carregar projeto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-4">
        <Alert variant="danger">{error}</Alert>
        <Link to="/">
          <Button variant="secondary">Voltar</Button>
        </Link>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const {
    title,
    description,
    images = [],
    stacks = [],
    projectLink,
    repoLink,
  } = project;

  return (
    <section className="project-details-section">
      {/* Wrapper que centraliza e limita a largura */}
      <div className="project-details-wrapper">
        <div className="project-details-container">
          {/* Coluna esquerda */}
          <div className="project-details-info">
            <h2>{title}</h2>

            {stacks.length > 0 && (
              <div className="stacks-container">
                {stacks.map((stack, idx) => (
                  <span key={idx} className="stack-badge">
                    {stack}
                  </span>
                ))}
              </div>
            )}

            <p className="project-description">{description}</p>

            {projectLink && (
              <a href={projectLink} target="_blank" rel="noreferrer">
                <Button variant="info" className="me-2">
                  Acessar Projeto
                </Button>
              </a>
            )}
            {repoLink && (
              <a href={repoLink} target="_blank" rel="noreferrer">
                <Button variant="dark" className="me-2">
                  Ver Código
                </Button>
              </a>
            )}
          </div>

          {/* Coluna direita: carousel */}
          <div className="project-carousel">
            {images.length > 0 ? (
              <Carousel variant="dark">
                {images.map((imgUrl, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={imgUrl}
                      alt={`Slide ${index}`}
                      className="d-block w-100"
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <p>Nenhuma imagem disponível.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectDetails;