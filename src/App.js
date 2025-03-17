import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import getTheme from "./theme";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Skills from "./components/Skills/Skills";
import Experiences from "./components/Experiences/Experiences";
import Education from "./components/Education/Education";
import Projects from "./components/Projects/Projects";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/Admin";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import MaintenanceAlert from "./components/MaintenanceAlert/MaintenanceAlert";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  
  // Carrega o modo escuro das preferências
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
    }
  }, []);

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

  // Alternador de tema
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

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
            element={
              <>
                <main>
                  {/* Seções para navegação por scroll */}
                  <Hero />
                  <Skills />
                  <Experiences />
                  <Education />
                  <Projects />
                  <Contact />
                </main>
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={<ProtectedAdmin user={user} />}
          />
          <Route path="/project/:id" element={<ProjectDetails />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

function ProtectedAdmin({ user }) {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  
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

  // Enquanto verifica, não renderiza nada
  if (isVerifying) {
    return null;
  }

  // Renderiza o Admin apenas se o usuário estiver autenticado
  return user ? <Admin /> : null;
}

export default App;