import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

// IconButton estilizado para redes sociais
const StyledIconButton = styled(IconButton)(({ theme, color = 'primary', size = 'medium', $hoverEffect = 'scale' }) => {
  const sizes = {
    small: 32,
    medium: 40,
    large: 48,
  };
  
  const actualSize = typeof size === 'number' ? size : sizes[size] || sizes.medium;
  
  return {
    width: actualSize,
    height: actualSize,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)',
    color: theme.palette[color]?.main || theme.palette.primary.main,
    transition: 'all 0.3s ease',
    
    '&:hover': {
      backgroundColor: theme.palette[color]?.main || theme.palette.primary.main,
      color: theme.palette[color]?.contrastText || '#fff',
      ...($hoverEffect === 'scale' && {
        transform: 'scale(1.1)',
      }),
      ...($hoverEffect === 'rotate' && {
        transform: 'rotate(15deg)',
      }),
      ...($hoverEffect === 'bounce' && {
        animation: 'bounce 0.5s',
      }),
    },
    
    '@keyframes bounce': {
      '0%, 100%': {
        transform: 'translateY(0)',
      },
      '50%': {
        transform: 'translateY(-5px)',
      },
    },
  };
});

// Componente de ícone social
const SocialIcon = ({
  icon,
  href,
  color = 'primary',
  size = 'medium',
  tooltip,
  hoverEffect = 'scale',
  target = '_blank',
  rel = 'noopener noreferrer',
  onClick,
  ...props
}) => {
  const button = (
    <StyledIconButton
      color={color}
      size={size}
      $hoverEffect={hoverEffect}
      component={href ? 'a' : 'button'}
      href={href}
      target={href ? target : undefined}
      rel={href ? rel : undefined}
      onClick={onClick}
      aria-label={tooltip || 'Social media icon'}
      {...props}
    >
      {icon}
    </StyledIconButton>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow placement="top">
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default SocialIcon; 