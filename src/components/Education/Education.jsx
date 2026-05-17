import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  Divider,
  useTheme,
  CircularProgress
} from "@mui/material";
import { Section, Button } from "../../ui-components";
import useCachedCollection from "../../hooks/useCachedCollection";
import { getPeriod } from "../../utils/date";

const CACHE_KEY = "educationData";

function Education() {
  const [selectedEducation, setSelectedEducation] = useState(null);
  const theme = useTheme();
  const { data: educations, loading } = useCachedCollection({
    collectionName: "educations",
    cacheKey: CACHE_KEY,
  });

  useEffect(() => {
    setSelectedEducation((current) => current || educations[0] || null);
  }, [educations]);

  const renderDetails = (edu) => {
    if (edu.type === "Graduação") {
      return (
        <Typography variant="body1" sx={{ mb: 2 }}>
          {edu.details}
        </Typography>
      );
    }

    const items = edu.details ? edu.details.split(",") : [];
    return (
      <List sx={{ pl: 2 }}>
        {items.map((item, idx) => (
          <ListItem key={idx} sx={{ display: "list-item", listStyleType: "disc", py: 0.5 }}>
            <Typography variant="body1">{item.trim()}</Typography>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Section
      id="education"
      title="Educação"
      bgColor={theme.palette.background.default}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 0,
                borderRadius: 2,
                height: "100%",
                backgroundColor: theme.palette.background.paper
              }}
            >
              <List sx={{ p: 0 }}>
                {educations.map((edu, index) => (
                  <React.Fragment key={edu.id}>
                    <ListItem
                      onClick={() => setSelectedEducation(edu)}
                      sx={{
                        p: 2,
                        backgroundColor: selectedEducation && selectedEducation.id === edu.id
                          ? theme.palette.action.selected
                          : "transparent",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                        cursor: "pointer"
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {edu.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getPeriod(edu)}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < educations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {selectedEducation && (
            <Grid item xs={12} md={8}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: "100%",
                  backgroundColor: theme.palette.background.paper
                }}
              >
                <Typography variant="h5" component="h3" gutterBottom>
                  {selectedEducation.name}
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Período:</strong> {getPeriod(selectedEducation)}
                </Typography>

                {renderDetails(selectedEducation)}

                {selectedEducation.link && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      component="a"
                      href={selectedEducation.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Acessar Cursos
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Section>
  );
}

export default Education;
