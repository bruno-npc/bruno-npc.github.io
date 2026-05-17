import React from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Typography,
  CircularProgress,
  useTheme
} from "@mui/material";
import { Section, Card, Button } from "../../ui-components";
import useCachedCollection from "../../hooks/useCachedCollection";

const CACHE_KEY = "projectsData";

function Projects() {
  const theme = useTheme();
  const { data: projects, loading, error } = useCachedCollection({
    collectionName: "projetos",
    cacheKey: CACHE_KEY,
    errorMessage: "Erro ao carregar os projetos. Tente novamente mais tarde.",
  });

  const truncateDescription = (desc = "", maxLen = 100) => {
    if (desc.length <= maxLen) return desc;
    return `${desc.substring(0, maxLen)}...`;
  };

  const truncateStacks = (stacks = [], maxCount = 3) => {
    if (stacks.length <= maxCount) return stacks.join(", ");
    return `${stacks.slice(0, maxCount).join(", ")} ...`;
  };

  return (
    <Section
      id="projects"
      title="Projetos"
      bgColor={theme.palette.background.default}
    >
      {loading && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <CircularProgress color="primary" />
        </div>
      )}

      {error && (
        <Typography color="error" align="center" sx={{ mb: 4 }}>
          {error}
        </Typography>
      )}

      {!loading && projects.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ mb: 4 }}>
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
                  sx={{ height: "100%" }}
                  actions={
                    <Link to={`/project/${proj.id}`} style={{ textDecoration: "none" }}>
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
