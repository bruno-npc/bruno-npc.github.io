import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Container estilizado para seções
const SectionContainer = styled(Box)(({ theme, $bgColor }) => ({
  padding: theme.spacing(6, 0, 8),
  backgroundColor: $bgColor || 'transparent',
  position: 'relative',
  overflow: 'hidden',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

// Componente de seção personalizado
const Section = ({
  id,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  bgColor,
  divider = true,
  textAlign = 'center',
  titleVariant = 'h2',
  subtitleVariant = 'h6',
  ...props
}) => {
  return (
    <SectionContainer id={id} $bgColor={bgColor} component="section" {...props}>
      <Container maxWidth={maxWidth}>
        {title && (
          <Box sx={{ mb: subtitle ? 1 : 4, textAlign }}>
            <Typography
              variant={titleVariant}
              component="h2"
              gutterBottom={!!subtitle}
              sx={{
                position: 'relative',
                display: 'inline-block',
                fontWeight: 'bold',
                '&::after': divider ? {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: textAlign === 'center' ? '50%' : 0,
                  transform: textAlign === 'center' ? 'translateX(-50%)' : 'none',
                  width: textAlign === 'center' ? '80px' : '60px',
                  height: '4px',
                  backgroundColor: 'primary.main',
                  borderRadius: '2px',
                } : {},
              }}
            >
              {title}
            </Typography>
          </Box>
        )}

        {subtitle && (
          <Box sx={{ mb: 4, textAlign }}>
            <Typography
              variant={subtitleVariant}
              component="p"
              color="text.secondary"
              sx={{ maxWidth: '800px', mx: textAlign === 'center' ? 'auto' : 0 }}
            >
              {subtitle}
            </Typography>
          </Box>
        )}

        {children}
      </Container>
    </SectionContainer>
  );
};

export default Section; 