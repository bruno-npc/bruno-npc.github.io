import React from 'react';
import { 
  Card as MuiCard, 
  CardContent, 
  CardActions, 
  CardMedia, 
  Typography,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Card estilizado com base no MUI Card
const StyledCard = styled(MuiCard)(({ theme, elevation = 2, interactive = true }) => ({
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: theme.shadows[elevation],
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  ...(interactive && {
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[elevation + 2],
    },
  }),
}));

// Componente de cartão personalizado
const Card = ({ 
  children, 
  title, 
  subtitle,
  image,
  imageHeight = 200,
  imageAlt = 'Card image',
  actions,
  elevation = 2,
  interactive = true,
  ...props 
}) => {
  return (
    <StyledCard elevation={elevation} interactive={interactive} {...props}>
      {image && (
        <CardMedia
          component="img"
          height={imageHeight}
          image={image}
          alt={imageAlt}
        />
      )}
      
      {(title || subtitle) && (
        <Box sx={{ p: 2, pb: subtitle ? 1 : 2 }}>
          {title && (
            <Typography variant="h5" component="h2" gutterBottom={!!subtitle}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      
      <CardContent sx={{ flexGrow: 1, pt: (title || subtitle) ? 0 : 2 }}>
        {children}
      </CardContent>
      
      {actions && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          {actions}
        </CardActions>
      )}
    </StyledCard>
  );
};

export default Card; 