import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import localforage from "localforage";
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

const CACHE_KEY = "educationData";
const ONE_HOUR = 60 * 60 * 1000;

function Education() {
  const [educations, setEducations] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const cachedData = await localforage.getItem(CACHE_KEY);
        if (cachedData) {
          const { educations: cachedEducations, lastFetched } = cachedData;
          setEducations(cachedEducations);
          if (cachedEducations.length > 0) {
            setSelectedEducation(cachedEducations[0]);
          }
          if (Date.now() - lastFetched < ONE_HOUR) {
            setLoading(false);
            return;
          }
        }

        const querySnapshot = await getDocs(collection(db, "educations"));
        const list = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        setEducations(list);
        if (list.length > 0) {
          setSelectedEducation(list[0]);
        }

        await localforage.setItem(CACHE_KEY, {
          educations: list,
          lastFetched: Date.now(),
        });
      } catch (error) {
        console.error("Erro ao buscar educations (público):", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducations();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const getPeriod = (edu) => {
    const start = formatDate(edu.startDate);
    const end = edu.endDate ? formatDate(edu.endDate) : "Atual";
    if (!start) return "";
    return `${start} - ${end}`;
  };

  const renderDetails = (edu) => {
    if (edu.type === "Graduação") {
      return (
        <Typography variant="body1" sx={{ mb: 2 }}>
          {edu.details}
        </Typography>
      );
    } else {
      const items = edu.details ? edu.details.split(",") : [];
      return (
        <List sx={{ pl: 2 }}>
          {items.map((item, idx) => (
            <ListItem key={idx} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
              <Typography variant="body1">{item.trim()}</Typography>
            </ListItem>
          ))}
        </List>
      );
    }
  };

  return (
    <Section 
      id="education" 
      title="Educação"
      bgColor={theme.palette.background.default}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
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
                height: '100%',
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
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                        cursor: 'pointer'
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
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
                  height: '100%',
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