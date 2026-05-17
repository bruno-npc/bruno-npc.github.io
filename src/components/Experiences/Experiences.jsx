import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  Divider,
  Chip,
  useTheme,
  CircularProgress
} from "@mui/material";
import { Section } from "../../ui-components";
import useCachedCollection from "../../hooks/useCachedCollection";
import { getPeriod } from "../../utils/date";

const CACHE_KEY = "experiencesData";

function Experiences() {
  const [selectedExperience, setSelectedExperience] = useState(null);
  const theme = useTheme();
  const { data: experiences, loading } = useCachedCollection({
    collectionName: "experiences",
    cacheKey: CACHE_KEY,
  });

  useEffect(() => {
    setSelectedExperience((current) => current || experiences[0] || null);
  }, [experiences]);

  return (
    <Section
      id="experiences"
      title="Experiências"
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
                {experiences.map((exp, index) => (
                  <React.Fragment key={exp.id}>
                    <ListItem
                      onClick={() => setSelectedExperience(exp)}
                      sx={{
                        p: 2,
                        backgroundColor: selectedExperience && selectedExperience.id === exp.id
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
                          {exp.company}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {exp.role}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getPeriod(exp)}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < experiences.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {selectedExperience && (
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
                  {selectedExperience.role} - {selectedExperience.company}
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Período:</strong> {getPeriod(selectedExperience)}
                </Typography>

                <Typography variant="body1" sx={{ mb: 3 }}>
                  {selectedExperience.details}
                </Typography>

                {Array.isArray(selectedExperience.stacks) && selectedExperience.stacks.length > 0 && (
                  <Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Stacks:</strong>
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selectedExperience.stacks.map((stack, index) => (
                        <Chip
                          key={index}
                          label={stack}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
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

export default Experiences;
