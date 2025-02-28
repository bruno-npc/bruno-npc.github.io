import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar as BsNavbar } from "react-bootstrap";
import { FaSun, FaMoon, FaUserCircle, FaRegTimesCircle, FaEdit, FaHome } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./Navbar.css";

function Navbar({ isDarkMode, onToggleDarkMode }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleScrollOrNavigate = (event, sectionId) => {
    event.preventDefault();
  
    if (location.pathname === "/") {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  };

  return (
    <BsNavbar
      bg={isDarkMode ? "dark" : "light"}
      variant={isDarkMode ? "dark" : "light"}
      expand="md"
      fixed="top"
      className="custom-navbar"
    >
      <Container>
        <BsNavbar.Brand onClick={() => navigate("/")} className="fw-bold" style={{ cursor: "pointer" }}>
          Portfólio
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" onClick={(e) => handleScrollOrNavigate(e, "home")}><FaHome /></Nav.Link>
            <Nav.Link href="#skills" onClick={(e) => handleScrollOrNavigate(e, "skills")}>Conhecimentos</Nav.Link>
            <Nav.Link href="#experiences" onClick={(e) => handleScrollOrNavigate(e, "experiences")}>Experiências</Nav.Link>
            <Nav.Link href="#education" onClick={(e) => handleScrollOrNavigate(e, "education")}>Estudos</Nav.Link>
            <Nav.Link href="#projects" onClick={(e) => handleScrollOrNavigate(e, "projects")}>Projetos</Nav.Link>
            <Nav.Link href="#contact" onClick={(e) => handleScrollOrNavigate(e, "contact")}>Contato</Nav.Link>

            <button className="theme-toggle-button ms-3" onClick={onToggleDarkMode} title={isDarkMode ? "Modo Claro" : "Modo Escuro"}>
              {isDarkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
            </button>

            {user ? (
              <>
                <Nav.Link onClick={() => navigate("/admin")} className="ms-3 admin-button"> <FaEdit /> </Nav.Link>
                <button className="logout-button ms-3" onClick={handleLogout}> <FaRegTimesCircle /> </button>
              </>
            ) : (
              <button className="login-button ms-3" onClick={() => navigate("/login")}> <FaUserCircle /> </button>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;