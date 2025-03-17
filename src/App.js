import React, { useState, useEffect, lazy, Suspense, memo } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, CircularProgress, Box } from "@mui/material";
import getTheme from "./theme";
import Navbar from "./components/Navbar/Navbar";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import MaintenanceAlert from "./components/MaintenanceAlert/MaintenanceAlert";

// Lazy loading dos componentes para melhorar o desempenho inicial
const Hero = lazy(() => import("./components/Hero/Hero"));
const Skills = lazy(() => import("./components/Skills/Skills"));
const Experiences = lazy(() => import("./components/Experiences/Experiences"));
const Education = lazy(() => import("./components/Education/Education"));
const Projects = lazy(() => import("./components/Projects/Projects"));
const Contact = lazy(() => import("./components/Contact/Contact"));
const Footer = lazy(() => import("./components/Footer/Footer"));
const Login = lazy(() => import("./pages/Login/Login"));
const Admin = lazy(() => import("./pages/Admin/Admin"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails/ProjectDetails"));

// Componente de fallback durante o carregamento
const LoadingFallback = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '70vh' 
    }}
  >
    <CircularProgress />
  </Box>
);

// Componente de página inicial memoizado para evitar re-renders desnecessários
const HomePage = memo(() => (
  <>
    <Suspense fallback={<LoadingFallback />}>
      <main>
        <Hero />
        <Skills />
        <Experiences />
        <Education />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </Suspense>
  </>
));

// Componente protetor para rota Admin
const ProtectedRoute = memo(({ user, children }) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Se não houver usuário, redireciona para login
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Verifica se o token do usuário é válido
    const verifyAuth = async () => {
      try {
        // Solicita um novo token para garantir que a sessão é válida
        await user.getIdToken(true);
        setIsVerifying(false);
      } catch (error) {
        console.error("Erro de autenticação:", error);
        // Se houver erro, redireciona para login
        navigate("/login");
      }
    };
    
    verifyAuth();
  }, [user, navigate]);

  // Enquanto verifica, mostra um loader
  if (isVerifying) {
    return <LoadingFallback />;
  }

  // Renderiza o componente filho se o usuário estiver autenticado
  return children;
});

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Carrega o modo escuro das preferências apenas uma vez na inicialização
    return localStorage.getItem("darkMode") === "true";
  });
  
  const [user, setUser] = useState(null);
  
  // Configura a autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  
  // Salva o modo escuro quando mudar
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
    
    // Aplica a classe dark-mode ao body
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // Alternador de tema - Memoizado para evitar recriação
  const toggleDarkMode = React.useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Obtém o tema com base no modo escuro/claro
  const theme = getTheme(isDarkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Alerta de manutenção */}
      <MaintenanceAlert />
      <Router>
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} user={user} />

        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route 
            path="/login" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Login />
              </Suspense>
            } 
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user}>
                <Suspense fallback={<LoadingFallback />}>
                  <Admin />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/project/:id" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ProjectDetails />
              </Suspense>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default memo(App);