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
  ListItem, 
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
import "./Navbar.css";

// Lista de navegação - Definida fora do componente para evitar recriação
const navItems = [
  { id: "home", label: "Início", icon: <Home /> },
  { id: "skills", label: "Conhecimentos", icon: <Code /> },
  { id: "experiences", label: "Experiências", icon: <Work /> },
  { id: "education", label: "Estudos", icon: <School /> },
  { id: "projects", label: "Projetos", icon: <Folder /> },
  { id: "contact", label: "Contato", icon: <Email /> },
];

const Navbar = memo(({ isDarkMode, onToggleDarkMode, user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  // Detecta a seção ativa durante a rolagem (somente na página inicial)
  useEffect(() => {
    if (!isHomePage) return;

    // Função mais eficiente usando requestAnimationFrame
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 100; // Offset para detecção mais precisa
          
          // Encontra a seção atual
          const sections = navItems.map(item => document.getElementById(item.id));
          
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

    // Adiciona listener de scroll com passive: true para melhor desempenho
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Executa uma vez para definir a seção inicial
    handleScroll();
    
    // Limpa listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Navegação para a seção na página inicial - memoizada
  const handleNavigation = useCallback((sectionId) => {
    if (isHomePage) {
      scrollToSection(sectionId);
    } else {
      // Se não estiver na página inicial, navegue para a página inicial e depois até a seção
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          scrollToSection(sectionId);
        }
      }, 100);
    }
  }, [isHomePage, navigate]);

  // Função para rolar até uma seção específica - memoizada
  const scrollToSection = useCallback((sectionId) => {
    const section = document.getElementById(sectionId);
    
    if (section) {
      // Calcula o offset correto considerando a altura da navbar
      const navbarHeight = window.innerWidth <= 600 ? 60 : 64;
      const yOffset = -navbarHeight;
      
      // Usando getBoundingClientRect para posição mais precisa
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ 
        top: y, 
        behavior: 'smooth' 
      });
      
      setActiveSection(sectionId);
      setMobileOpen(false); // Fecha o menu mobile se estiver aberto
    }
  }, []);

  // Navegação para página de login - memoizada
  const handleLoginClick = useCallback(() => {
    navigate("/login");
    setMobileOpen(false);
  }, [navigate]);

  // Navegação para página admin (apenas se estiver logado) - memoizada
  const handleAdminClick = useCallback(() => {
    if (user) {
      // Verifica se o token ainda é válido antes de navegar
      user.getIdToken(true)
        .then(() => {
          navigate("/admin");
          setMobileOpen(false);
        })
        .catch((error) => {
          console.error("Erro de autenticação:", error);
          // Se o token for inválido, faz logout
          signOut(auth).then(() => {
            navigate("/login");
            setMobileOpen(false);
          });
        });
    }
  }, [user, navigate]);

  // Logout - memoizado
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      // Se estiver na página admin, redireciona para home
      if (location.pathname === "/admin") {
        navigate("/");
      }
      setMobileOpen(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }, [location.pathname, navigate]);

  // Navegação para página inicial - memoizada
  const handleHomeClick = useCallback(() => {
    navigate("/");
    setMobileOpen(false);
  }, [navigate]);

  // Drawer para dispositivos móveis - memoizado para evitar re-renders
  const drawer = useMemo(() => (
    <Box className="navbar-drawer">
      <Box className="drawer-header">
        <IconButton onClick={() => setMobileOpen(false)} className="drawer-close-btn">
          <Close />
        </IconButton>
      </Box>
      <List className="drawer-nav-list">
        {/* Se não estiver na página inicial, mostrar um botão para voltar */}
        {!isHomePage && (
          <ListItem 
            button
            onClick={handleHomeClick}
            className="drawer-nav-item"
          >
            <ListItemIcon className="drawer-nav-icon"><Home /></ListItemIcon>
            <ListItemText primary="Página Inicial" />
          </ListItem>
        )}

        {/* Mostrar itens de navegação apenas na página inicial */}
        {isHomePage && navItems.map((item) => (
          <ListItem 
            key={item.id} 
            button
            onClick={() => handleNavigation(item.id)}
            className={`drawer-nav-item ${activeSection === item.id ? 'active' : ''}`}
          >
            <ListItemIcon className="drawer-nav-icon">{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        
        {/* Se NÃO estiver logado, mostrar botão de login */}
        {!user && (
          <ListItem 
            button
            onClick={handleLoginClick}
            className={`drawer-nav-item ${location.pathname === "/login" ? 'active' : ''}`}
          >
            <ListItemIcon className="drawer-nav-icon"><LoginIcon /></ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
        
        {/* Se estiver logado, mostrar botões de admin e logout */}
        {user && (
          <>
            <ListItem 
              button
              onClick={handleAdminClick}
              className={`drawer-nav-item ${location.pathname === "/admin" ? 'active' : ''}`}
            >
              <ListItemIcon className="drawer-nav-icon"><Dashboard /></ListItemIcon>
              <ListItemText primary="Admin" />
            </ListItem>
            <ListItem 
              button
              onClick={handleLogout}
              className="drawer-nav-item"
            >
              <ListItemIcon className="drawer-nav-icon"><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  ), [isHomePage, location.pathname, activeSection, user, handleHomeClick, handleNavigation, handleLoginClick, handleAdminClick, handleLogout]);

  // Função para abrir o menu mobile - memoizada
  const toggleMobileMenu = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  return (
    <>
      <AppBar position="fixed" className={`navbar ${isDarkMode ? 'dark' : 'light'}`}>
        <Container maxWidth="lg">
          <Toolbar disableGutters className="navbar-toolbar">
            {/* Botão do menu mobile */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleMobileMenu}
              className="navbar-menu-button"
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo / Título principal - Link para home */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Button
                color="inherit"
                onClick={handleHomeClick}
                sx={{ fontWeight: 'bold', fontSize: '1.2rem', textTransform: 'none' }}
              >
                Portfolio
              </Button>
            </Box>

            {/* Menu de navegação desktop - visível apenas na página inicial */}
            {isHomePage && (
              <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`navbar-nav-button ${activeSection === item.id ? 'active' : ''}`}
                    startIcon={item.icon}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
            
            {/* Espaçador quando não estiver na página inicial */}
            {!isHomePage && <Box sx={{ flexGrow: 1 }} />}

            {/* Botões de ação à direita */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Se NÃO estiver logado, mostrar botão de login */}
              {!user && (
                <Button
                  onClick={handleLoginClick}
                  className={`navbar-login-button ${location.pathname === "/login" ? 'active' : ''}`}
                  startIcon={<LoginIcon />}
                  sx={{ marginRight: 1 }}
                >
                  Login
                </Button>
              )}
              
              {/* Se estiver logado, mostrar botão admin e logout */}
              {user && (
                <>
                  <Button
                    onClick={handleAdminClick}
                    className={`navbar-login-button ${location.pathname === "/admin" ? 'active' : ''}`}
                    startIcon={<Dashboard />}
                    sx={{ marginRight: 1 }}
                  >
                    Admin
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="navbar-login-button"
                    startIcon={<LogoutIcon />}
                    sx={{ marginRight: 1 }}
                  >
                    Logout
                  </Button>
                </>
              )}
              
              {/* Botão de tema */}
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

      {/* Drawer para dispositivos móveis */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleMobileMenu}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: 280 },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Espaço para compensar a altura da toolbar fixa */}
      <Box sx={{ height: { xs: '60px', sm: '64px' } }} />
    </>
  );
});

export default Navbar;