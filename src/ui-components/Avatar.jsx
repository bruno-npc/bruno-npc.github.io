import React from 'react';
import { Avatar as MuiAvatar, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';

// Avatar estilizado com base no MUI Avatar
const StyledAvatar = styled(MuiAvatar)(({ theme, size = 'medium', $glow = false, $glowColor = 'primary' }) => {
  const sizes = {
    small: 40,
    medium: 60,
    large: 100,
    xlarge: 150,
    xxlarge: 200,
  };
  
  const actualSize = typeof size === 'number' ? size : sizes[size] || sizes.medium;
  
  return {
    width: actualSize,
    height: actualSize,
    boxShadow: $glow ? `0 0 15px ${theme.palette[$glowColor]?.main || theme.palette.primary.main}` : 'none',
    border: $glow ? `3px solid ${theme.palette[$glowColor]?.main || theme.palette.primary.main}` : 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  };
});

// Badge estilizada para o avatar
const StyledBadge = styled(Badge)(({ theme, $badgeColor = 'success' }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette[$badgeColor]?.main || '#44b700',
    color: theme.palette[$badgeColor]?.contrastText || '#fff',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

// Componente de avatar personalizado
const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'medium',
  glow = false,
  glowColor = 'primary',
  badge = false,
  badgeColor = 'success',
  ...props
}) => {
  const avatar = (
    <StyledAvatar
      src={src}
      alt={alt}
      size={size}
      $glow={glow}
      $glowColor={glowColor}
      {...props}
    />
  );

  if (badge) {
    return (
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        $badgeColor={badgeColor}
      >
        {avatar}
      </StyledBadge>
    );
  }

  return avatar;
};

export default Avatar; 