import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import localforage from "localforage";
import { useInView } from 'react-intersection-observer';
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
// Importação direta da imagem (que será incluída no bundle principal)
import profilePic from "../../assets/perfil.jpeg";
import "./Hero.css";


const RESUME_URL = "https://drive.google.com/file/d/1EAkzmWxdLo6CWAH9z4z_S9ztYf_eIx86/view?usp=sharing";

// Pré-carregar a imagem de perfil para torná-la disponível imediatamente
const profileImage = new Image();
profileImage.src = profilePic;

// Versão de baixa qualidade da imagem de perfil (base64 extremamente pequeno)
const profilePicLQIP = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAQDAwQDAwQEBAQFBQQFBwsHBwYGBw4KCggLEA4RERAOEA8SFBoWEhMYEw8QFh8XGBsbHR0dERYgIh8cIhocHRz/2wBDAQUFBQcGBw0HBw0cEhASHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/wAARCAAyADIDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAUGBAcB/8QAJhAAAgICAgIBBAMBAAAAAAAAAAECAwQRBSESMUETIlFxQmGBkf/EABkBAAIDAQAAAAAAAAAAAAAAAAEDBAUHAv/EACMRAAMAAgICAQUBAAAAAAAAAAECAxEhMQQSQQUiUWHBE//aAAwDAQACEQMRAD8AoOb4WnErhOuOnZDf21tsn7ePx8iyUIV+Tk/Tvb9I6fx2RG2E6rOlBuO/0JXwzafTRh49lKjptlL9S+FdRWT/AJbG/wCMyfJR7y7x4v0Naq4VVwrgt1wioxXpJEpzWf5SmDLa/wA2IXN8rJNU0N63tgkPHZuXdmXStu2lvpdLQXCTnXCX8ktGyzY3vZ0Px8bif2SYYXElNyTbfbIvk5ylbJvvZfcpjwjbvruSX+nPOUx3DIs13ssvGvdyc39d8TkWP4K9TtV9tPoJlFp6GMtxk/I+9jH7KXiMr2n6K5QTetrRJ8VPpaKyjUkQ8q9WT8T9dHFu39ND5EvBomLJRlJdCLKvUYttvRG4Zz2XPVzjn8EnLzpXTkvexbZDyf3AstOyWySn30Lxyd9nQYs1JLTOEqTT0MIZluP+sfyJq+/QeN9jodjzL020MMO/xakiXxrHoPVJoxZVpkDK9yvR7mT+X2T/AO9id3l3eT7C5UeTEshquC1x/Hpn5R9sWtdsYU29JA7JdA5y8Q0I7GVl+lrYlsk29sDY30DRTz47xz9R+NE1LRN9QwuhykkTYPNDvFJnTdtlRg9GXU+A+W3EJwepQT/JXXrehmNx9VnlOSEOdyG6fGr9EcR2zTRyvHCX9NJFZMs8voo8aExN2+T2/YW612EtXoGZtaGRhR8hb/Ai/QXIA8CfJ//Z";

