import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import localforage from "localforage";
import { 
  Box, 
  Typography, 
  Container,
  useTheme,
  Paper,
  Fade,
  Divider,
  Stack,
  useMediaQuery
} from "@mui/material";
import { 
  GitHub, 
  LinkedIn, 
  Instagram, 
  Download, 
  Email
} from "@mui/icons-material";
import { Button, Avatar, SocialIcon } from "../../ui-components";
import profilePic from "../../assets/perfil.jpeg";
import "./Hero.css";

// URL do currículo no Google Drive (exemplo)
const RESUME_URL = "https://drive.google.com/file/d/example/view?usp=sharing";

// Componente para criar partículas animadas no fundo
const AnimatedBackground = ({ theme }) => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 5,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 30 + 10,
    delay: Math.random() * 5,
    color: theme.palette.mode === 'dark' 
      ? i % 2 === 0 ? theme.palette.primary.main : theme.palette.secondary.main
      : i % 2 === 0 ? theme.palette.primary.light : theme.palette.secondary.light
  }));

  return (
    <div className="hero-animated-bg">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            backgroundColor: particle.color,
            opacity: theme.palette.mode === 'dark' ? 0.2 : 0.1,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
};

// Componente para o efeito de digitação
const TypingEffect = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={isComplete ? '' : 'typing-effect'}>
      {displayText}
    </span>
  );
};

function Hero() {
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutSubtitle, setAboutSubtitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const cachedProfile = await localforage.getItem("profileData");
        if (cachedProfile) {
          setAboutTitle(cachedProfile.aboutTitle || "");
          setAboutSubtitle(cachedProfile.aboutSubtitle || "");
          setAboutDescription(cachedProfile.aboutDescription || "");
        }

        const ref = doc(db, "profileData", "meuPerfil");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setAboutTitle(data.aboutTitle || "");
          setAboutSubtitle(data.aboutSubtitle || "");
          setAboutDescription(data.aboutDescription || "");
          
          await localforage.setItem("profileData", {
            aboutTitle: data.aboutTitle || "",
            aboutSubtitle: data.aboutSubtitle || "",
            aboutDescription: data.aboutDescription || "",
          });
        }
        
        // Adicionar um pequeno atraso para garantir que as animações sejam exibidas
        setTimeout(() => {
          setIsLoaded(true);
        }, 300);
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
        setIsLoaded(true);
      }
    };

    fetchProfileData();
  }, []);

  // Dividir a descrição em parágrafos para melhor legibilidade
  const descriptionParagraphs = aboutDescription.split('\n').filter(p => p.trim() !== '');

  // Redes sociais
  const socialLinks = [
    { icon: <GitHub />, href: "https://github.com/bruno-npc", tooltip: "GitHub" },
    { icon: <LinkedIn />, href: "https://www.linkedin.com/in/bruno-npc", tooltip: "LinkedIn" },
    { icon: <Instagram />, href: "https://www.instagram.com/bruno_npc", tooltip: "Instagram" },
    { icon: <Email />, href: "mailto:brunosznorth@gmail.com", tooltip: "Email" }
  ];

  return (
    <Box
      id="home"
      component="section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 10, md: 8 },
        pb: { xs: 6, md: 8 },
        overflow: 'hidden',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}
    >
      <AnimatedBackground theme={theme} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Fade in={isLoaded} timeout={800}>
          <Box className="hero-content">
            {/* Seção superior - Avatar e redes sociais */}
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4
              }}
            >
              <Avatar 
                src={profilePic} 
                alt="Bruno" 
                size={isSmall ? 'xlarge' : 'xxlarge'}
                className="hero-avatar"
                sx={{ 
                  mb: 2,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 0 30px rgba(0, 123, 255, 0.4)'
                    : '0 0 30px rgba(0, 123, 255, 0.3)',
                  border: `4px solid ${theme.palette.primary.main}`
                }}
              />
              
              <Stack 
                direction="row" 
                spacing={2} 
                sx={{ 
                  mt: 1,
                  mb: 0
                }}
              >
                {socialLinks.map((social, index) => (
                  <SocialIcon
                    key={index}
                    icon={social.icon}
                    href={social.href}
                    tooltip={social.tooltip}
                    color="primary"
                    size="large"
                    className="hero-social-icon"
                    sx={{
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 0 20px rgba(0, 123, 255, 0.3)'
                        : '0 0 20px rgba(0, 123, 255, 0.2)',
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Título e subtítulo */}
            <Box 
              sx={{ 
                textAlign: 'center',
                mb: 3
              }}
              className="title-subtitle-container"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Typography 
                variant="h3" 
                component="h1" 
                className="hero-title"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, #fff, #b0b0b0)'
                    : 'linear-gradient(90deg, #333, #555)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: theme.palette.mode === 'dark'
                    ? '0 0 30px rgba(255, 255, 255, 0.1)'
                    : '0 0 30px rgba(0, 0, 0, 0.05)',
                  fontSize: { xs: '2rem', md: '2.8rem' }
                }}
              >
                <TypingEffect text={aboutTitle} speed={80} />
              </Typography>
              
              <div className={`title-divider ${isHovered ? 'expanded' : ''}`} />

              <Typography 
                variant="h6" 
                component="p" 
                className="hero-subtitle"
                color="text.secondary"
                sx={{ 
                  mt: 1.5,
                  fontWeight: 500,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                {aboutSubtitle}
              </Typography>
            </Box>

            {/* Sobre mim */}
            <Paper 
              elevation={4} 
              className="hero-card"
              sx={{ 
                p: { xs: 2.5, md: 4 }, 
                mb: 4, 
                borderRadius: 3,
                maxWidth: '900px',
                mx: 'auto',
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(30, 30, 30, 0.8)' 
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)'}`,
              }}
            >
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  textAlign: 'center',
                  mb: 2
                }}
              >
                Sobre Mim
              </Typography>
              
              <Divider sx={{ mb: 3, width: '80px', mx: 'auto' }} />
              
              <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                {descriptionParagraphs.map((paragraph, index) => (
                  <Typography 
                    key={index} 
                    variant="body1" 
                    sx={{ 
                      mb: 2,
                      lineHeight: 1.7,
                      fontSize: '1rem',
                      color: theme.palette.text.primary,
                      textAlign: 'justify'
                    }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Box>
            </Paper>

            {/* Botões */}
            <Box 
              className="hero-buttons" 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2,
                justifyContent: 'center',
                mt: 3
              }}
            >
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<Email />}
                onClick={() => (window.location.href = "#contact")}
                className="button-contact"
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(0, 123, 255, 0.3)'
                    : '0 4px 20px rgba(0, 123, 255, 0.2)',
                }}
              >
                Contate-me
              </Button>

              <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                startIcon={<Download />}
                component="a"
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button-resume"
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  borderWidth: 2,
                }}
              >
                Currículo
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

export default Hero;