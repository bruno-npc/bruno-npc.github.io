import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
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

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <Router>
      <div className={isDarkMode ? "dark-mode" : ""}>
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} user={user} />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <main>
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
            element={<ProtectedAdmin user={user} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
          />
          <Route path="/project/:id" element={<ProjectDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

function ProtectedAdmin({ user, isDarkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return user ? <Admin /> : null;
}

export default App;