// Componente para criar partículas animadas no fundo - Memoizado e carregado por demanda
const AnimatedBackground = memo(({ theme }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Gera partículas apenas uma vez e apenas quando visível
  const particles = useMemo(() => {
    if (!inView) return [];

    return Array.from({ length: 8 }, (_, i) => ({
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
  }, [inView, theme.palette.mode, theme.palette.primary, theme.palette.secondary]);

  return (
    <div ref={ref} className="hero-animated-bg">
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
});

// Avatar otimizado inline para este componente específico (para a imagem de perfil)
const OptimizedAvatar = memo(({ size, theme, className, sx }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // Se a imagem já estiver no cache do navegador
    if (profileImage.complete) {
      setImageLoaded(true);
    }
  }, []);
  
  // Manipulador para quando a imagem de alta qualidade carregar
  const handleImageLoaded = () => {
    setImageLoaded(true);
  };
  
  return (
    <div
      className={`hero-avatar-optimized ${className || ''}`}
      style={{
        width: size === 'xlarge' ? '150px' : '200px',
        height: size === 'xlarge' ? '150px' : '200px',
        // Usar a versão em baixa qualidade como fallback e depois substituir pela alta qualidade
        backgroundImage: `url(${imageLoaded ? profilePic : profilePicLQIP})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 0 30px rgba(0, 123, 255, 0.4)'
          : '0 0 30px rgba(0, 123, 255, 0.3)',
        border: `4px solid ${theme.palette.primary.main}`,
        marginBottom: '16px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ...sx
      }}
    >
      {/* Imagem oculta para pré-carregar */}
      <img 
        src={profilePic} 
        alt="Pré-carregando" 
        style={{ display: 'none' }} 
        onLoad={handleImageLoaded}
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
});

// Componente para o efeito de digitação - Memoizado e com performance otimizada
const TypingEffect = memo(({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  // Carregar apenas quando visível
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Resetar quando o texto mudar
    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    // Só iniciar a animação quando estiver visível
    if (!inView) return;
    
    if (!text) {
      setIsComplete(true);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed, inView]);

  return (
    <span ref={ref} className={isComplete ? '' : 'typing-effect'}>
      {displayText}
    </span>
  );
});

// Componente de seção "Sobre Mim" memoizado para carregamento sob demanda
const AboutMeSection = memo(({ description, theme }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '100px 0px',
  });

  // Dividir a descrição em parágrafos apenas quando visível
  const descriptionParagraphs = useMemo(() => 
    description.split('\n').filter(p => p.trim() !== ''),
    [description]
  );

  return (
    <Paper 
      ref={ref}
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
      {inView && (
        <Fade in={true} timeout={800}>
          <div>
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
          </div>
        </Fade>
      )}
    </Paper>
  );
});

function Hero() {
  const [profileData, setProfileData] = useState({
    aboutTitle: "",
    aboutSubtitle: "",
    aboutDescription: ""
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Referência para carregamento por demanda
  const [heroRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Memoizar os links sociais para evitar recriação em cada render
  const socialLinks = useMemo(() => [
    { icon: <GitHub />, href: "https://github.com/bruno-npc", tooltip: "GitHub" },
    { icon: <LinkedIn />, href: "https://www.linkedin.com/in/bruno-npc", tooltip: "LinkedIn" },
    { icon: <Instagram />, href: "https://www.instagram.com/bruno_npc", tooltip: "Instagram" },
    { icon: <Email />, href: "mailto:brunosznorth@gmail.com", tooltip: "Email" }
  ], []);

  // Otimizar a função de busca de dados para usar useCallback
  const fetchProfileData = useCallback(async () => {
    try {
      // Primeiro tentar carregar do cache
      const cachedProfile = await localforage.getItem("profileData");
      if (cachedProfile) {
        setProfileData(cachedProfile);
        // Se temos dados em cache, mostrar imediatamente
        setIsLoaded(true);
      }

      // Se estiver visível, carregar dados do Firebase
      if (inView) {
        // Depois atualizar do Firestore (se necessário)
        const ref = doc(db, "profileData", "meuPerfil");
        const snap = await getDoc(ref);
        
        if (snap.exists()) {
          const data = snap.data();
          const newProfileData = {
            aboutTitle: data.aboutTitle || "",
            aboutSubtitle: data.aboutSubtitle || "",
            aboutDescription: data.aboutDescription || ""
          };
          
          // Só atualizar o estado e o cache se os dados forem diferentes
          if (JSON.stringify(newProfileData) !== JSON.stringify(profileData)) {
            setProfileData(newProfileData);
            await localforage.setItem("profileData", newProfileData);
          }
        }
      }
      
      // Garantir que isLoaded seja true no final
      if (!isLoaded) {
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do perfil:", error);
      setIsLoaded(true);
    }
  }, [profileData, isLoaded, inView]);

  useEffect(() => {
    // Se a imagem já estiver carregada pelo navegador, definir como carregada
    if (profileImage.complete) {
      setIsLoaded(true);
    }
    
    if (inView) {
      fetchProfileData();
    }
  }, [fetchProfileData, inView]);

  return (
    <Box
      id="home"
      ref={heroRef}
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
      {inView && <AnimatedBackground theme={theme} />}

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
              {/* Usando Avatar otimizado em vez do componente Avatar padrão */}
              <OptimizedAvatar 
                size={isSmall ? 'xlarge' : 'xxlarge'}
                theme={theme}
                className="hero-avatar"
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
                <TypingEffect text={profileData.aboutTitle} speed={80} />
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
                {profileData.aboutSubtitle}
              </Typography>
            </Box>

            {/* Sobre mim - Componente separado com carregamento sob demanda */}
            <AboutMeSection description={profileData.aboutDescription} theme={theme} />

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

// Exportar como componente memoizado para evitar re-renders desnecessários
export default memo(Hero);