import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Link } from "react-router-dom";
import localforage from "localforage";
import { 
  Grid, 
  Typography, 
  CircularProgress, 
  useTheme 
} from "@mui/material";
import { Section, Card, Button } from "../../ui-components";

const CACHE_KEY = "projectsData";
const ONE_HOUR = 60 * 60 * 1000; // 3600000 ms

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

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
    <Section 
      id="projects" 
      title="Projetos"
      bgColor={theme.palette.background.default}
    >
      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <CircularProgress color="primary" />
        </div>
      )}
      
      {error && (
        <Typography 
          color="error" 
          align="center" 
          sx={{ mb: 4 }}
        >
          {error}
        </Typography>
      )}
      
      {!loading && projects.length === 0 && (
        <Typography 
          color="text.secondary" 
          align="center" 
          sx={{ mb: 4 }}
        >
          Nenhum projeto cadastrado.
        </Typography>
      )}
      
      {!loading && projects.length > 0 && (
        <Grid container spacing={3}>
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
              <Grid item xs={12} sm={6} md={4} key={proj.id}>
                <Card
                  title={proj.title}
                  subtitle={`Stacks: ${truncatedStacks}`}
                  image={firstImage}
                  imageHeight={200}
                  imageAlt={proj.title}
                  elevation={3}
                  sx={{ height: '100%' }}
                  actions={
                    <Link to={`/project/${proj.id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="contained" color="primary">
                        Ver Mais
                      </Button>
                    </Link>
                  }
                >
                  <Typography variant="body2" color="text.secondary">
                    {truncatedDesc}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Section>
  );
}

export default Projects;