import React, { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Grid,
  Paper,
  useTheme,
  IconButton,
  Tooltip,
  CircularProgress,
  Box
} from "@mui/material";
import { Section } from "../../ui-components";
import useCachedCollection from "../../hooks/useCachedCollection";
import { getIconComponent } from "../../utils/iconRegistry";

function Skills() {
  const [selectedSkill, setSelectedSkill] = useState(0);
  const theme = useTheme();
  const { data: skills, loading } = useCachedCollection({
    collectionName: "skills",
    cacheKey: "skillsData",
  });

  const skillsData = useMemo(() => skills.map((skill) => ({
    id: skill.id,
    name: skill.title || skill.name || "",
    description: Array.isArray(skill.descriptions)
      ? skill.descriptions.filter(Boolean).join("\n\n")
      : skill.description || "",
    icon: skill.icon || "",
  })).filter((skill) => skill.name), [skills]);

  useEffect(() => {
    setSelectedSkill(0);
  }, [skillsData.length]);

  return (
    <Section
      id="skills"
      title="Conhecimentos"
      bgColor={theme.palette.background.default}
    >
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && skillsData.length === 0 && (
        <Typography color="text.secondary" align="center">
          Nenhuma skill cadastrada.
        </Typography>
      )}

      {!loading && skillsData.length > 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                backgroundColor: theme.palette.background.paper,
                transition: "all 0.3s ease",
              }}
            >
              <Typography variant="h5" component="h3" gutterBottom>
                {skillsData[selectedSkill].name}
              </Typography>
              {skillsData[selectedSkill].description.split("\n").filter(Boolean).map((paragraph, index) => (
                <Typography key={index} variant="body1" sx={{ mb: 1.5 }}>
                  {paragraph}
                </Typography>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2
              }}
            >
              {skillsData.map((skill, index) => {
                const isSelected = index === selectedSkill;
                const IconComponent = getIconComponent(skill.icon);

                return (
                  <Tooltip key={skill.id || index} title={skill.name} arrow>
                    <IconButton
                      onClick={() => setSelectedSkill(index)}
                      sx={{
                        width: 60,
                        height: 60,
                        fontSize: "1.8rem",
                        color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                        backgroundColor: isSelected
                          ? theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.05)"
                          : "transparent",
                        border: isSelected
                          ? `2px solid ${theme.palette.primary.main}`
                          : "2px solid transparent",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.05)",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      {IconComponent ? <IconComponent /> : skill.name.slice(0, 1)}
                    </IconButton>
                  </Tooltip>
                );
              })}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Section>
  );
}

export default Skills;
