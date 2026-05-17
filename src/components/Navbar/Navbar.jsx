import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon
} from "@mui/material";
import {
  Menu as MenuIcon,
  LightMode,
  DarkMode,
  Close,
  Home,
  Code,
  Work,
  School,
  Folder,
  Email,
  Login as LoginIcon,
  Dashboard,
  Logout as LogoutIcon
} from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { DEFAULT_SITE_SETTINGS, getSiteSettings } from "../../services/siteSettings";
import "./Navbar.css";

const createNavItems = (labels) => [
  { id: "home", label: labels.home, icon: <Home /> },
  { id: "skills", label: labels.skills, icon: <Code /> },
  { id: "experiences", label: labels.experiences, icon: <Work /> },
  { id: "education", label: labels.education, icon: <School /> },
  { id: "projects", label: labels.projects, icon: <Folder /> },
  { id: "contact", label: labels.contact, icon: <Email /> },
];

const Navbar = memo(({ isDarkMode, onToggleDarkMode, user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [labels, setLabels] = useState(DEFAULT_SITE_SETTINGS.navbar);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const navItems = useMemo(() => createNavItems(labels), [labels]);

  useEffect(() => {
    getSiteSettings().then((settings) => setLabels(settings.navbar));
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      const navbarHeight = window.innerWidth <= 600 ? 60 : 64;
      const y = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });

      setActiveSection(sectionId);
      setMobileOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!isHomePage) return undefined;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 100;
          const sections = navItems.map((item) => document.getElementById(item.id));

          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section && scrollPosition >= section.offsetTop) {
              setActiveSection(navItems[i].id);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, navItems]);

  const handleNavigation = useCallback((sectionId) => {
    if (isHomePage) {
      scrollToSection(sectionId);
    } else {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 100);
    }
  }, [isHomePage, navigate, scrollToSection]);

  const handleLoginClick = useCallback(() => {
    navigate("/login");
    setMobileOpen(false);
  }, [navigate]);

  const handleAdminClick = useCallback(() => {
    if (!user) return;

    user.getIdToken(true)
      .then(() => {
        navigate("/admin");
        setMobileOpen(false);
      })
      .catch((error) => {
        console.error("Erro de autenticação:", error);
        if (auth) {
          signOut(auth).then(() => {
            navigate("/login");
            setMobileOpen(false);
          });
        }
      });
  }, [user, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      if (location.pathname === "/admin") {
        navigate("/");
      }
      setMobileOpen(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }, [location.pathname, navigate]);

  const handleHomeClick = useCallback(() => {
    navigate("/");
    setMobileOpen(false);
  }, [navigate]);

  const drawer = useMemo(() => (
    <Box className="navbar-drawer">
      <Box className="drawer-header">
        <IconButton onClick={() => setMobileOpen(false)} className="drawer-close-btn">
          <Close />
        </IconButton>
      </Box>
      <List className="drawer-nav-list">
        {!isHomePage && (
          <ListItemButton onClick={handleHomeClick} className="drawer-nav-item">
            <ListItemIcon className="drawer-nav-icon"><Home /></ListItemIcon>
            <ListItemText primary={labels.home} />
          </ListItemButton>
        )}

        {isHomePage && navItems.map((item) => (
          <ListItemButton
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`drawer-nav-item ${activeSection === item.id ? "active" : ""}`}
          >
            <ListItemIcon className="drawer-nav-icon">{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        {!user && (
          <ListItemButton
            onClick={handleLoginClick}
            className={`drawer-nav-item ${location.pathname === "/login" ? "active" : ""}`}
          >
            <ListItemIcon className="drawer-nav-icon"><LoginIcon /></ListItemIcon>
            <ListItemText primary={labels.login} />
          </ListItemButton>
        )}

        {user && (
          <>
            <ListItemButton
              onClick={handleAdminClick}
              className={`drawer-nav-item ${location.pathname === "/admin" ? "active" : ""}`}
            >
              <ListItemIcon className="drawer-nav-icon"><Dashboard /></ListItemIcon>
              <ListItemText primary={labels.admin} />
            </ListItemButton>
            <ListItemButton onClick={handleLogout} className="drawer-nav-item">
              <ListItemIcon className="drawer-nav-icon"><LogoutIcon /></ListItemIcon>
              <ListItemText primary={labels.logout} />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  ), [isHomePage, location.pathname, activeSection, user, labels, navItems, handleHomeClick, handleNavigation, handleLoginClick, handleAdminClick, handleLogout]);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  return (
    <>
      <AppBar position="fixed" className={`navbar ${isDarkMode ? "dark" : "light"}`}>
        <Container maxWidth="lg">
          <Toolbar disableGutters className="navbar-toolbar">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleMobileMenu}
              className="navbar-menu-button"
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <Button
                color="inherit"
                onClick={handleHomeClick}
                sx={{ fontWeight: "bold", fontSize: "1.2rem", textTransform: "none" }}
              >
                {labels.brand}
              </Button>
            </Box>

            {isHomePage && (
              <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" }, justifyContent: "center" }}>
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`navbar-nav-button ${activeSection === item.id ? "active" : ""}`}
                    startIcon={item.icon}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {!isHomePage && <Box sx={{ flexGrow: 1 }} />}

            <Box sx={{ display: "flex", alignItems: "center" }}>
              {!user && (
                <Button
                  onClick={handleLoginClick}
                  className={`navbar-login-button ${location.pathname === "/login" ? "active" : ""}`}
                  startIcon={<LoginIcon />}
                  sx={{ marginRight: 1 }}
                >
                  {labels.login}
                </Button>
              )}

              {user && (
                <>
                  <Button
                    onClick={handleAdminClick}
                    className={`navbar-login-button ${location.pathname === "/admin" ? "active" : ""}`}
                    startIcon={<Dashboard />}
                    sx={{ marginRight: 1 }}
                  >
                    {labels.admin}
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="navbar-login-button"
                    startIcon={<LogoutIcon />}
                    sx={{ marginRight: 1 }}
                  >
                    {labels.logout}
                  </Button>
                </>
              )}

              <IconButton
                onClick={onToggleDarkMode}
                className="navbar-theme-toggle"
                color="inherit"
              >
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleMobileMenu}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: 280 },
        }}
      >
        {drawer}
      </Drawer>

      <Box sx={{ height: { xs: "60px", sm: "64px" } }} />
    </>
  );
});

export default Navbar;
