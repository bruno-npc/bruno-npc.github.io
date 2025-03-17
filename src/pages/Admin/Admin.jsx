import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Tabs, Tab } from "react-bootstrap";
import localforage from "localforage";
import { 
  Box, 
  Typography, 
  Paper, 
  Button as MuiButton,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import { DeleteSweep, Logout } from "@mui/icons-material";
import { Section } from "../../ui-components";

import "./Admin.css";

import Profile from "../../components/Profile/Profile";
import ProjectsList from "../../components/ProjectsProfile/ProjectsList";
import EducationList from "../../components/EducationProfile/EducationList";
import ExperiencesList from "../../components/ExperiencesProfile/ExperiencesList";
import SkillsList from "../../components/SkillsProfile/SkillsList";

function Admin() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("perfil");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const theme = useTheme();

  // Verificação de autenticação reforçada
  useEffect(() => {
    // Flag para controlar se o componente ainda está montado
    let isMounted = true;
    setIsLoading(true);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isMounted) {
        if (!user) {
          // Usuário não autenticado, redireciona para login
          navigate("/login");
        } else {
          // Usuário autenticado, verifica se o token é válido
          user.getIdToken(true)
            .then(() => {
              // Token válido, permite acesso
              setIsAuthenticated(true);
              setIsLoading(false);
            })
            .catch((error) => {
              // Token inválido ou erro na verificação, redireciona para login
              console.error("Erro ao verificar token:", error);
              signOut(auth).then(() => navigate("/login"));
            });
        }
      }
    });

    // Limpa o listener quando o componente é desmontado
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setSnackbarMessage("Erro ao fazer logout. Tente novamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClearCache = async () => {
    try {
      await localforage.clear();
      setSnackbarMessage("Cache limpo com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
      setSnackbarMessage("Erro ao limpar cache. Tente novamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Mostra tela de carregamento enquanto verifica a autenticação
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Verificando autenticação...</Typography>
      </Box>
    );
  }

  // Se não estiver autenticado, não renderiza o conteúdo (cinto e suspensório)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Section 
      id="admin" 
      title="Painel de Administração"
      bgColor={theme.palette.background.default}
    >
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <MuiButton
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Sair
        </MuiButton>
        <MuiButton
          variant="outlined"
          color="warning"
          startIcon={<DeleteSweep />}
          onClick={handleClearCache}
        >
          Limpar Cache
        </MuiButton>
      </Box>

      <Paper elevation={3} sx={{ p: 0, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
        <Tabs
          id="admin-tabs"
          activeKey={activeKey}
          onSelect={(k) => setActiveKey(k || "perfil")}
          className="admin-tabs"
        >
          <Tab eventKey="perfil" title="Perfil">
            <Profile />
          </Tab>
          <Tab eventKey="projetos" title="Projetos">
            <ProjectsList />
          </Tab>
          <Tab eventKey="educacao" title="Educação">
            <EducationList />
          </Tab>
          <Tab eventKey="experiencias" title="Experiências">
            <ExperiencesList />
          </Tab>
          <Tab eventKey="skills" title="Skills">
            <SkillsList />
          </Tab>
        </Tabs>
      </Paper>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Section>
  );
}

export default Admin;